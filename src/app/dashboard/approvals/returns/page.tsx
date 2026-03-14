'use client';

import { ApprovalList } from "@/components/approvals/approval-list";

export default function ApproveReturnsPage() {
  return (
    <ApprovalList
      title="Approve Returns"
      type="returns"
      description="Review and approve pending department return requests — 4 awaiting action"
    />
  );
}
