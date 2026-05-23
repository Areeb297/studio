import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Cash Withdrawal"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Cash & Bank" }, { label: "Withdrawal" }]}
      specDoc="08_cash_and_bank.md § 2"
    />
  );
}
