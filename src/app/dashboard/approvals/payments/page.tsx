'use client';

import { ApprovalList } from "@/components/approvals/approval-list";

export default function ApprovePaymentsPage() {
  return (
    <ApprovalList
      title="Approve Payments"
      type="payments"
      description="Review and authorise outgoing payment vouchers to suppliers and vendors — 14 awaiting action"
    />
  );
}
