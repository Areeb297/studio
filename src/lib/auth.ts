import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createHash } from 'crypto'

export interface LoginCredentials {
  email: string
  password: string
}

export interface UserProfile {
  id: string
  employee_code: string
  full_name: string
  role: string
  email: string
  job_title?: string
  department?: string
  is_active: boolean
  assigned_units?: string[]
  permissions?: Record<string, any>
}

export interface AuthResponse {
  success: boolean
  user?: UserProfile
  error?: string
}

class AuthService {
  private supabase = createClientComponentClient()

  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // First, authenticate with Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (authError) {
        console.error('Authentication error:', authError)
        return {
          success: false,
          error: this.getErrorMessage(authError.message)
        }
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'Authentication failed'
        }
      }

      // Get user profile from database
      const { data: profile, error: profileError } = await this.supabase
        .from('user_profiles')
        .select(`
          id,
          employee_code,
          full_name,
          role,
          email,
          job_title,
          department,
          is_active,
          assigned_units,
          permissions
        `)
        .eq('id', authData.user.id)
        .single()

      if (profileError || !profile) {
        console.error('Profile fetch error:', profileError)
        return {
          success: false,
          error: 'User profile not found'
        }
      }

      // Check if user account is active
      if (!profile.is_active) {
        await this.logout() // Sign out inactive user
        return {
          success: false,
          error: 'Account is deactivated. Please contact administrator.'
        }
      }

      return {
        success: true,
        user: profile as UserProfile
      }

    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: 'An unexpected error occurred'
      }
    }
  }

  /**
   * Sign out current user
   */
  async logout(): Promise<void> {
    try {
      await this.supabase.auth.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      
      if (!user) return null

      const { data: profile, error } = await this.supabase
        .from('user_profiles')
        .select(`
          id,
          employee_code,
          full_name,
          role,
          email,
          job_title,
          department,
          is_active,
          assigned_units,
          permissions
        `)
        .eq('id', user.id)
        .single()

      if (error || !profile) {
        console.error('Profile fetch error:', error)
        return null
      }

      return profile as UserProfile
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(user: UserProfile, permission: string): boolean {
    if (!user || !user.is_active) return false
    
    // Admin has all permissions
    if (user.role === 'admin') return true
    
    // Check specific permissions
    return user.permissions?.[permission] === true
  }

  /**
   * Check if user has access to specific module
   */
  hasModuleAccess(user: UserProfile, module: string): boolean {
    if (!user || !user.is_active) return false

    // Admin has access to all modules
    if (user.role === 'admin') return true

    // Role-based module access - Updated for all 11 roles
    const roleModuleMap: Record<string, string[]> = {
      // Inventory & Procurement Users
      'store_keeper': ['inventory', 'procurement'],
      'dept_head_kitchen': ['inventory', 'procurement', 'business'],
      'purchasing_officer': ['inventory', 'procurement'],
      'approver_l1': ['inventory', 'procurement'],
      'approver_l2': ['inventory', 'procurement'],
      'gm': ['inventory', 'procurement'],
      'finance_officer': ['finance', 'inventory', 'procurement'],
      'auditor': ['finance', 'inventory', 'procurement'],

      // Other Roles
      'manager': ['dashboard', 'reports', 'finance', 'procurement', 'hr', 'business', 'facilities', 'academic', 'inventory'],
      'staff': ['business', 'inventory', 'procurement'],

      // Legacy roles (for backward compatibility)
      'accountant': ['dashboard', 'finance', 'reports'],
      'teacher': ['dashboard', 'academic', 'students'],
    }

    const allowedModules = roleModuleMap[user.role] || []
    return allowedModules.includes(module)
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return {
          success: false,
          error: this.getErrorMessage(error.message)
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Password update error:', error)
      return {
        success: false,
        error: 'Failed to update password'
      }
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        return {
          success: false,
          error: this.getErrorMessage(error.message)
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Password reset error:', error)
      return {
        success: false,
        error: 'Failed to send reset email'
      }
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: UserProfile | null) => void) {
    return this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await this.getCurrentUser()
        callback(profile)
      } else if (event === 'SIGNED_OUT') {
        callback(null)
      }
    })
  }

  /**
   * Get user-friendly error messages
   */
  private getErrorMessage(error: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Invalid email or password',
      'Email not confirmed': 'Please check your email and confirm your account',
      'User not found': 'No account found with this email address',
      'Invalid email': 'Please enter a valid email address',
      'Password should be at least 6 characters': 'Password must be at least 6 characters long',
      'User already registered': 'An account with this email already exists'
    }

    return errorMap[error] || error || 'An error occurred'
  }

  /**
   * Validate password strength
   */
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < 12) {
      errors.push('Password must be at least 12 characters long')
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Export singleton instance
export const authService = new AuthService()

// Default demo credentials for development
export const DEFAULT_CREDENTIALS = {
  admin: {
    email: 'admin@rahah24.com',
    password: 'Admin123!@#'
  },
  manager: {
    email: 'manager@rahah24.com',
    password: 'Manager123!@#'
  },
  staff: {
    email: 'staff@rahah24.com',
    password: 'Staff123!@#'
  }
} as const

// Role permissions configuration - Updated for all 11 roles
export const ROLE_PERMISSIONS = {
  // System Administrator
  admin: {
    all_modules: true,
    user_management: true,
    role_management: true,
    system_settings: true,
    financial_reports: true,
    procurement_approval: true,
    academic_management: true,
    inventory_management: true,
  },

  // Inventory & Procurement Users
  store_keeper: {
    inventory: true,
    stock_management: true,
    stock_issues: true,
    stock_adjustments: true,
    stock_counts: true,
    procurement_view: true,
  },
  dept_head_kitchen: {
    inventory: true,
    procurement: true,
    recipe_costing: true,
    department_requisitions: true,
    approval_under_50k: true,
  },
  purchasing_officer: {
    inventory: true,
    procurement: true,
    purchase_orders: true,
    vendor_management: true,
    grn_management: true,
    invoice_matching: true,
  },
  approver_l1: {
    inventory_view: true,
    procurement_view: true,
    approval_under_50k: true,
  },
  approver_l2: {
    inventory_view: true,
    procurement_view: true,
    approval_under_200k: true,
    budget_tracking: true,
  },
  gm: {
    inventory_view: true,
    procurement_view: true,
    approval_unlimited: true,
    executive_reports: true,
  },
  finance_officer: {
    finance: true,
    inventory_view: true,
    procurement_view: true,
    gl_entries: true,
    invoice_matching: true,
    payment_processing: true,
    financial_reports: true,
  },
  auditor: {
    finance_readonly: true,
    inventory_readonly: true,
    procurement_readonly: true,
    audit_trails: true,
    compliance_reports: true,
  },

  // Other Roles
  manager: {
    dashboard: true,
    reports: true,
    finance: true,
    procurement: true,
    hr: true,
    approval_authority: true,
    business_operations: true,
  },
  staff: {
    dashboard: true,
    pos: true,
    events: true,
    gym: true,
    basic_reports: true,
    inventory_view: true,
  },

  // Legacy roles (for backward compatibility)
  accountant: {
    dashboard: true,
    finance: true,
    reports: true,
    gl_transactions: true,
    fee_collection: true,
  },
  teacher: {
    dashboard: true,
    academic: true,
    students: true,
    attendance: true,
    examinations: true,
  },
} as const