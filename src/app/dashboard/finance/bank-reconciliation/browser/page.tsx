import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Bank Recon Browser (Climax view)"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Cash & Bank" }, { label: "Recon Browser" }]}
      specDoc="08_cash_and_bank.md § 4"
    />
  );
}
