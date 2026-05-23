import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Customer Statement (report)"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Reports" }, { label: "Customer Statement" }]}
      specDoc="06_accounts_receivable.md § 8"
    />
  );
}
