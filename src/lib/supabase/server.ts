import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Database } from './database.types'

// Use a broad client type to avoid TS errors while database.types is incomplete.
// Once you generate full Supabase types, switch back to <Database>.
export const createServerClient = () => 
  createServerComponentClient<any>({ cookies })

// Admin client using service role for server-side mutations (API routes only)
export const createAdminClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string
  // Same rationale as above: use any until full types are generated
  return createClient<any>(url, key)
}

// Helper functions for server-side operations
export const supabaseServerHelpers = {
  // Get current user profile (server-side)
  async getCurrentUserProfile() {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return { data, error }
  },

  // Get dashboard data for specific business unit
  async getDashboardData(organizationUnitCode: string) {
    const supabase = createServerClient()
    const today = new Date().toISOString().split('T')[0]
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
    
    // Get organization unit
    const { data: orgUnit } = await supabase
      .from('organization_units')
      .select('*')
      .eq('code', organizationUnitCode)
      .single()
    
    if (!orgUnit) return null

    // Get daily summary for today
    const { data: todaySummary } = await supabase
      .from('daily_financial_summary')
      .select('*')
      .eq('organization_unit_id', orgUnit.id)
      .eq('summary_date', today)
      .single()

    // Get monthly summary
    const { data: monthlySummary } = await supabase
      .from('daily_financial_summary')
      .select('*')
      .eq('organization_unit_id', orgUnit.id)
      .gte('summary_date', monthStart)
      .lte('summary_date', today)

    // Get recent alerts
    const { data: alerts } = await supabase
      .from('system_alerts')
      .select('*')
      .eq('organization_unit_id', orgUnit.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(5)

    return {
      organizationUnit: orgUnit,
      todaySummary,
      monthlySummary,
      alerts
    }
  },

  // Get restaurant-specific dashboard data
  async getRestaurantDashboardData() {
    const supabase = createServerClient()
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    
    // Get restaurant organization unit
    const { data: restaurant } = await supabase
      .from('organization_units')
      .select('*')
      .eq('code', 'REST')
      .single()

    if (!restaurant) return null

    // Today's sales summary
    const { data: todaySales } = await supabase
      .from('sales_orders')
      .select('total_amount, order_status, payment_status')
      .gte('order_date', today + 'T00:00:00')
      .lte('order_date', today + 'T23:59:59')

    // Yesterday's sales for comparison
    const { data: yesterdaySales } = await supabase
      .from('sales_orders')
      .select('total_amount')
      .gte('order_date', yesterday + 'T00:00:00')
      .lte('order_date', yesterday + 'T23:59:59')
      .eq('payment_status', 'paid')

    // Top selling items today
    const { data: topItems } = await supabase
      .from('sales_order_items')
      .select(`
        menu_items(name),
        quantity,
        total_price
      `)
      .gte('created_at', today + 'T00:00:00')
      .order('quantity', { ascending: false })
      .limit(5)

    // Low stock items
    const { data: lowStock } = await supabase
      .from('inventory_items')
      .select('name, current_stock, minimum_stock')
      .eq('organization_unit_id', restaurant.id)
      .filter('current_stock', 'lte', 'minimum_stock')
      .limit(5)

    return {
      restaurant,
      todaySales,
      yesterdaySales,
      topItems,
      lowStock
    }
  },

  // Get academic dashboard data
  async getAcademicDashboardData() {
    const supabase = createServerClient()
    
    // Get academic organization unit
    const { data: academic } = await supabase
      .from('organization_units')
      .select('*')
      .eq('code', 'TAHF')
      .single()

    if (!academic) return null

    // Total active students
    const { data: totalStudents, count: studentCount } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('student_status', 'active')

    // Students by class
    const { data: studentsByClass } = await supabase
      .from('students')
      .select(`
        academic_classes(class_name),
        student_status
      `)
      .eq('student_status', 'active')

    // Pending fees this month
    const currentMonth = new Date().toISOString().slice(0, 7) + '-01'
    const { data: pendingFees } = await supabase
      .from('student_fees')
      .select('net_amount')
      .eq('payment_status', 'pending')
      .gte('fee_month', currentMonth)

    // Recent examinations
    const { data: recentExams } = await supabase
      .from('examinations')
      .select(`
        *,
        academic_classes(class_name)
      `)
      .order('exam_date', { ascending: false })
      .limit(5)

    return {
      academic,
      studentCount,
      studentsByClass,
      pendingFees,
      recentExams
    }
  },

  // Get events dashboard data
  async getEventsDashboardData() {
    const supabase = createServerClient()
    const today = new Date().toISOString().split('T')[0]
    const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
    
    // Get events organization unit
    const { data: events } = await supabase
      .from('organization_units')
      .select('*')
      .eq('code', 'LAWN')
      .single()

    if (!events) return null

    // Upcoming events this month
    const { data: upcomingEvents } = await supabase
      .from('event_bookings')
      .select(`
        *,
        customers(name),
        event_packages(package_name)
      `)
      .gte('event_date', today)
      .lte('event_date', monthEnd)
      .eq('booking_status', 'confirmed')
      .order('event_date')

    // Revenue this month
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
    const { data: monthlyRevenue } = await supabase
      .from('event_bookings')
      .select('total_amount')
      .gte('event_date', monthStart)
      .lte('event_date', monthEnd)
      .eq('booking_status', 'completed')

    // Popular packages
    const { data: popularPackages } = await supabase
      .from('event_bookings')
      .select(`
        event_packages(package_name),
        total_amount
      `)
      .gte('event_date', monthStart)
      .order('total_amount', { ascending: false })
      .limit(5)

    return {
      events,
      upcomingEvents,
      monthlyRevenue,
      popularPackages
    }
  },

  // Get gym dashboard data
  async getGymDashboardData() {
    const supabase = createServerClient()
    const today = new Date().toISOString().split('T')[0]
    
    // Get gym organization unit
    const { data: gym } = await supabase
      .from('organization_units')
      .select('*')
      .eq('code', 'GYM')
      .single()

    if (!gym) return null

    // Active memberships
    const { data: activeMemberships, count: memberCount } = await supabase
      .from('gym_memberships')
      .select('*', { count: 'exact', head: true })
      .eq('membership_status', 'active')

    // Today's check-ins
    const { data: todayCheckins } = await supabase
      .from('gym_member_checkins')
      .select(`
        *,
        gym_memberships(
          customers(name)
        )
      `)
      .gte('check_in_time', today + 'T00:00:00')
      .lte('check_in_time', today + 'T23:59:59')

    // Expiring memberships (next 30 days)
    const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const { data: expiringMemberships } = await supabase
      .from('gym_memberships')
      .select(`
        *,
        customers(name, phone)
      `)
      .eq('membership_status', 'active')
      .gte('end_date', today)
      .lte('end_date', futureDate)

    // Equipment maintenance due
    const { data: maintenanceDue } = await supabase
      .from('gym_equipment')
      .select('*')
      .lte('next_maintenance_date', futureDate)
      .eq('is_active', true)

    return {
      gym,
      memberCount,
      todayCheckins,
      expiringMemberships,
      maintenanceDue
    }
  }
}