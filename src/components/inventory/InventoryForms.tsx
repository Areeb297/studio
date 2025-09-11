'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Plus,
  Truck,
  Users,
  FileText,
  Building,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  X
} from "lucide-react";
import { type EnhancedInventoryItem, type Vendor } from '@/lib/inventory-enhanced-data';

// Form Interfaces
interface NewItemFormData {
  code: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  departments: string[];
  unit: string;
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  primaryStore: string;
  storageLocation: string;
  binLocation: string;
  preferredVendor: string;
  unitCost: number;
  shelfLife: string;
  tags: string[];
}

interface PurchaseOrderFormData {
  vendorId: string;
  requestedBy: string;
  department: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  expectedDelivery: string;
  items: {
    itemCode: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  notes: string;
}

interface GRNFormData {
  poNumber: string;
  vendor: string;
  receivedBy: string;
  receivedDate: string;
  items: {
    itemCode: string;
    orderedQty: number;
    receivedQty: number;
    condition: 'GOOD' | 'DAMAGED' | 'EXPIRED';
    remarks: string;
  }[];
}

interface StockAdjustmentFormData {
  adjustmentType: 'PHYSICAL_COUNT' | 'DAMAGE' | 'EXPIRED' | 'THEFT' | 'OTHER';
  reason: string;
  approvedBy: string;
  items: {
    itemCode: string;
    currentStock: number;
    adjustedStock: number;
    variance: number;
    reason: string;
  }[];
}

interface VendorFormData {
  vendorCode: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  categories: string[];
  paymentTerms: string;
  creditDays: number;
  iban: string;
  accountTitle: string;
  branch: string;
}

// Form Components
export const NewItemForm = ({ onSubmit, onCancel }: { 
  onSubmit: (data: NewItemFormData) => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState<NewItemFormData>({
    code: '',
    name: '',
    description: '',
    category: '',
    subCategory: '',
    departments: [],
    unit: '',
    minStock: 0,
    maxStock: 0,
    reorderLevel: 0,
    reorderQuantity: 0,
    primaryStore: '',
    storageLocation: '',
    binLocation: '',
    preferredVendor: '',
    unitCost: 0,
    shelfLife: '',
    tags: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Add New Inventory Item
        </CardTitle>
        <CardDescription>
          Complete item master data entry for inventory tracking and management
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-code">Item Code *</Label>
                <Input 
                  id="item-code"
                  placeholder="e.g., INV-001"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="item-name">Item Name *</Label>
                <Input 
                  id="item-name"
                  placeholder="e.g., Double Light Plug"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                placeholder="Detailed item description..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Classification */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Classification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONSUMABLE">Consumable</SelectItem>
                    <SelectItem value="FIXED_ASSET">Fixed Asset</SelectItem>
                    <SelectItem value="RAW_MATERIAL">Raw Material</SelectItem>
                    <SelectItem value="FINISHED_GOODS">Finished Goods</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sub-category">Sub Category</Label>
                <Input 
                  id="sub-category"
                  placeholder="e.g., Electrical Items"
                  value={formData.subCategory}
                  onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Departments</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Restaurant', 'Administration', 'Construction', 'Maintenance', 'Security', 'Janitorial', 'Academic', 'IT'].map((dept) => (
                  <div key={dept} className="flex items-center space-x-2">
                    <Checkbox 
                      id={dept}
                      checked={formData.departments.includes(dept)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({...formData, departments: [...formData.departments, dept]});
                        } else {
                          setFormData({...formData, departments: formData.departments.filter(d => d !== dept)});
                        }
                      }}
                    />
                    <Label htmlFor={dept} className="text-sm">{dept}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Stock Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Stock Management</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit">Unit of Measure *</Label>
                <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PCS">Pieces</SelectItem>
                    <SelectItem value="KG">Kilograms</SelectItem>
                    <SelectItem value="LTR">Liters</SelectItem>
                    <SelectItem value="BOX">Boxes</SelectItem>
                    <SelectItem value="SET">Sets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="min-stock">Min Stock Level</Label>
                <Input 
                  id="min-stock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reorder-level">Reorder Level *</Label>
                <Input 
                  id="reorder-level"
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({...formData, reorderLevel: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-stock">Max Stock Level</Label>
                <Input 
                  id="max-stock"
                  type="number"
                  value={formData.maxStock}
                  onChange={(e) => setFormData({...formData, maxStock: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Location & Storage */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Location & Storage</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary-store">Primary Store *</Label>
                <Select value={formData.primaryStore} onValueChange={(value) => setFormData({...formData, primaryStore: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Store">Main Store</SelectItem>
                    <SelectItem value="Restaurant Store">Restaurant Store</SelectItem>
                    <SelectItem value="Maintenance Store">Maintenance Store</SelectItem>
                    <SelectItem value="Construction Store">Construction Store</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storage-location">Storage Location</Label>
                <Input 
                  id="storage-location"
                  placeholder="e.g., Zone A-Aisle 1-Rack 5"
                  value={formData.storageLocation}
                  onChange={(e) => setFormData({...formData, storageLocation: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bin-location">Bin Location</Label>
                <Input 
                  id="bin-location"
                  placeholder="e.g., Bin 23"
                  value={formData.binLocation}
                  onChange={(e) => setFormData({...formData, binLocation: e.target.value})}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Financial & Vendor */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Financial & Vendor Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit-cost">Unit Cost (PKR)</Label>
                <Input 
                  id="unit-cost"
                  type="number"
                  step="0.01"
                  value={formData.unitCost}
                  onChange={(e) => setFormData({...formData, unitCost: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferred-vendor">Preferred Vendor</Label>
                <Select value={formData.preferredVendor} onValueChange={(value) => setFormData({...formData, preferredVendor: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Al-Noor Trading">Al-Noor Trading</SelectItem>
                    <SelectItem value="Karachi Suppliers">Karachi Suppliers</SelectItem>
                    <SelectItem value="Metro Wholesale">Metro Wholesale</SelectItem>
                    <SelectItem value="City Hardware">City Hardware</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <CheckCircle className="w-4 h-4 mr-2" />
              Create Item
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export const PurchaseOrderForm = ({ onSubmit, onCancel }: { 
  onSubmit: (data: PurchaseOrderFormData) => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState<PurchaseOrderFormData>({
    vendorId: '',
    requestedBy: '',
    department: '',
    priority: 'MEDIUM',
    expectedDelivery: '',
    items: [{ itemCode: '', itemName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
    notes: ''
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemCode: '', itemName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = formData.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    });
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="max-w-6xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Create Purchase Order
        </CardTitle>
        <CardDescription>
          Generate purchase order with 3-level approval workflow integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Purchase Order Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor *</Label>
                <Select value={formData.vendorId} onValueChange={(value) => setFormData({...formData, vendorId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="V001">Al-Noor Trading</SelectItem>
                    <SelectItem value="V002">Karachi Suppliers</SelectItem>
                    <SelectItem value="V003">Metro Wholesale</SelectItem>
                    <SelectItem value="V004">City Hardware</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="requested-by">Requested By *</Label>
                <Input 
                  id="requested-by"
                  placeholder="Employee name"
                  value={formData.requestedBy}
                  onChange={(e) => setFormData({...formData, requestedBy: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Restaurant">Restaurant</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(value: any) => setFormData({...formData, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected-delivery">Expected Delivery Date</Label>
                <Input 
                  id="expected-delivery"
                  type="date"
                  value={formData.expectedDelivery}
                  onChange={(e) => setFormData({...formData, expectedDelivery: e.target.value})}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Items Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Order Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label>Item Code</Label>
                      <Input 
                        placeholder="e.g., INV-001"
                        value={item.itemCode}
                        onChange={(e) => updateItem(index, 'itemCode', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label>Item Name</Label>
                      <Input 
                        placeholder="Item description"
                        value={item.itemName}
                        onChange={(e) => updateItem(index, 'itemName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input 
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit Price</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                        {formData.items.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon"
                            onClick={() => removeItem(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-right">
                    <span className="text-sm text-muted-foreground">
                      Total: PKR {item.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="text-right">
              <div className="text-lg font-semibold">
                Grand Total: PKR {formData.items.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString()}
              </div>
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea 
              id="notes"
              placeholder="Special instructions, delivery requirements, etc..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <FileText className="w-4 h-4 mr-2" />
              Create Purchase Order
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export const GoodsReceiptForm = ({ onSubmit, onCancel }: { 
  onSubmit: (data: GRNFormData) => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState<GRNFormData>({
    poNumber: '',
    vendor: '',
    receivedBy: '',
    receivedDate: new Date().toISOString().split('T')[0],
    items: [{ itemCode: '', orderedQty: 0, receivedQty: 0, condition: 'GOOD', remarks: '' }]
  });

  return (
    <Card className="max-w-5xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Goods Receipt Note (GRN)
        </CardTitle>
        <CardDescription>
          Record received items with quality checks and FEFO compliance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="po-number">PO Number *</Label>
              <Input 
                id="po-number"
                placeholder="PO-2024-001"
                value={formData.poNumber}
                onChange={(e) => setFormData({...formData, poNumber: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor-grn">Vendor</Label>
              <Input 
                id="vendor-grn"
                placeholder="Vendor name"
                value={formData.vendor}
                onChange={(e) => setFormData({...formData, vendor: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="received-by">Received By *</Label>
              <Input 
                id="received-by"
                placeholder="Store keeper name"
                value={formData.receivedBy}
                onChange={(e) => setFormData({...formData, receivedBy: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Items with Quality Check */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Item Verification</h3>
            {formData.items.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="space-y-2">
                    <Label>Item Code</Label>
                    <Input placeholder="INV-001" />
                  </div>
                  <div className="space-y-2">
                    <Label>Ordered Qty</Label>
                    <Input type="number" placeholder="100" />
                  </div>
                  <div className="space-y-2">
                    <Label>Received Qty</Label>
                    <Input type="number" placeholder="98" />
                  </div>
                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <Select defaultValue="GOOD">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GOOD">Good</SelectItem>
                        <SelectItem value="DAMAGED">Damaged</SelectItem>
                        <SelectItem value="EXPIRED">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Remarks</Label>
                    <Input placeholder="Quality check notes..." />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <Truck className="w-4 h-4 mr-2" />
              Generate GRN
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export const VendorRegistrationForm = ({ onSubmit, onCancel }: { 
  onSubmit: (data: VendorFormData) => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState<VendorFormData>({
    vendorCode: '',
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    categories: [],
    paymentTerms: '',
    creditDays: 0,
    iban: '',
    accountTitle: '',
    branch: ''
  });

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Vendor Registration
        </CardTitle>
        <CardDescription>
          Complete vendor onboarding with approval workflow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor-code">Vendor Code *</Label>
                <Input 
                  id="vendor-code"
                  placeholder="VEN-001"
                  value={formData.vendorCode}
                  onChange={(e) => setFormData({...formData, vendorCode: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name *</Label>
                <Input 
                  id="company-name"
                  placeholder="Al-Noor Trading Company"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-person">Contact Person *</Label>
                <Input 
                  id="contact-person"
                  placeholder="Muhammad Ahmed"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone-vendor">Phone *</Label>
                <Input 
                  id="phone-vendor"
                  placeholder="+92-300-1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-vendor">Email</Label>
                <Input 
                  id="email-vendor"
                  type="email"
                  placeholder="contact@alnoor.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address-vendor">Address</Label>
              <Textarea 
                id="address-vendor"
                placeholder="Complete business address..."
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows={3}
              />
            </div>
          </div>

          {/* Business Terms */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Business Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payment-terms">Payment Terms</Label>
                <Select value={formData.paymentTerms} onValueChange={(value) => setFormData({...formData, paymentTerms: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash on Delivery</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    <SelectItem value="CREDIT">Credit Terms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="credit-days">Credit Days</Label>
                <Input 
                  id="credit-days"
                  type="number"
                  placeholder="30"
                  value={formData.creditDays}
                  onChange={(e) => setFormData({...formData, creditDays: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>

          {/* Banking Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Banking Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="iban">IBAN</Label>
                <Input 
                  id="iban"
                  placeholder="PK36SCBL0000001123456702"
                  value={formData.iban}
                  onChange={(e) => setFormData({...formData, iban: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-title">Account Title</Label>
                <Input 
                  id="account-title"
                  placeholder="Al-Noor Trading Company"
                  value={formData.accountTitle}
                  onChange={(e) => setFormData({...formData, accountTitle: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input 
                  id="branch"
                  placeholder="Karachi Main Branch"
                  value={formData.branch}
                  onChange={(e) => setFormData({...formData, branch: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <Users className="w-4 h-4 mr-2" />
              Register Vendor
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export const InventoryFormsContainer = () => {
  const [activeForm, setActiveForm] = useState<string | null>(null);

  const handleFormSubmit = (formType: string, data: any) => {
    console.log(`${formType} submitted:`, data);
    setActiveForm(null);
    // Here you would typically send data to your backend
  };

  const handleFormCancel = () => {
    setActiveForm(null);
  };

  if (activeForm) {
    switch (activeForm) {
      case 'new-item':
        return <NewItemForm onSubmit={(data) => handleFormSubmit('New Item', data)} onCancel={handleFormCancel} />;
      case 'purchase-order':
        return <PurchaseOrderForm onSubmit={(data) => handleFormSubmit('Purchase Order', data)} onCancel={handleFormCancel} />;
      case 'goods-receipt':
        return <GoodsReceiptForm onSubmit={(data) => handleFormSubmit('GRN', data)} onCancel={handleFormCancel} />;
      case 'vendor-registration':
        return <VendorRegistrationForm onSubmit={(data) => handleFormSubmit('Vendor', data)} onCancel={handleFormCancel} />;
      default:
        return null;
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Inventory Data Entry Forms
        </CardTitle>
        <CardDescription>
          Complete forms for all inventory management operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2"
            onClick={() => setActiveForm('new-item')}
          >
            <Package className="w-6 h-6" />
            <span>Add New Item</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2"
            onClick={() => setActiveForm('purchase-order')}
          >
            <FileText className="w-6 h-6" />
            <span>Purchase Order</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2"
            onClick={() => setActiveForm('goods-receipt')}
          >
            <Truck className="w-6 h-6" />
            <span>Goods Receipt</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2"
            onClick={() => setActiveForm('vendor-registration')}
          >
            <Users className="w-6 h-6" />
            <span>Vendor Registration</span>
          </Button>
        </div>

        <Separator className="my-6" />

        <div className="space-y-3">
          <h4 className="font-medium">Additional Forms Available:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <Badge variant="outline" className="justify-center">Stock Adjustment</Badge>
            <Badge variant="outline" className="justify-center">Physical Count</Badge>
            <Badge variant="outline" className="justify-center">Issue Voucher</Badge>
            <Badge variant="outline" className="justify-center">Return Note</Badge>
            <Badge variant="outline" className="justify-center">Transfer Request</Badge>
            <Badge variant="outline" className="justify-center">Damage Report</Badge>
            <Badge variant="outline" className="justify-center">Expiry Report</Badge>
            <Badge variant="outline" className="justify-center">Approval Workflow</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};