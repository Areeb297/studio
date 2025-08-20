'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  Users,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  MoreHorizontal,
  Building,
  Phone,
  Mail,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Vendor {
  id: string;
  vendorCode: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: 'active' | 'inactive' | 'suspended';
  rating: number;
  totalOrders: number;
  totalValue: number;
  onTimeDelivery: number;
  qualityRating: number;
  registrationDate: Date;
  lastOrderDate?: Date;
  paymentTerms: string;
  creditLimit: number;
}

const mockVendors: Vendor[] = [
  {
    id: 'vendor-001',
    vendorCode: 'VEN-001',
    name: 'ABC Kitchen Supplies',
    contactPerson: 'Ahmad Hassan',
    email: 'contact@abckitchen.com',
    phone: '+92-300-1234567',
    address: 'Industrial Area, Karachi',
    category: 'Kitchen Equipment',
    status: 'active',
    rating: 4.5,
    totalOrders: 45,
    totalValue: 2500000,
    onTimeDelivery: 92,
    qualityRating: 4.2,
    registrationDate: new Date('2023-03-15'),
    lastOrderDate: new Date('2024-01-16'),
    paymentTerms: 'Net 30',
    creditLimit: 500000
  },
  {
    id: 'vendor-002',
    vendorCode: 'VEN-002',
    name: 'XYZ Office Solutions',
    contactPerson: 'Fatima Ahmed',
    email: 'sales@xyzoffice.com',
    phone: '+92-301-2345678',
    address: 'Commercial Area, Lahore',
    category: 'Office Supplies',
    status: 'active',
    rating: 4.8,
    totalOrders: 78,
    totalValue: 1200000,
    onTimeDelivery: 98,
    qualityRating: 4.7,
    registrationDate: new Date('2022-08-20'),
    lastOrderDate: new Date('2024-01-17'),
    paymentTerms: 'Net 15',
    creditLimit: 300000
  },
  {
    id: 'vendor-003',
    vendorCode: 'VEN-003',
    name: 'TechCorp Solutions',
    contactPerson: 'Omar Sheikh',
    email: 'info@techcorp.pk',
    phone: '+92-302-3456789',
    address: 'Technology Park, Islamabad',
    category: 'IT Equipment',
    status: 'active',
    rating: 4.3,
    totalOrders: 23,
    totalValue: 3200000,
    onTimeDelivery: 87,
    qualityRating: 4.5,
    registrationDate: new Date('2023-11-10'),
    lastOrderDate: new Date('2024-01-18'),
    paymentTerms: 'Net 45',
    creditLimit: 1000000
  },
  {
    id: 'vendor-004',
    vendorCode: 'VEN-004',
    name: 'General Supplies Ltd',
    contactPerson: 'Ali Raza',
    email: 'orders@generalsupplies.com',
    phone: '+92-303-4567890',
    address: 'Warehouse District, Faisalabad',
    category: 'General Supplies',
    status: 'active',
    rating: 3.9,
    totalOrders: 67,
    totalValue: 890000,
    onTimeDelivery: 84,
    qualityRating: 3.8,
    registrationDate: new Date('2022-12-05'),
    lastOrderDate: new Date('2024-01-19'),
    paymentTerms: 'Net 30',
    creditLimit: 200000
  },
  {
    id: 'vendor-005',
    vendorCode: 'VEN-005',
    name: 'Premium Food Distributors',
    contactPerson: 'Sarah Khan',
    email: 'sales@premiumfood.pk',
    phone: '+92-304-5678901',
    address: 'Food Street, Karachi',
    category: 'Food & Beverages',
    status: 'suspended',
    rating: 3.2,
    totalOrders: 12,
    totalValue: 450000,
    onTimeDelivery: 68,
    qualityRating: 3.1,
    registrationDate: new Date('2023-06-12'),
    lastOrderDate: new Date('2023-12-15'),
    paymentTerms: 'Net 30',
    creditLimit: 150000
  }
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.vendorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-700';
      case 'inactive': return 'bg-gray-500/20 text-gray-700';
      case 'suspended': return 'bg-red-500/20 text-red-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-3 w-3 fill-current text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-3 w-3 fill-current text-yellow-400 opacity-50" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />);
    }

    return <div className="flex items-center space-x-1">{stars}</div>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Vendor Management</h1>
          <p className="text-muted-foreground">Manage vendor relationships and track performance metrics</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>
                Register a new vendor with complete information and documents.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendorName">Vendor Name</Label>
                  <Input id="vendorName" placeholder="ABC Supplies Ltd" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input id="contactPerson" placeholder="John Doe" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="contact@vendor.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+92-300-1234567" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Complete address..." rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kitchen">Kitchen Equipment</SelectItem>
                      <SelectItem value="office">Office Supplies</SelectItem>
                      <SelectItem value="it">IT Equipment</SelectItem>
                      <SelectItem value="general">General Supplies</SelectItem>
                      <SelectItem value="food">Food & Beverages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net15">Net 15</SelectItem>
                      <SelectItem value="net30">Net 30</SelectItem>
                      <SelectItem value="net45">Net 45</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="creditLimit">Credit Limit (PKR)</Label>
                <Input id="creditLimit" type="number" placeholder="500000" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Add Vendor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search vendors by name, code, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vendors</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-xs text-muted-foreground">
              +3 new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vendors.filter(v => v.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently approved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of 5.0 stars
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              PKR {vendors.reduce((sum, v) => sum + v.totalValue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All-time total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Vendors</CardTitle>
          <CardDescription>
            Complete vendor directory with performance metrics and contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>On-Time %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{vendor.name}</div>
                      <div className="text-sm text-muted-foreground">{vendor.vendorCode}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{vendor.contactPerson}</div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{vendor.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{vendor.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{vendor.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {renderStarRating(vendor.rating)}
                      <div className={`text-sm font-medium ${getRatingColor(vendor.rating)}`}>
                        {vendor.rating.toFixed(1)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{vendor.totalOrders}</div>
                      <div className="text-xs text-muted-foreground">orders</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      PKR {vendor.totalValue.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={vendor.onTimeDelivery} className="h-2" />
                      <div className="text-xs text-center">{vendor.onTimeDelivery}%</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(vendor.status)}>
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Create PO
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Building className="mr-2 h-4 w-4" />
                          View Orders
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Vendors</CardTitle>
            <CardDescription>Based on rating and on-time delivery</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendors
                .filter(v => v.status === 'active')
                .sort((a, b) => (b.rating + b.onTimeDelivery / 100) - (a.rating + a.onTimeDelivery / 100))
                .slice(0, 3)
                .map((vendor, index) => (
                  <div key={vendor.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{vendor.name}</h4>
                        <p className="text-sm text-muted-foreground">{vendor.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                        <span className="font-medium">{vendor.rating.toFixed(1)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{vendor.onTimeDelivery}% on-time</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Categories</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(
                vendors.reduce((acc, vendor) => {
                  acc[vendor.category] = (acc[vendor.category] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="font-medium">{category}</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ width: `${(count / vendors.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}