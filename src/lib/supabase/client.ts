import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
// Temporarily relax types until full database types are generated
export const createClient = () => createClientComponentClient<any>()

// Convenience function for client-side operations
export const supabase = createClient()

// Helper functions for common operations
export const supabaseHelpers = {
  // Get current user profile
  async getCurrentUserProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return { data, error }
  },

  // Get organization units for current user
  async getUserOrganizationUnits() {
    const profile = await this.getCurrentUserProfile()
    if (!profile || !profile.data) return { data: [], error: profile?.error }
    
    const { data, error } = await supabase
      .from('organization_units')
      .select('*')
      .overlaps('id', profile.data.assigned_units || [])
    
    return { data, error }
  },

  // Get trial balance for a specific organization unit
  async getTrialBalance(organizationUnitId?: string) {
    let query = supabase.from('trial_balance').select('*')
    
    if (organizationUnitId) {
      query = query.eq('organization_unit_id', organizationUnitId)
    }
    
    return await query.order('code')
  },

  // Get income statement data
  async getIncomeStatement(year: number, month?: number, organizationUnitId?: string) {
    let query = supabase
      .from('income_statement')
      .select('*')
      .eq('year', year)
    
    if (month) {
      query = query.eq('month', month)
    }
    
    if (organizationUnitId) {
      query = query.eq('organization_unit_id', organizationUnitId)
    }
    
    return await query.order('account_type').order('account_category')
  },

  // Get balance sheet data
  async getBalanceSheet(organizationUnitId?: string) {
    let query = supabase.from('balance_sheet').select('*')
    
    if (organizationUnitId) {
      query = query.eq('organization_unit_id', organizationUnitId)
    }
    
    return await query.order('account_type').order('account_category')
  },

  // Get daily financial summary
  async getDailyFinancialSummary(startDate: string, endDate: string, organizationUnitId?: string) {
    let query = supabase
      .from('daily_financial_summary')
      .select(`
        *,
        organization_units(name, code)
      `)
      .gte('summary_date', startDate)
      .lte('summary_date', endDate)
    
    if (organizationUnitId) {
      query = query.eq('organization_unit_id', organizationUnitId)
    }
    
    return await query.order('summary_date', { ascending: false })
  },

  // Get restaurant sales data
  async getRestaurantSales(startDate: string, endDate: string) {
    return await supabase
      .from('sales_orders')
      .select(`
        *,
        sales_order_items(
          *,
          menu_items(name, category:menu_categories(name))
        ),
        customers(name, phone),
        user_profiles!sales_orders_waiter_id_fkey(full_name)
      `)
      .gte('order_date', startDate)
      .lte('order_date', endDate)
      .order('order_date', { ascending: false })
  },

  // Get student academic data
  async getStudentAcademicData(classId?: string, academicTermId?: string) {
    let query = supabase
      .from('students')
      .select(`
        *,
        academic_classes(class_name, teacher:user_profiles(full_name)),
        student_fees(
          fee_type,
          net_amount,
          payment_status,
          due_date
        ),
        student_progress(
          progress_date,
          performance_score,
          attendance_percentage
        )
      `)
      .eq('student_status', 'active')
    
    if (classId) {
      query = query.eq('current_class_id', classId)
    }
    
    return await query.order('first_name')
  },

  // Get event bookings data
  async getEventBookings(startDate: string, endDate: string) {
    return await supabase
      .from('event_bookings')
      .select(`
        *,
        customers(name, phone),
        event_packages(package_name),
        event_venues(venue_name),
        user_profiles!event_bookings_event_coordinator_id_fkey(full_name)
      `)
      .gte('event_date', startDate)
      .lte('event_date', endDate)
      .order('event_date', { ascending: false })
  },

  // Get gym memberships data
  async getGymMemberships(status: string = 'active') {
    return await supabase
      .from('gym_memberships')
      .select(`
        *,
        customers(name, phone),
        gym_membership_plans(plan_name, monthly_fee),
        trainer:user_profiles!gym_memberships_trainer_assigned_id_fkey(full_name)
      `)
      .eq('membership_status', status)
      .order('start_date', { ascending: false })
  },

  // Get inventory items with low stock alerts
  async getLowStockItems() {
    return await supabase
      .from('inventory_items')
      .select(`
        *,
        inventory_categories(name),
        organization_units(name)
      `)
      .filter('current_stock', 'lte', 'minimum_stock')
      .eq('is_active', true)
      .order('current_stock')
  },

  // Get system alerts
  async getSystemAlerts(isRead: boolean = false, severity?: string) {
    let query = supabase
      .from('system_alerts')
      .select(`
        *,
        organization_units(name),
        assigned_user:user_profiles!system_alerts_assigned_to_fkey(full_name)
      `)
      .eq('is_read', isRead)
    
    if (severity) {
      query = query.eq('severity', severity)
    }
    
    return await query.order('created_at', { ascending: false })
  }
}