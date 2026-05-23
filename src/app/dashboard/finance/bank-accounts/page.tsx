import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Bank Accounts"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Setup" }, { label: "Bank Accounts" }]}
      specDoc="08_cash_and_bank.md § 1"
    />
  );
}
