import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Donation Collective Summary"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Reports" }, { label: "Donation Summary" }]}
      specDoc="12_donations.md § 8.2"
    />
  );
}
