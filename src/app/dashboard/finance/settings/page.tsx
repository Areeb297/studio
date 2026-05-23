import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Finance Settings"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "Setup" }, { label: "Settings" }]}
      specDoc="02_information_architecture.md"
    />
  );
}
