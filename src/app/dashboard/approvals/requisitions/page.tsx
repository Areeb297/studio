'use client';

import { ApprovalList } from "@/components/approvals/approval-list";

export default function ApproveRequisitionsPage() {
  return (
    <ApprovalList
      title="Approve Requisitions"
      type="requisitions"
      description="Review and approve pending purchase requisitions from all departments — 12 awaiting action"
    />
  );
}
