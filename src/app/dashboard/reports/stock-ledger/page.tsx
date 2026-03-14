'use client';
export default function StockLedgerPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-3">
      <div className="text-5xl">📋</div>
      <h1 className="text-2xl font-bold">Stock Ledger (Detail)</h1>
      <p className="text-muted-foreground max-w-sm">Detailed transaction-level stock ledger with opening/closing balances per item.</p>
      <p className="text-sm text-muted-foreground">Module in Development</p>
    </div>
  );
}
