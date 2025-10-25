import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define route permissions for each role
const ROLE_ROUTE_PERMISSIONS: Record<string, string[]> = {
  admin: ['*'], // Admin has access to all routes

  // Inventory & Procurement Users
  store_keeper: [
    '/dashboard/inventory',
    '/dashboard/procurement',
  ],
  dept_head_kitchen: [
    '/dashboard/inventory',
    '/dashboard/procurement',
    '/dashboard/business/restaurant/recipe-costing',
  ],
  purchasing_officer: [
    '/dashboard/inventory',
    '/dashboard/procurement',
  ],
  approver_l1: [
    '/dashboard/inventory',
    '/dashboard/procurement',
  ],
  approver_l2: [
    '/dashboard/inventory',
    '/dashboard/procurement',
  ],
  gm: [
    '/dashboard/inventory',
    '/dashboard/procurement',
  ],
  finance_officer: [
    '/dashboard/finance',
    '/dashboard/inventory',
    '/dashboard/procurement',
  ],
  auditor: [
    '/dashboard/finance',
    '/dashboard/inventory',
    '/dashboard/procurement',
  ],

  // Other Roles
  manager: [
    '/dashboard',
    '/dashboard/analytics',
    '/dashboard/forecasting',
    '/dashboard/business',
    '/dashboard/finance',
    '/dashboard/sales',
    '/dashboard/academic',
    '/dashboard/hr',
    '/dashboard/inventory',
    '/dashboard/procurement',
    '/dashboard/facilities',
    '/dashboard/utilities',
    '/dashboard/rent',
    '/dashboard/qurbani',
    '/dashboard/donations',
    '/dashboard/events',
    '/dashboard/feedback',
    '/dashboard/departments',
    '/dashboard/vendor-approvals',
  ],
  staff: [
    '/dashboard/business',
    '/dashboard/inventory',
    '/dashboard/procurement',
  ],
}

// Default landing page for each role after login
const ROLE_DEFAULT_ROUTES: Record<string, string> = {
  admin: '/dashboard',
  store_keeper: '/dashboard/inventory',
  dept_head_kitchen: '/dashboard/inventory/recipe-costing',
  purchasing_officer: '/dashboard/procurement/requisitions',
  approver_l1: '/dashboard/procurement/requisitions',
  approver_l2: '/dashboard/procurement/requisitions',
  gm: '/dashboard/inventory',
  finance_officer: '/dashboard/finance',
  auditor: '/dashboard/finance/reports',
  manager: '/dashboard',
  staff: '/dashboard/business/restaurant',
}

// Check if user has access to a specific route
function hasRouteAccess(userRole: string, requestedPath: string): boolean {
  const allowedRoutes = ROLE_ROUTE_PERMISSIONS[userRole]

  if (!allowedRoutes) return false

  // Admin has access to everything
  if (allowedRoutes.includes('*')) return true

  // Check if requested path matches any allowed route pattern
  return allowedRoutes.some(allowedRoute => {
    // Exact match
    if (requestedPath === allowedRoute) return true

    // Check if requested path starts with allowed route (for sub-routes)
    if (requestedPath.startsWith(allowedRoute + '/')) return true

    return false
  })
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Get current user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth', '/login']
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  )

  // If accessing public route, allow
  if (isPublicRoute) {
    return res
  }

  // If not authenticated, redirect to login
  if (!session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/'
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Get user profile to check role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id, role, is_active, full_name')
    .eq('id', session.user.id)
    .single()

  // If no profile or inactive account, redirect to login
  if (!profile || !profile.is_active) {
    await supabase.auth.signOut()
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  // Special handling: redirect from /dashboard to role-specific default
  if (pathname === '/dashboard') {
    const defaultRoute = ROLE_DEFAULT_ROUTES[profile.role]

    // Only redirect non-admin users to their specific dashboard
    if (profile.role !== 'admin' && defaultRoute) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = defaultRoute
      return NextResponse.redirect(redirectUrl)
    }

    // Admin users can access /dashboard (Executive Dashboard)
    return res
  }

  // Settings page - admin only
  if (pathname.startsWith('/dashboard/settings')) {
    if (profile.role !== 'admin') {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/unauthorized'
      return NextResponse.redirect(redirectUrl)
    }
    return res
  }

  // Check route access for all other dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!hasRouteAccess(profile.role, pathname)) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/unauthorized'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
