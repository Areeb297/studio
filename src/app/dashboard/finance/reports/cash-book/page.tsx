import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Cash Book"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Reports" }, { label: "Cash Book" }]}
      specDoc="13_financial_statements.md § 8"
    />
  );
}
