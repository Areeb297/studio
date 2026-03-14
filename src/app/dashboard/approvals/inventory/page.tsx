'use client';

import { ApprovalList } from "@/components/approvals/approval-list";

export default function InventoryApprovalsPage() {
  return (
    <ApprovalList
      title="Inventory Approvals"
      type="inventory"
      description="Approve GRNs, stock adjustments, transfers, and write-offs pending authorisation — 10 awaiting action"
    />
  );
}
