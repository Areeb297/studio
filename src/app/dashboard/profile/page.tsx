'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Shield, Activity, Clock, Key, Save } from "lucide-react";

const activitySummary = [
  { label: 'Total Logins', value: '142' },
  { label: 'Last Login', value: '14 Mar 2026, 08:14' },
  { label: 'Actions Today', value: '42' },
  { label: 'Session Duration', value: '2h 14m' },
];

export default function ProfilePage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Account information, security, and activity summary</p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
              AU
            </div>
            <div>
              <h2 className="text-2xl font-bold">Admin User</h2>
              <p className="text-muted-foreground">admin@rahah24.com</p>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-red-100 text-red-700 border-red-300">System Administrator</Badge>
                <Badge className="bg-green-100 text-green-700 border-green-300">Active</Badge>
              </div>
            </div>
            <Button variant="outline" className="ml-auto">
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Info Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile Information
            </CardTitle>
            <CardDescription>Personal and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="Admin" readOnly className="bg-muted/50" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="User" readOnly className="bg-muted/50" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" defaultValue="admin@rahah24.com" readOnly className="bg-muted/50" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+92 300 0000000" readOnly className="bg-muted/50" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dept">Department</Label>
              <Input id="dept" defaultValue="IT Administration" readOnly className="bg-muted/50" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">System Role</Label>
              <Input id="role" defaultValue="System Administrator" readOnly className="bg-muted/50" />
            </div>
          </CardContent>
        </Card>

        {/* Security + Activity */}
        <div className="space-y-6">
          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security
              </CardTitle>
              <CardDescription>Update password and two-factor authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="currentPw">Current Password</Label>
                <Input id="currentPw" type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPw">New Password</Label>
                <Input id="newPw" type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPw">Confirm New Password</Label>
                <Input id="confirmPw" type="password" placeholder="Re-enter new password" />
              </div>
              <Button className="w-full" variant="outline">
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Activity Summary
              </CardTitle>
              <CardDescription>Recent session and action statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {activitySummary.map((stat) => (
                  <div key={stat.label} className="p-3 rounded-lg bg-muted/50 space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {stat.label}
                    </p>
                    <p className="text-lg font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Created</span>
                  <span className="font-medium">01 Oct 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Password Last Changed</span>
                  <span className="font-medium">01 Mar 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Two-Factor Auth</span>
                  <Badge className="bg-amber-100 text-amber-700 border-amber-300">Not Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
