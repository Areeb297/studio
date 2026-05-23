import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Supplier Statement (report)"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Reports" }, { label: "Supplier Statement" }]}
      specDoc="07_accounts_payable.md § 7"
    />
  );
}
