'use client';

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const transactions = [
  { id: "TRX001", customer: "John Doe", item: "Chicken Biryani", amount: 4500.00, status: "Completed" },
  { id: "TRX002", customer: "Jane Smith", item: "Mutton Karahi", amount: 7550.50, status: "Completed" },
  { id: "TRX003", customer: "Sam Wilson", item: "BBQ Platter", amount: 12500.00, status: "Pending" },
  { id: "TRX004", customer: "Alice Brown", item: "Seekh Kebab", amount: 3275.00, status: "Completed" },
  { id: "TRX005", customer: "Bob Johnson", item: "Nihari", amount: 5000.00, status: "Cancelled" },
];

export function TransactionsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium">{transaction.id}</TableCell>
            <TableCell>{transaction.customer}</TableCell>
            <TableCell>{transaction.item}</TableCell>
            <TableCell>
              <Badge variant={
                  transaction.status === "Completed" ? "default" : transaction.status === "Pending" ? "secondary" : "destructive"
              } className={
                  transaction.status === "Completed" ? "bg-green-500/20 text-green-700 dark:text-green-300 dark:border-green-500/50 dark:bg-green-500/10" :
                  transaction.status === "Pending" ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 dark:border-yellow-500/50 dark:bg-yellow-500/10" : "bg-red-500/20 text-red-700 dark:text-red-300 dark:border-red-500/50 dark:bg-red-500/10"
              }>{transaction.status}</Badge>
            </TableCell>
            <TableCell className="text-right">PKR {transaction.amount.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}