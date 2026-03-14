// Prototype Auth Service — No Supabase, no real auth
// Mock admin user for all sessions (SQL Server is the real DB)

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
  // Mock admin user — always logged in
  private mockAdminUser: UserProfile = {
    id: 'mock-admin-id',
    employee_code: 'ADMIN001',
    full_name: 'System Administrator',
    role: 'admin',
    email: 'admin@rahah24.com',
    job_title: 'System Administrator',
    department: 'IT',
    is_active: true,
    assigned_units: ['all'],
    permissions: { all: true }
  }

  async login(_credentials: LoginCredentials): Promise<AuthResponse> {
    return { success: true, user: this.mockAdminUser }
  }

  async logout(): Promise<void> {
    // No-op for prototype
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    return this.mockAdminUser
  }

  hasPermission(user: UserProfile, _permission: string): boolean {
    if (!user || !user.is_active) return false
    if (user.role === 'admin') return true
    return user.permissions?.[_permission] === true
  }

  hasModuleAccess(user: UserProfile, module: string): boolean {
    if (!user || !user.is_active) return false
    if (user.role === 'admin') return true

    const roleModuleMap: Record<string, string[]> = {
      store_keeper: ['inventory', 'procurement'],
      dept_head_kitchen: ['inventory', 'procurement', 'business'],
      purchasing_officer: ['inventory', 'procurement'],
      approver_l1: ['inventory', 'procurement'],
      approver_l2: ['inventory', 'procurement'],
      gm: ['inventory', 'procurement'],
      finance_officer: ['finance', 'inventory', 'procurement'],
      auditor: ['finance', 'inventory', 'procurement'],
      manager: ['dashboard', 'reports', 'finance', 'procurement', 'hr', 'business', 'facilities', 'academic', 'inventory'],
      staff: ['business', 'inventory', 'procurement'],
    }

    const allowedModules = roleModuleMap[user.role] || []
    return allowedModules.includes(module)
  }

  async updatePassword(_newPassword: string): Promise<AuthResponse> {
    return { success: true }
  }

  async resetPassword(_email: string): Promise<AuthResponse> {
    return { success: true }
  }

  onAuthStateChange(callback: (user: UserProfile | null) => void) {
    callback(this.mockAdminUser)
    return { data: { subscription: { unsubscribe: () => {} } } }
  }

  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    if (password.length < 12) errors.push('Password must be at least 12 characters long')
    if (!/[A-Z]/.test(password)) errors.push('Must contain uppercase')
    if (!/[a-z]/.test(password)) errors.push('Must contain lowercase')
    if (!/[0-9]/.test(password)) errors.push('Must contain number')
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push('Must contain special character')
    return { isValid: errors.length === 0, errors }
  }
}

export const authService = new AuthService()

export const DEFAULT_CREDENTIALS = {
  admin: { email: 'admin@rahah24.com', password: 'Admin123!@#' },
  manager: { email: 'manager@rahah24.com', password: 'Manager123!@#' },
  staff: { email: 'staff@rahah24.com', password: 'Staff123!@#' },
} as const

export const ROLE_PERMISSIONS = {
  admin: { all_modules: true, user_management: true, role_management: true, system_settings: true, financial_reports: true, procurement_approval: true, academic_management: true, inventory_management: true },
  store_keeper: { inventory: true, stock_management: true, stock_issues: true, stock_adjustments: true, stock_counts: true, procurement_view: true },
  dept_head_kitchen: { inventory: true, procurement: true, recipe_costing: true, department_requisitions: true, approval_under_50k: true },
  purchasing_officer: { inventory: true, procurement: true, purchase_orders: true, vendor_management: true, grn_management: true, invoice_matching: true },
  approver_l1: { inventory_view: true, procurement_view: true, approval_under_50k: true },
  approver_l2: { inventory_view: true, procurement_view: true, approval_under_200k: true, budget_tracking: true },
  gm: { inventory_view: true, procurement_view: true, approval_unlimited: true, executive_reports: true },
  finance_officer: { finance: true, inventory_view: true, procurement_view: true, gl_entries: true, invoice_matching: true, payment_processing: true, financial_reports: true },
  auditor: { finance_readonly: true, inventory_readonly: true, procurement_readonly: true, audit_trails: true, compliance_reports: true },
  manager: { dashboard: true, reports: true, finance: true, procurement: true, hr: true, approval_authority: true, business_operations: true },
  staff: { dashboard: true, pos: true, events: true, gym: true, basic_reports: true, inventory_view: true },
  accountant: { dashboard: true, finance: true, reports: true, gl_transactions: true, fee_collection: true },
  teacher: { dashboard: true, academic: true, students: true, attendance: true, examinations: true },
} as const
