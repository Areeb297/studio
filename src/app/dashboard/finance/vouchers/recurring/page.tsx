import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Recurring Journals"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "General Ledger" }, { label: "Recurring" }]}
      specDoc="14_climax_parity.md § 3"
    />
  );
}
