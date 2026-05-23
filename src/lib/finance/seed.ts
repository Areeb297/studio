/**
 * Real entity names pulled from ERP_New production database (read-only snapshot).
 * Use these throughout the prototype so the demo feels native to the client.
 *
 * Source tables verified via mcp__sqlserver against ERP_New on 2026-05-23.
 */

// ── Companies (ERP_New.dbo.Companies) ────────────────────────────────────
export const COMPANIES = [
  { id: 1, name: 'Main System Company',         short: 'MSC' },
  { id: 2, name: 'JAMIA COMMERCIAL BUSINESS',   short: 'JCB' },
  { id: 3, name: 'JAMIA BINORIA AALAMIA',       short: 'JBA' },
  { id: 4, name: 'MADERSA TEHFEEZUL QURAN',     short: 'MTQ' },
  { id: 5, name: 'BINORIA WELFARE TRUST',       short: 'BWT' },
] as const;

// ── Cost Centres (ERP_New.dbo.CostCenters) ───────────────────────────────
export const COST_CENTERS = [
  { id: 1, code: 'LSD',  name: 'LOCAL STUDENT DEPT',  companyId: 3 },
  { id: 2, code: 'REST', name: 'RESTAURANT',          companyId: 2 },
  { id: 3, code: 'LAWN', name: 'MARRIAGE LAWN',       companyId: 2 },
  { id: 5, code: 'TEH',  name: 'TEHFEEZ',             companyId: 4 },
  { id: 6, code: 'TEST', name: 'Test Center',         companyId: 1 },
] as const;

// ── Currencies (ERP_New.dbo.Currencies) ──────────────────────────────────
export const CURRENCIES = [
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs', isBase: true },
  { code: 'USD', name: 'US Dollar',       symbol: '$',  isBase: false },
] as const;

// ── Funds for donations module ───────────────────────────────────────────
export const DONATION_FUNDS = [
  { id: 'ZAKAT',     name: 'Zakat',                  account: '4100', isZakat: true  },
  { id: 'SADQAH',    name: 'Sadqah',                 account: '4101', isZakat: false },
  { id: 'MOSQUE',    name: 'Mosque Construction',    account: '4102', isZakat: false },
  { id: 'MADRASSAH', name: 'Madrassah',              account: '4103', isZakat: false },
  { id: 'GENERAL',   name: 'General Donations',      account: '4104', isZakat: false },
] as const;

// ── Banks the client actually uses ───────────────────────────────────────
export const BANKS = [
  { code: 'HBL',    name: 'Habib Bank Limited'   },
  { code: 'MCB',    name: 'MCB Bank'             },
  { code: 'UBL',    name: 'United Bank Limited'  },
  { code: 'MEEZAN', name: 'Meezan Bank'          },
] as const;

// Convenience getters
export const getCompany = (id: number) => COMPANIES.find(c => c.id === id);
export const getCostCenter = (id: number) => COST_CENTERS.find(c => c.id === id);
export const getFund = (id: string) => DONATION_FUNDS.find(f => f.id === id);

export type Company = typeof COMPANIES[number];
export type CostCenter = typeof COST_CENTERS[number];
export type Currency = typeof CURRENCIES[number];
export type DonationFund = typeof DONATION_FUNDS[number];
