import { ComingSoon } from '@/components/finance/coming-soon';

export default function Page() {
  return (
    <ComingSoon
      title="Cash Receipt Voucher (CRV)"
      description="Front-end design lives in the corresponding spec doc. Implementation queued in the build plan."
      breadcrumb={[{ label: "General Ledger" }, { label: "CRV" }]}
      specDoc="05_general_ledger.md § 2.2"
    />
  );
}
