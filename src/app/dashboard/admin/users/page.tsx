'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Users, Activity, Clock, AlertTriangle } from "lucide-react";

const roleBadge: Record<string, string> = {
  'System Admin': 'bg-red-100 text-red-700 border-red-300',
  'Store Keeper': 'bg-blue-100 text-blue-700 border-blue-300',
  'Purchasing Officer': 'bg-purple-100 text-purple-700 border-purple-300',
  'Finance Officer': 'bg-green-100 text-green-700 border-green-300',
  'Approver L1': 'bg-amber-100 text-amber-700 border-amber-300',
};

const initials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const avatarColors = ['bg-blue-500', 'bg-teal-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500'];

const initialUsers = [
  { id: 1, name: 'Admin User', email: 'admin@rahah24.com', role: 'System Admin', lastLogin: '14 Mar 2026, 08:14', active: true, actionsToday: 42 },
  { id: 2, name: 'Store Keeper', email: 'storekeeper@rahah24.com', role: 'Store Keeper', lastLogin: '14 Mar 2026, 09:02', active: true, actionsToday: 18 },
  { id: 3, name: 'Purchasing Officer', email: 'purchasing@rahah24.com', role: 'Purchasing Officer', lastLogin: '14 Mar 2026, 07:45', active: true, actionsToday: 11 },
  { id: 4, name: 'Finance Officer', email: 'finance@rahah24.com', role: 'Finance Officer', lastLogin: '13 Mar 2026, 16:30', active: false, actionsToday: 0 },
  { id: 5, name: 'Approver L1', email: 'approverl1@rahah24.com', role: 'Approver L1', lastLogin: '14 Mar 2026, 10:15', active: true, actionsToday: 7 },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);

  const toggleUser = (id: number) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, active: !u.active } : u));
  };

  const activeNow = users.filter((u) => u.active).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage system users, roles, and access control</p>
        </div>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '5', icon: Users, color: 'text-blue-600' },
          { label: 'Active Now', value: activeNow.toString(), icon: Activity, color: 'text-green-600' },
          { label: 'Pending Actions (roles)', value: '2', icon: AlertTriangle, color: 'text-amber-600' },
          { label: 'Last Login', value: 'Today 10:15', icon: Clock, color: 'text-purple-600' },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>All @rahah24.com accounts with role assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-center">Actions Today</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, idx) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold`}>
                        {initials(user.name)}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge className={roleBadge[user.role]}>{user.role}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell className="text-center font-medium">{user.actionsToday}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={user.active}
                      onCheckedChange={() => toggleUser(user.id)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-1 justify-center">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Reset PW</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
