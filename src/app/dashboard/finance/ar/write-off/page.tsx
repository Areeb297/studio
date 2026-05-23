import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Customer Write-Off"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Receivables" }, { label: "Write-Off" }]}
      specDoc="06_accounts_receivable.md § 6"
    />
  );
}
