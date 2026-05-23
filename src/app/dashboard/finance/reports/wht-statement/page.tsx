import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="WHT Statement"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Reports" }, { label: "WHT Statement" }]}
      specDoc="11_tax_and_statutory.md § 4"
    />
  );
}
