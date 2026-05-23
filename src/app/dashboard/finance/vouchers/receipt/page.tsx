import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Simplified Receipt"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "General Ledger" }, { label: "Simplified Receipt" }]}
      specDoc="05_general_ledger.md § 4.1"
    />
  );
}
