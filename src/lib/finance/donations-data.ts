/**
 * Donations mock data — donors, donations, pledges.
 * Pakistani names, +92 phone format, CNIC format xxxxx-xxxxxxx-x.
 */

import { DONATION_FUNDS } from './seed';

export type Donor = {
  id: string;
  code: string;
  name: string;
  cnic: string;
  phone: string;
  email?: string;
  address: string;
  zakatEligible: boolean;
  dependents: number;
  totalGiving: number;
  lastDonationDate: string;
};

export const donors: Donor[] = [
  { id: 'd01', code: 'DON-00012', name: 'F. AHMED',         cnic: '42101-1234567-1', phone: '+92 300 1234567', email: 'f.ahmed@gmail.com',     address: 'House 12, Block 6, Gulshan-e-Iqbal',  zakatEligible: true,  dependents: 4, totalGiving:   83_500, lastDonationDate: '2026-02-02' },
  { id: 'd02', code: 'DON-00045', name: 'K. MIRZA',         cnic: '42201-7654321-2', phone: '+92 321 9876543', email: 'kmirza@hotmail.com',    address: 'Apt 3B, DHA Phase 5',                 zakatEligible: true,  dependents: 3, totalGiving:  225_000, lastDonationDate: '2026-05-15' },
  { id: 'd03', code: 'DON-00088', name: 'A. RAHMAN',        cnic: '42301-5550022-3', phone: '+92 333 2222222',                                 address: 'House 88, Korangi',                   zakatEligible: false, dependents: 2, totalGiving:  150_000, lastDonationDate: '2026-04-19' },
  { id: 'd04', code: 'DON-00091', name: 'H. KHALID',        cnic: '42401-9988776-4', phone: '+92 345 1111111', email: 'hkhalid@outlook.com',   address: 'Apt 11, Defence Phase 8',             zakatEligible: false, dependents: 5, totalGiving:   60_000, lastDonationDate: '2026-05-08' },
  { id: 'd05', code: 'DON-00104', name: 'Z. AHMED',         cnic: '42501-3344556-5', phone: '+92 333 8888888',                                 address: 'House 4, FB Area',                    zakatEligible: true,  dependents: 0, totalGiving:  100_000, lastDonationDate: '2026-03-30' },
  { id: 'd06', code: 'DON-00118', name: 'M. UMAIR',         cnic: '42601-1122334-6', phone: '+92 300 5556677', email: 'umair@kpcl.pk',         address: 'Apt 9, North Nazimabad',              zakatEligible: false, dependents: 3, totalGiving:   45_000, lastDonationDate: '2026-05-20' },
  { id: 'd07', code: 'DON-00125', name: 'S. NAZIM',         cnic: '42701-7788990-7', phone: '+92 332 4445566',                                 address: 'House 25, Garden East',               zakatEligible: true,  dependents: 6, totalGiving:  320_000, lastDonationDate: '2026-05-22' },
  { id: 'd08', code: 'DON-00141', name: 'R. ASHRAF',        cnic: '42801-5566778-8', phone: '+92 321 7778899', email: 'rasif@nicl.pk',         address: 'Apt 7C, Bath Island',                 zakatEligible: false, dependents: 2, totalGiving:   80_000, lastDonationDate: '2026-04-12' },
  { id: 'd09', code: 'DON-00158', name: 'B. JAVED',         cnic: '42901-2233445-9', phone: '+92 333 6677889',                                 address: 'House 58, Shah Faisal Colony',        zakatEligible: true,  dependents: 4, totalGiving:  175_000, lastDonationDate: '2026-05-10' },
  { id: 'd10', code: 'DON-00172', name: 'T. SHAHID',        cnic: '42102-8899001-0', phone: '+92 345 3344556', email: 'tshahid@gmail.com',     address: 'Apt 14, Clifton Block 4',             zakatEligible: false, dependents: 1, totalGiving:   38_000, lastDonationDate: '2026-05-17' },
  { id: 'd11', code: 'DON-00189', name: 'O. SIDDIQUI',      cnic: '42202-4455667-1', phone: '+92 333 9988770',                                 address: 'House 22, Saddar',                    zakatEligible: true,  dependents: 3, totalGiving:   95_000, lastDonationDate: '2026-04-25' },
  { id: 'd12', code: 'DON-00204', name: 'M. HASSAN ALI',    cnic: '42302-6677889-2', phone: '+92 300 1122334', email: 'mhassan@karachi.gov.pk',address: 'Apt 18, Civic Centre Block',          zakatEligible: false, dependents: 2, totalGiving:   42_500, lastDonationDate: '2026-05-19' },
  { id: 'd13', code: 'DON-00215', name: 'I. QURESHI',       cnic: '42402-0011223-3', phone: '+92 321 2233445',                                 address: 'House 7B, Tariq Road',                zakatEligible: true,  dependents: 5, totalGiving:  210_000, lastDonationDate: '2026-05-23' },
  { id: 'd14', code: 'DON-00228', name: 'F. KHALIL',        cnic: '42502-3344556-4', phone: '+92 333 5566778', email: 'fkhalil@meezan.com.pk', address: 'House 28, Cantt',                     zakatEligible: false, dependents: 0, totalGiving:   55_000, lastDonationDate: '2026-05-05' },
  { id: 'd15', code: 'DON-00242', name: 'A. NAEEM',         cnic: '42602-7788990-5', phone: '+92 345 8899001',                                 address: 'Apt 19, PECHS',                        zakatEligible: true,  dependents: 4, totalGiving:  130_000, lastDonationDate: '2026-05-14' },
];

export type DonationRecord = {
  id: string;
  number: string;
  date: string;
  donorId: string;
  donorName: string;
  fundCode: string;
  amount: number;
  mode: 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'PAY_ORDER';
  reference?: string;
  status: 'POSTED' | 'BOUNCED_REVERSED';
};

export const donations: DonationRecord[] = [
  { id: 'r01', number: 'DC-2026-05-0123', date: '2026-05-23', donorId: 'd13', donorName: 'I. QURESHI',    fundCode: 'ZAKAT',     amount: 25_000, mode: 'CASH',           status: 'POSTED' },
  { id: 'r02', number: 'DC-2026-05-0122', date: '2026-05-23', donorId: 'd02', donorName: 'K. MIRZA',      fundCode: 'MOSQUE',    amount: 50_000, mode: 'CHEQUE',         reference: 'HBL ch#10488', status: 'POSTED' },
  { id: 'r03', number: 'DC-2026-05-0121', date: '2026-05-22', donorId: 'd07', donorName: 'S. NAZIM',      fundCode: 'MADRASSAH', amount: 30_000, mode: 'BANK_TRANSFER',  reference: 'IBT-22052', status: 'POSTED' },
  { id: 'r04', number: 'DC-2026-05-0120', date: '2026-05-22', donorId: 'd09', donorName: 'B. JAVED',      fundCode: 'ZAKAT',     amount: 17_500, mode: 'CASH',           status: 'POSTED' },
  { id: 'r05', number: 'DC-2026-05-0119', date: '2026-05-20', donorId: 'd06', donorName: 'M. UMAIR',      fundCode: 'SADQAH',    amount:  8_000, mode: 'CASH',           status: 'POSTED' },
  { id: 'r06', number: 'DC-2026-05-0118', date: '2026-05-19', donorId: 'd12', donorName: 'M. HASSAN ALI', fundCode: 'GENERAL',   amount: 12_000, mode: 'PAY_ORDER',      reference: 'PO-9912', status: 'POSTED' },
  { id: 'r07', number: 'DC-2026-05-0117', date: '2026-05-17', donorId: 'd10', donorName: 'T. SHAHID',     fundCode: 'ZAKAT',     amount: 22_000, mode: 'BANK_TRANSFER',  reference: 'IBT-21888', status: 'POSTED' },
  { id: 'r08', number: 'DC-2026-05-0116', date: '2026-05-15', donorId: 'd02', donorName: 'K. MIRZA',      fundCode: 'ZAKAT',     amount: 50_000, mode: 'CHEQUE',         reference: 'MCB ch#20019', status: 'BOUNCED_REVERSED' },
  { id: 'r09', number: 'DC-2026-05-0115', date: '2026-05-14', donorId: 'd15', donorName: 'A. NAEEM',      fundCode: 'MADRASSAH', amount: 18_000, mode: 'CASH',           status: 'POSTED' },
  { id: 'r10', number: 'DC-2026-05-0114', date: '2026-05-10', donorId: 'd09', donorName: 'B. JAVED',      fundCode: 'MOSQUE',    amount: 35_000, mode: 'CASH',           status: 'POSTED' },
];

export type Pledge = {
  id: string;
  donorId: string;
  donorName: string;
  fundCode: string;
  amount: number;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'ONE_TIME';
  installmentsPlanned: number;
  installmentsFulfilled: number;
  nextDueDate: string;
  status: 'ACTIVE' | 'COMPLETED';
};

export const pledges: Pledge[] = [
  { id: 'p01', donorId: 'd03', donorName: 'A. RAHMAN', fundCode: 'ZAKAT',     amount:  50_000, frequency: 'ANNUAL',  installmentsPlanned: 3, installmentsFulfilled: 2, nextDueDate: '2026-07-01', status: 'ACTIVE' },
  { id: 'p02', donorId: 'd04', donorName: 'H. KHALID', fundCode: 'MOSQUE',    amount:   5_000, frequency: 'MONTHLY', installmentsPlanned: 12, installmentsFulfilled: 8, nextDueDate: '2026-06-01', status: 'ACTIVE' },
  { id: 'p03', donorId: 'd05', donorName: 'Z. AHMED',  fundCode: 'GENERAL',   amount: 100_000, frequency: 'ONE_TIME', installmentsPlanned: 1, installmentsFulfilled: 0, nextDueDate: '2026-06-15', status: 'ACTIVE' },
  { id: 'p04', donorId: 'd13', donorName: 'I. QURESHI', fundCode: 'MADRASSAH', amount: 15_000, frequency: 'MONTHLY', installmentsPlanned: 12, installmentsFulfilled: 5, nextDueDate: '2026-06-01', status: 'ACTIVE' },
  { id: 'p05', donorId: 'd07', donorName: 'S. NAZIM',  fundCode: 'ZAKAT',     amount: 200_000, frequency: 'QUARTERLY', installmentsPlanned: 4, installmentsFulfilled: 2, nextDueDate: '2026-07-01', status: 'ACTIVE' },
];

export const donationStats = {
  todayCount:  donations.filter(d => d.date === '2026-05-23').length,
  todayAmount: donations.filter(d => d.date === '2026-05-23').reduce((s, d) => s + d.amount, 0),
  monthAmount: donations.filter(d => d.status === 'POSTED').reduce((s, d) => s + d.amount, 0),
  activeDonors: donors.length,
  activePledges: pledges.filter(p => p.status === 'ACTIVE').length,
  byFund: DONATION_FUNDS.map(f => ({
    fund: f.id,
    fundName: f.name,
    amount: donations.filter(d => d.fundCode === f.id && d.status === 'POSTED').reduce((s, d) => s + d.amount, 0),
  })),
};
