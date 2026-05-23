import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Tax Codes"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Setup" }, { label: "Tax Codes" }]}
      specDoc="11_tax_and_statutory.md § 1"
    />
  );
}
