import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Payment Approvals"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Approvals" }, { label: "Payments" }]}
      specDoc="16_roles_and_security.md § 8"
    />
  );
}
