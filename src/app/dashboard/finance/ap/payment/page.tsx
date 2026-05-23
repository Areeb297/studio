import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Supplier Payment"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Payables" }, { label: "Payment" }]}
      specDoc="07_accounts_payable.md § 3"
    />
  );
}
