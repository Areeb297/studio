/**
 * Fixed assets mock data — categories, register, depreciation runs.
 */

import { COST_CENTERS } from './seed';

export type AssetStatus = 'ACTIVE' | 'DISPOSED' | 'WRITTEN_OFF';

export type AssetCategory = {
  code: string;
  name: string;
  method: 'STRAIGHT_LINE' | 'REDUCING_BALANCE';
  lifeMonths?: number;
  rate?: number;
  assetAcc: string;
  accDepAcc: string;
  depExpAcc: string;
  color: string;
};

export type FixedAsset = {
  id: string;
  code: string;
  name: string;
  categoryCode: string;
  costCenterId: number;
  acquisitionDate: string;
  acquisitionCost: number;
  salvageValue: number;
  accDep: number;
  nbv: number;
  status: AssetStatus;
  serialNumber: string;
  vendor: string;
  location: string;
  disposalDate?: string;
  disposalProceeds?: number;
  disposalGainLoss?: number;
};

export const assetCategories: AssetCategory[] = [
  { code: 'EQP',  name: 'Kitchen Equipment',  method: 'STRAIGHT_LINE',    lifeMonths: 60,  assetAcc: '1600',     accDepAcc: '1610', depExpAcc: '5601', color: 'bg-amber-100 text-amber-700' },
  { code: 'FUR',  name: 'Furniture & Fittings', method: 'STRAIGHT_LINE',  lifeMonths: 120, assetAcc: '1600',     accDepAcc: '1610', depExpAcc: '5601', color: 'bg-orange-100 text-orange-700' },
  { code: 'VEH',  name: 'Vehicles',           method: 'REDUCING_BALANCE',                   rate: 25, assetAcc: '1700', accDepAcc: '1710', depExpAcc: '5602', color: 'bg-blue-100 text-blue-700' },
  { code: 'BLD',  name: 'Buildings',          method: 'STRAIGHT_LINE',    lifeMonths: 240, assetAcc: '1500',     accDepAcc: '1510', depExpAcc: '5603', color: 'bg-slate-100 text-slate-700' },
  { code: 'COMP', name: 'Computer Equipment', method: 'STRAIGHT_LINE',    lifeMonths: 36,  assetAcc: '1620',     accDepAcc: '1611', depExpAcc: '5604', color: 'bg-violet-100 text-violet-700' },
  { code: 'SOFT', name: 'Software',           method: 'STRAIGHT_LINE',    lifeMonths: 36,  assetAcc: '30030007', accDepAcc: '30030003', depExpAcc: '5605', color: 'bg-rose-100 text-rose-700' },
];

const cc = (name: string) => COST_CENTERS.find(c => c.name === name)!.id;

export const fixedAssets: FixedAsset[] = [
  { id: 'a01', code: 'FA-2024-0001', name: 'Hobart 60Qt Industrial Mixer',     categoryCode: 'EQP',  costCenterId: cc('RESTAURANT'),    acquisitionDate: '2024-01-12', acquisitionCost: 180_000,   salvageValue: 18_000, accDep:   36_000, nbv:   144_000, status: 'ACTIVE', serialNumber: 'HB-6QT-441',   vendor: 'AL-MAKKAH KITCHEN CO', location: 'Main Kitchen' },
  { id: 'a02', code: 'FA-2024-0034', name: 'Toyota Hiace Van',                  categoryCode: 'VEH',  costCenterId: cc('MARRIAGE LAWN'), acquisitionDate: '2024-03-23', acquisitionCost: 3_500_000, salvageValue: 700_000, accDep:  875_000, nbv: 2_625_000, status: 'ACTIVE', serialNumber: 'JX1234567',    vendor: 'TOYOTA INDUS MOTORS', location: 'Marriage Lawn Parking' },
  { id: 'a03', code: 'FA-2023-0019', name: 'Main Hall AC × 4',                  categoryCode: 'EQP',  costCenterId: cc('MARRIAGE LAWN'), acquisitionDate: '2023-08-18', acquisitionCost: 420_000,   salvageValue: 42_000, accDep:  126_000, nbv:   294_000, status: 'ACTIVE', serialNumber: 'GR-INV-2T-4',  vendor: 'GREE PAKISTAN',       location: 'Main Hall' },
  { id: 'a04', code: 'FA-2024-0091', name: 'Dell Latitude 5530 Laptops × 8',    categoryCode: 'COMP', costCenterId: cc('LOCAL STUDENT DEPT'), acquisitionDate: '2024-09-04', acquisitionCost: 1_280_000, salvageValue: 128_000, accDep:  256_000, nbv: 1_024_000, status: 'ACTIVE', serialNumber: 'DL-5530-x8',   vendor: 'COMPUTER MARKETING',  location: 'Admin office' },
  { id: 'a05', code: 'FA-2022-0034', name: 'Sound System — JBL EON615 × 6',     categoryCode: 'EQP',  costCenterId: cc('MARRIAGE LAWN'), acquisitionDate: '2022-11-02', acquisitionCost: 540_000,   salvageValue: 54_000, accDep:  324_000, nbv:   216_000, status: 'ACTIVE', serialNumber: 'JBL-615-006',  vendor: 'AUDIOPHILE STORE',    location: 'Marriage Lawn AV room' },
  { id: 'a06', code: 'FA-2021-0001', name: 'Main Building — Madrasa',            categoryCode: 'BLD',  costCenterId: cc('TEHFEEZ'),       acquisitionDate: '2021-04-15', acquisitionCost: 32_000_000, salvageValue: 0,    accDep: 5_330_000, nbv:26_670_000, status: 'ACTIVE', serialNumber: '—',           vendor: 'INTERNAL CONSTRUCTION',location: 'Korangi Campus' },
  { id: 'a07', code: 'FA-2021-0002', name: 'Restaurant Building',                 categoryCode: 'BLD',  costCenterId: cc('RESTAURANT'),    acquisitionDate: '2021-04-15', acquisitionCost: 13_000_000, salvageValue: 0,    accDep: 2_545_000, nbv:10_455_000, status: 'ACTIVE', serialNumber: '—',           vendor: 'INTERNAL CONSTRUCTION',location: 'Korangi Campus' },
  { id: 'a08', code: 'FA-2023-0002', name: 'Walk-in Cold Storage',                categoryCode: 'EQP',  costCenterId: cc('RESTAURANT'),    acquisitionDate: '2023-02-10', acquisitionCost: 680_000,   salvageValue: 68_000, accDep:  238_000, nbv:   442_000, status: 'ACTIVE', serialNumber: 'CS-WI-440',    vendor: 'COOLPRO SYSTEMS',     location: 'Restaurant kitchen' },
  { id: 'a09', code: 'FA-2024-0055', name: 'POS Terminals × 4',                   categoryCode: 'COMP', costCenterId: cc('RESTAURANT'),    acquisitionDate: '2024-06-22', acquisitionCost: 320_000,   salvageValue: 32_000, accDep:   89_000, nbv:   231_000, status: 'ACTIVE', serialNumber: 'POS-T440-04',  vendor: 'TECHLINE INC',        location: 'Restaurant floor' },
  { id: 'a10', code: 'FA-2025-0008', name: 'ION ERP Software — Annual',           categoryCode: 'SOFT', costCenterId: cc('LOCAL STUDENT DEPT'), acquisitionDate: '2025-01-01', acquisitionCost: 1_085_902, salvageValue: 0,    accDep:  543_000, nbv:   542_902, status: 'ACTIVE', serialNumber: 'ION-2025',     vendor: 'INFOR SYSTEMS',       location: 'Server room' },
  { id: 'a11', code: 'FA-2022-0019', name: 'Catering Tableware Set (× 200)',      categoryCode: 'FUR',  costCenterId: cc('MARRIAGE LAWN'), acquisitionDate: '2022-06-04', acquisitionCost: 285_000,   salvageValue: 28_500, accDep:  102_600, nbv:   182_400, status: 'ACTIVE', serialNumber: 'TW-200-batch', vendor: 'TABLEWARE BAZAR',     location: 'Banquet store' },
  { id: 'a12', code: 'FA-2024-0028', name: 'CCTV System — 16 cameras',            categoryCode: 'EQP',  costCenterId: cc('LOCAL STUDENT DEPT'), acquisitionDate: '2024-05-20', acquisitionCost: 240_000,   salvageValue: 24_000, accDep:   48_000, nbv:   192_000, status: 'ACTIVE', serialNumber: 'HIK-CCTV-16',  vendor: 'SECURITECH',          location: 'Whole campus' },
];

// Sample disposal preview (used in disposal page)
export const samplePendingDisposal = {
  asset: fixedAssets[2], // Main hall AC × 4
  nbv: 294_000,
  proceeds: 150_000,
  gainLoss: -144_000,
};

// Depreciation runs (historical)
export const depreciationRuns = [
  { period: 'May 2026',  runDate: null,             total:  412_300, status: 'PENDING' as const,  assets: 12 },
  { period: 'Apr 2026',  runDate: '2026-04-30',     total:  398_400, status: 'POSTED'  as const,  assets: 12 },
  { period: 'Mar 2026',  runDate: '2026-03-31',     total:  398_400, status: 'POSTED'  as const,  assets: 12 },
  { period: 'Feb 2026',  runDate: '2026-02-28',     total:  398_400, status: 'POSTED'  as const,  assets: 11 },
  { period: 'Jan 2026',  runDate: '2026-01-31',     total:  385_200, status: 'POSTED'  as const,  assets: 11 },
];

// Depreciation line preview for May 2026 (what would post if user clicks Run)
export const depRunPreview = fixedAssets.slice(0, 8).map(a => ({
  code: a.code,
  name: a.name,
  cost: a.acquisitionCost,
  accDepPrior: a.accDep,
  monthly: a.categoryCode === 'BLD'
    ? Math.round(a.acquisitionCost / 240)
    : a.categoryCode === 'VEH'
      ? Math.round(a.nbv * (0.25 / 12))
      : Math.round((a.acquisitionCost - a.salvageValue) / (assetCategories.find(c => c.code === a.categoryCode)?.lifeMonths ?? 60)),
}));
