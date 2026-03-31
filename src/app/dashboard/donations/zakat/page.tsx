'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Calculator, DollarSign, TrendingUp, Users, PlusCircle, Search } from "lucide-react";
import { format, addMonths } from "date-fns";
import { Progress } from "@/components/ui/progress";

const zakatDonations = [
  {
    id: 1,
    receiptNo: 'ZKT-2025-001',
    donorName: 'Abdul Rehman Khan',
    donorEmail: 'abdulrehman@example.com',
    donorPhone: '+92-321-1234567',
    amount: 50000,
    category: 'GENERAL',
    paymentMethod: 'BANK_TRANSFER',
    date: new Date('2025-10-15'),
    status: 'RECEIVED',
    allocatedTo: 'Student Support',
  },
  {
    id: 2,
    receiptNo: 'ZKT-2025-002',
    donorName: 'Fatima Begum',
    donorEmail: 'fatima.b@example.com',
    donorPhone: '+92-300-9876543',
    amount: 25000,
    category: 'GOLD',
    paymentMethod: 'CASH',
    date: new Date('2025-10-18'),
    status: 'RECEIVED',
    allocatedTo: 'Food Distribution',
  },
  {
    id: 3,
    receiptNo: 'ZKT-2025-003',
    donorName: 'Muhammad Tariq',
    donorEmail: 'mtariq@example.com',
    donorPhone: '+92-333-5556677',
    amount: 100000,
    category: 'WEALTH',
    paymentMethod: 'ONLINE',
    date: new Date('2025-10-20'),
    status: 'RECEIVED',
    allocatedTo: 'Medical Assistance',
  },
  {
    id: 4,
    receiptNo: 'ZKT-2025-004',
    donorName: 'Hassan Industries',
    donorEmail: 'contact@hassan.com',
    donorPhone: '+92-21-34567890',
    amount: 200000,
    category: 'BUSINESS',
    paymentMethod: 'BANK_TRANSFER',
    date: new Date('2025-10-22'),
    status: 'PENDING',
    allocatedTo: 'Not Allocated',
  },
];

const zakatAllocations = [
  { category: 'Student Support', allocated: 150000, distributed: 120000, beneficiaries: 24 },
  { category: 'Food Distribution', allocated: 80000, distributed: 80000, beneficiaries: 160 },
  { category: 'Medical Assistance', allocated: 100000, distributed: 75000, beneficiaries: 15 },
  { category: 'Emergency Relief', allocated: 45000, distributed: 30000, beneficiaries: 9 },
];

const nisabRates = {
  gold: { rate: 85, unit: 'grams', pricePerGram: 19500, nisabValue: 85 * 19500 },
  silver: { rate: 595, unit: 'grams', pricePerGram: 250, nisabValue: 595 * 250 },
};

const formatPKR = (amount: number) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);

export default function ZakatPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Calculator state
  const [cash, setCash] = useState(0);
  const [bankBalance, setBankBalance] = useState(0);
  const [gold, setGold] = useState(0);
  const [silver, setSilver] = useState(0);
  const [investments, setInvestments] = useState(0);
  const [businessAssets, setBusinessAssets] = useState(0);
  const [debts, setDebts] = useState(0);

  const totalReceived = zakatDonations.filter(z => z.status === 'RECEIVED').reduce((sum, z) => sum + z.amount, 0);
  const pendingAmount = zakatDonations.filter(z => z.status === 'PENDING').reduce((sum, z) => sum + z.amount, 0);
  const totalAllocated = zakatAllocations.reduce((sum, a) => sum + a.allocated, 0);
  const totalDistributed = zakatAllocations.reduce((sum, a) => sum + a.distributed, 0);
  const totalBeneficiaries = zakatAllocations.reduce((sum, a) => sum + a.beneficiaries, 0);
  const distributionRate = ((totalDistributed / totalAllocated) * 100).toFixed(0);

  const filteredDonations = zakatDonations.filter(z =>
    z.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    z.receiptNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Zakat Calculator
  const totalWealth = cash + bankBalance + (gold * nisabRates.gold.pricePerGram) + (silver * nisabRates.silver.pricePerGram) + investments + businessAssets - debts;
  const isZakatDue = totalWealth >= nisabRates.gold.nisabValue;
  const zakatAmount = isZakatDue ? totalWealth * 0.025 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Zakat Management</h1>
        <p className="text-muted-foreground">Calculate, collect, and distribute Zakat funds</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatPKR(totalReceived)}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Heart className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatPKR(pendingAmount)}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Allocated</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(totalAllocated)}</div>
            <p className="text-xs text-muted-foreground">To programs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distributed</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatPKR(totalDistributed)}</div>
            <p className="text-xs text-muted-foreground">{distributionRate}% rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficiaries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBeneficiaries}</div>
            <p className="text-xs text-muted-foreground">People helped</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-900">Zakat Calculator</CardTitle>
                <CardDescription className="text-green-700">Calculate your Zakat obligation</CardDescription>
              </div>
              <Dialog open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-white">
                    <Calculator className="h-4 w-4 mr-2" />Open Calculator
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Zakat Calculator</DialogTitle>
                    <DialogDescription>Calculate your Zakat based on Islamic guidelines</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Cash in Hand (PKR)</Label>
                        <Input type="number" value={cash} onChange={(e) => setCash(Number(e.target.value))} placeholder="0" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Bank Balance (PKR)</Label>
                        <Input type="number" value={bankBalance} onChange={(e) => setBankBalance(Number(e.target.value))} placeholder="0" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Gold (grams)</Label>
                        <Input type="number" value={gold} onChange={(e) => setGold(Number(e.target.value))} placeholder="0" />
                        <p className="text-xs text-muted-foreground">@ {formatPKR(nisabRates.gold.pricePerGram)}/gram</p>
                      </div>
                      <div className="grid gap-2">
                        <Label>Silver (grams)</Label>
                        <Input type="number" value={silver} onChange={(e) => setSilver(Number(e.target.value))} placeholder="0" />
                        <p className="text-xs text-muted-foreground">@ {formatPKR(nisabRates.silver.pricePerGram)}/gram</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Investments/Stocks (PKR)</Label>
                        <Input type="number" value={investments} onChange={(e) => setInvestments(Number(e.target.value))} placeholder="0" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Business Assets (PKR)</Label>
                        <Input type="number" value={businessAssets} onChange={(e) => setBusinessAssets(Number(e.target.value))} placeholder="0" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Deductible Debts (PKR)</Label>
                      <Input type="number" value={debts} onChange={(e) => setDebts(Number(e.target.value))} placeholder="0" />
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Zakatable Wealth</span>
                        <span className="font-mono font-bold">{formatPKR(totalWealth)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Nisab Threshold (Gold)</span>
                        <span className="font-mono">{formatPKR(nisabRates.gold.nisabValue)}</span>
                      </div>
                      <div className="pt-2 border-t border-blue-300">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Your Zakat Due (2.5%)</span>
                          <span className="text-2xl font-bold text-green-700">{formatPKR(zakatAmount)}</span>
                        </div>
                        {!isZakatDue && (
                          <p className="text-xs text-orange-600 mt-1">
                            Your wealth is below Nisab threshold. Zakat is not obligatory.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCalculatorOpen(false)}>Close</Button>
                    {isZakatDue && (
                      <Button onClick={() => { setIsCalculatorOpen(false); setIsAddDialogOpen(true); }}>
                        Pay Zakat Now
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Nisab (Gold)</div>
                  <div className="font-semibold">{nisabRates.gold.rate}g @ {formatPKR(nisabRates.gold.pricePerGram)}/g</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-700">{formatPKR(nisabRates.gold.nisabValue)}</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Nisab (Silver)</div>
                  <div className="font-semibold">{nisabRates.silver.rate}g @ {formatPKR(nisabRates.silver.pricePerGram)}/g</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-700">{formatPKR(nisabRates.silver.nisabValue)}</div>
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Zakat Rate: <span className="font-bold text-green-700">2.5%</span> of total zakatable wealth
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution by Category</CardTitle>
            <CardDescription>How Zakat funds are being utilized</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {zakatAllocations.map((alloc, idx) => {
                const percentage = ((alloc.distributed / alloc.allocated) * 100).toFixed(0);
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{alloc.category}</span>
                      <span className="text-muted-foreground">{alloc.beneficiaries} beneficiaries</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatPKR(alloc.distributed)} / {formatPKR(alloc.allocated)}</span>
                      <span>{percentage}%</span>
                    </div>
                    <Progress value={parseFloat(percentage)} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="donations" className="w-full">
        <TabsList>
          <TabsTrigger value="donations">Zakat Donations</TabsTrigger>
          <TabsTrigger value="allocations">Fund Allocations</TabsTrigger>
        </TabsList>

        <TabsContent value="donations" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search donations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full sm:w-64"
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="h-4 w-4 mr-2" />Record Zakat Donation</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Record Zakat Donation</DialogTitle>
                  <DialogDescription>Add a new Zakat contribution</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Donor Name</Label>
                      <Input placeholder="Full name" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Amount (PKR)</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="donor@example.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Phone</Label>
                      <Input placeholder="+92-XXX-XXXXXXX" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GENERAL">General Zakat</SelectItem>
                          <SelectItem value="GOLD">Zakat on Gold</SelectItem>
                          <SelectItem value="SILVER">Zakat on Silver</SelectItem>
                          <SelectItem value="WEALTH">Zakat on Wealth</SelectItem>
                          <SelectItem value="BUSINESS">Zakat on Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Payment Method</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CASH">Cash</SelectItem>
                          <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                          <SelectItem value="ONLINE">Online Payment</SelectItem>
                          <SelectItem value="CHECK">Check</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Allocate To</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select allocation" />
                      </SelectTrigger>
                      <SelectContent>
                        {zakatAllocations.map((alloc, idx) => (
                          <SelectItem key={idx} value={alloc.category}>{alloc.category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Record Donation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Zakat Donations ({filteredDonations.length})</CardTitle>
              <CardDescription>All Zakat contributions received</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt #</TableHead>
                      <TableHead>Donor Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Allocated To</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell className="font-mono text-sm">{donation.receiptNo}</TableCell>
                        <TableCell className="font-medium">{donation.donorName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{donation.donorPhone}</TableCell>
                        <TableCell className="text-right font-mono font-bold">{formatPKR(donation.amount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{donation.category}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{donation.paymentMethod.replace('_', ' ')}</TableCell>
                        <TableCell>{format(donation.date, 'MMM dd, yyyy')}</TableCell>
                        <TableCell className="text-sm">{donation.allocatedTo}</TableCell>
                        <TableCell>
                          <Badge variant={donation.status === 'RECEIVED' ? 'default' : 'secondary'}>
                            {donation.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="font-bold">Total Received</TableCell>
                      <TableCell className="text-right font-mono font-bold text-lg">{formatPKR(totalReceived)}</TableCell>
                      <TableCell colSpan={5}></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Zakat Fund Allocations</CardTitle>
              <CardDescription>Distribution across different programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Allocated</TableHead>
                      <TableHead className="text-right">Distributed</TableHead>
                      <TableHead className="text-right">Remaining</TableHead>
                      <TableHead className="text-center">Beneficiaries</TableHead>
                      <TableHead className="text-right">Distribution %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zakatAllocations.map((alloc, idx) => {
                      const remaining = alloc.allocated - alloc.distributed;
                      const percentage = ((alloc.distributed / alloc.allocated) * 100).toFixed(1);
                      return (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{alloc.category}</TableCell>
                          <TableCell className="text-right font-mono">{formatPKR(alloc.allocated)}</TableCell>
                          <TableCell className="text-right font-mono font-bold text-green-700">{formatPKR(alloc.distributed)}</TableCell>
                          <TableCell className="text-right font-mono">{formatPKR(remaining)}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="default">{alloc.beneficiaries}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono font-bold">{percentage}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-mono font-bold">{formatPKR(totalAllocated)}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-green-700">{formatPKR(totalDistributed)}</TableCell>
                      <TableCell className="text-right font-mono font-bold">{formatPKR(totalAllocated - totalDistributed)}</TableCell>
                      <TableCell className="text-center font-bold">{totalBeneficiaries}</TableCell>
                      <TableCell className="text-right font-mono font-bold">{distributionRate}%</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
