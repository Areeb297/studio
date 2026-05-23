import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Sales Tax Register"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Reports" }, { label: "Sales Tax Register" }]}
      specDoc="11_tax_and_statutory.md § 4"
    />
  );
}
