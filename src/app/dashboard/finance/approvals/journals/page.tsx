import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Journal Voucher Approvals"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Approvals" }, { label: "Journals" }]}
      specDoc="16_roles_and_security.md § 8"
    />
  );
}
