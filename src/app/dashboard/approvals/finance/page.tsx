'use client';

import { ApprovalList } from "@/components/approvals/approval-list";

export default function FinanceApprovalsDashboardPage() {
  return (
    <ApprovalList
      title="Finance Approvals"
      type="finance"
      description="Review and approve finance documents including invoices, credit notes, and GL postings — 7 awaiting action"
    />
  );
}
