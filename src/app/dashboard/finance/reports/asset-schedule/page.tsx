import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Fixed Asset Schedule"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Reports" }, { label: "Asset Schedule" }]}
      specDoc="13_financial_statements.md § 9"
    />
  );
}
