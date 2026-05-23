import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Supplier Debit Note"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Payables" }, { label: "Debit Note" }]}
      specDoc="07_accounts_payable.md § 5"
    />
  );
}
