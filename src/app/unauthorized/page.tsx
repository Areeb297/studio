'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertCircle, ArrowLeft, Home } from "lucide-react";
import { authService, type UserProfile } from '@/lib/auth';

// Role default routes - must match middleware.ts
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
};

// Role display names
const ROLE_DISPLAY_NAMES: Record<string, string> = {
  admin: 'System Administrator',
  store_keeper: 'Store Keeper',
  dept_head_kitchen: 'Department Head - Kitchen',
  purchasing_officer: 'Purchasing Officer',
  approver_l1: 'Approver Level 1',
  approver_l2: 'Approver Level 2',
  gm: 'General Manager',
  finance_officer: 'Finance Officer',
  auditor: 'Auditor',
  manager: 'Manager',
  staff: 'Staff',
};

export default function UnauthorizedPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser().then(currentUser => {
      setUser(currentUser);
      setIsLoading(false);
    });
  }, []);

  const handleGoToDashboard = () => {
    if (user) {
      const defaultRoute = ROLE_DEFAULT_ROUTES[user.role] || '/dashboard';
      router.push(defaultRoute);
    } else {
      router.push('/');
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-2 border-destructive/20">
        <CardHeader className="text-center pb-6 space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-destructive/10 relative">
              <Shield className="h-16 w-16 text-destructive" />
              <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-destructive">
                <AlertCircle className="h-6 w-6 text-destructive-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-destructive">
              Access Denied
            </CardTitle>
            <CardDescription className="text-lg">
              You don't have permission to access this page
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* User Info */}
          {user && (
            <div className="bg-secondary/50 rounded-lg p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Current User</span>
                <Badge variant="outline" className="text-sm">
                  {ROLE_DISPLAY_NAMES[user.role] || user.role}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="font-medium">{user.full_name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.employee_code && (
                  <p className="text-sm text-muted-foreground">
                    Employee Code: {user.employee_code}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Explanation */}
          <div className="bg-destructive/10 rounded-lg p-6 space-y-3 border border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-semibold text-destructive">Why am I seeing this?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The page you're trying to access requires specific permissions that aren't assigned
                  to your current role. This is part of our security system to ensure data protection
                  and maintain proper access control across different departments.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleGoToDashboard}
              className="flex-1 h-12 bg-primary hover:bg-primary/90"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to My Dashboard
            </Button>
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="flex-1 h-12"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center pt-4 border-t space-y-2">
            <p className="text-sm text-muted-foreground">
              Need access to this page?
            </p>
            <p className="text-sm font-medium text-primary">
              Contact your system administrator at{' '}
              <a href="mailto:admin@rahah24.com" className="underline hover:no-underline">
                admin@rahah24.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
