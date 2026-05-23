import { ComingSoon } from '@/components/finance/coming-soon';

export default function AssetAcquisitionPage() {
  return (
    <ComingSoon
      title="Asset Acquisition"
      description="Add a new fixed asset — direct entry, or promote a capex line from a Supplier Invoice."
      breadcrumb={[{ label: 'Fixed Assets', href: '/dashboard/finance/assets' }, { label: 'Acquisition' }]}
      specDoc="09_fixed_assets.md § 4"
      bullets={[
        'Two entry modes: Direct form OR Load-from-Supplier-Invoice',
        'Pre-fills cost, vendor, acquisition date from source invoice',
        'Sets initial GL postings: Dr Asset · Cr Bank/AP',
        'Generates the next FA-YYYY-NNNN code automatically',
      ]}
    />
  );
}
