import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Fiscal Years & Periods"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Setup" }, { label: "Fiscal Periods" }]}
      specDoc="02_information_architecture.md"
    />
  );
}
