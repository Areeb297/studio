// Academic Data - Financial & Donor Management System
// Focus on fee collection, donor relationships, and business KPIs

export interface Donor {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  donorType: 'INDIVIDUAL' | 'ORGANIZATION' | 'FOUNDATION';
  registrationDate: Date;
  totalContributed: number;
  preferredPaymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'ONLINE';
  status: 'ACTIVE' | 'INACTIVE';
  notes?: string;
}

export interface StudentSponsorship {
  id: string;
  studentId: string;
  donorId: string;
  sponsorshipType: 'FULL' | 'PARTIAL' | 'MONTHLY' | 'ANNUAL';
  monthlyAmount: number;
  startDate: Date;
  endDate?: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED';
  paymentSchedule: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  lastPaymentDate?: Date;
  totalPaid: number;
  outstandingAmount: number;
  notes?: string;
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  fatherName: string;
  dateOfBirth: Date;
  address: string;
  phone?: string;
  emergencyContact: string;
  admissionDate: Date;
  class: string;
  section?: string;
  program: 'HIFZ' | 'NAZRA' | 'ALIM' | 'FAZIL' | 'GENERAL';
  status: 'ACTIVE' | 'COMPLETED' | 'TRANSFERRED' | 'SUSPENDED';
  monthlyFee: number;
  outstandingFees: number;
  paymentStatus: 'PAID' | 'PARTIAL' | 'OVERDUE' | 'SPONSORED';
  sponsorships: StudentSponsorship[];
  guardian: {
    name: string;
    relation: string;
    phone: string;
    address: string;
  };
  // Removed academic progress - focus on financial data
  financialInfo: {
    lastPaymentDate?: Date;
    lastPaymentAmount?: number;
    totalPaid: number;
    paymentHistory: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AcademicClass {
  id: string;
  name: string;
  program: 'HIFZ' | 'NAZRA' | 'ALIM' | 'FAZIL' | 'GENERAL';
  level: number;
  capacity: number;
  currentEnrollment: number;
  teacher: string;
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  fee: number;
  isActive: boolean;
}

export interface FeeTransaction {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  month: string;
  year: number;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'DONOR_SPONSORED';
  receiptNumber: string;
  status: 'PAID' | 'PARTIAL' | 'OVERDUE';
  donorId?: string; // Link to donor if sponsored
  sponsorshipId?: string; // Link to sponsorship record
  remarks?: string;
  collectedBy: string;
}

// Financial KPI Data
export interface FinancialKPIs {
  totalStudents: number;
  activeStudents: number;
  totalMonthlyRevenue: number;
  collectionRate: number; // percentage of fees collected
  outstandingAmount: number;
  sponsoredStudents: number;
  totalDonorContributions: number;
  averageFeePerStudent: number;
}

export interface Teacher {
  id: string;
  name: string;
  qualification: string;
  specialization: string[];
  phone: string;
  address: string;
  joiningDate: Date;
  salary: number;
  classes: string[];
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
}

// Sample Donors
export const donors: Donor[] = [
  {
    id: 'donor-001',
    name: 'Muhammad Ahmed Foundation',
    email: 'info@ahmedfoundation.org',
    phone: '+92-21-12345678',
    address: 'Plot 123, Block A, Gulshan-e-Iqbal, Karachi',
    donorType: 'FOUNDATION',
    registrationDate: new Date('2023-01-15'),
    totalContributed: 150000,
    preferredPaymentMethod: 'BANK_TRANSFER',
    status: 'ACTIVE',
    notes: 'Regular monthly contributor for 5 students'
  },
  {
    id: 'donor-002',
    name: 'Fatima Bibi',
    phone: '+92-300-1234567',
    address: 'House 456, Block B, Defence, Karachi',
    donorType: 'INDIVIDUAL',
    registrationDate: new Date('2023-03-20'),
    totalContributed: 36000,
    preferredPaymentMethod: 'CASH',
    status: 'ACTIVE',
    notes: 'Sponsors 1 student fully'
  },
  {
    id: 'donor-003',
    name: 'Al-Khair Trust',
    email: 'donations@alkhair.org',
    phone: '+92-21-87654321',
    address: 'Office 789, Shahra-e-Faisal, Karachi',
    donorType: 'ORGANIZATION',
    registrationDate: new Date('2022-12-10'),
    totalContributed: 240000,
    preferredPaymentMethod: 'BANK_TRANSFER',
    status: 'ACTIVE',
    notes: 'Annual sponsor for 8 students'
  }
];

// Sample Sponsorships
export const sponsorships: StudentSponsorship[] = [
  {
    id: 'sponsor-001',
    studentId: 'std-001',
    donorId: 'donor-001',
    sponsorshipType: 'FULL',
    monthlyAmount: 3000,
    startDate: new Date('2024-01-01'),
    status: 'ACTIVE',
    paymentSchedule: 'MONTHLY',
    lastPaymentDate: new Date('2024-01-01'),
    totalPaid: 12000,
    outstandingAmount: 0,
    notes: 'Full sponsorship by Muhammad Ahmed Foundation'
  },
  {
    id: 'sponsor-002',
    studentId: 'std-002',
    donorId: 'donor-002',
    sponsorshipType: 'FULL',
    monthlyAmount: 3000,
    startDate: new Date('2023-09-01'),
    status: 'ACTIVE',
    paymentSchedule: 'MONTHLY',
    lastPaymentDate: new Date('2024-01-01'),
    totalPaid: 36000,
    outstandingAmount: 0,
    notes: 'Individual sponsor - very reliable'
  },
  {
    id: 'sponsor-003',
    studentId: 'std-003',
    donorId: 'donor-003',
    sponsorshipType: 'PARTIAL',
    monthlyAmount: 1500,
    startDate: new Date('2024-01-01'),
    status: 'ACTIVE',
    paymentSchedule: 'MONTHLY',
    lastPaymentDate: new Date('2024-01-01'),
    totalPaid: 6000,
    outstandingAmount: 1500,
    notes: 'Partial sponsorship - 50% coverage'
  }
];

// Real Academic Classes from Madrassah Tahfeez ul Quran
export const academicClasses: AcademicClass[] = [
  {
    id: 'class-1',
    name: 'HIFZ - Para 1-5',
    program: 'HIFZ',
    level: 1,
    capacity: 25,
    currentEnrollment: 22,
    teacher: 'Qari Muhammad Yusuf',
    schedule: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      startTime: '08:00',
      endTime: '12:00'
    },
    fee: 3000,
    isActive: true
  },
  {
    id: 'class-2',
    name: 'HIFZ - Para 6-15',
    program: 'HIFZ',
    level: 2,
    capacity: 20,
    currentEnrollment: 18,
    teacher: 'Qari Abdul Rahman',
    schedule: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      startTime: '08:00',
      endTime: '12:00'
    },
    fee: 3500,
    isActive: true
  },
  {
    id: 'class-3',
    name: 'HIFZ - Para 16-30 (Final)',
    program: 'HIFZ',
    level: 3,
    capacity: 15,
    currentEnrollment: 12,
    teacher: 'Qari Hafiz Saeed',
    schedule: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      startTime: '08:00',
      endTime: '12:00'
    },
    fee: 4000,
    isActive: true
  },
  {
    id: 'class-4',
    name: 'NAZRA - Beginner',
    program: 'NAZRA',
    level: 1,
    capacity: 30,
    currentEnrollment: 28,
    teacher: 'Maulana Ahmad Ali',
    schedule: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '14:00',
      endTime: '16:00'
    },
    fee: 2000,
    isActive: true
  },
  {
    id: 'class-5',
    name: 'ALIM - Year 1',
    program: 'ALIM',
    level: 1,
    capacity: 25,
    currentEnrollment: 20,
    teacher: 'Maulana Dr. Khalil Ahmad',
    schedule: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '09:00',
      endTime: '15:00'
    },
    fee: 2500,
    isActive: true
  },
  {
    id: 'class-6',
    name: 'FAZIL - Advanced Studies',
    program: 'FAZIL',
    level: 1,
    capacity: 15,
    currentEnrollment: 8,
    teacher: 'Maulana Mufti Ibrahim',
    schedule: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '09:00',
      endTime: '15:00'
    },
    fee: 3000,
    isActive: true
  }
];

// Updated Students with Financial Focus and Sponsorship Data
export const students: Student[] = [
  {
    id: 'std-001',
    rollNumber: 'TQ-2024-001',
    name: 'Muhammad Abdullah',
    fatherName: 'Abdul Rahman Khan',
    dateOfBirth: new Date('2010-05-15'),
    address: 'House #123, Block B, Gulshan-e-Iqbal, Karachi',
    phone: '+92-300-1234567',
    emergencyContact: '+92-321-9876543',
    admissionDate: new Date('2024-01-15'),
    class: 'HIFZ - Para 1-5',
    section: 'A',
    program: 'HIFZ',
    status: 'ACTIVE',
    monthlyFee: 3000,
    outstandingFees: 0,
    paymentStatus: 'SPONSORED',
    sponsorships: [sponsorships[0]],
    guardian: {
      name: 'Abdul Rahman Khan',
      relation: 'Father',
      phone: '+92-300-1234567',
      address: 'House #123, Block B, Gulshan-e-Iqbal, Karachi'
    },
    financialInfo: {
      lastPaymentDate: new Date('2024-01-01'),
      lastPaymentAmount: 3000,
      totalPaid: 12000,
      paymentHistory: ['Jan-2024: ₨3,000', 'Dec-2023: ₨3,000', 'Nov-2023: ₨3,000']
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'std-002',
    rollNumber: 'TQ-2024-002',
    name: 'Fatima Khatoon',
    fatherName: 'Muhammad Usman',
    dateOfBirth: new Date('2012-03-22'),
    address: 'Flat 456, Block C, North Nazimabad, Karachi',
    phone: '+92-321-7654321',
    emergencyContact: '+92-300-8765432',
    admissionDate: new Date('2023-09-01'),
    class: 'HIFZ - Para 6-15',
    section: 'B',
    program: 'HIFZ',
    status: 'ACTIVE',
    monthlyFee: 3500,
    outstandingFees: 0,
    paymentStatus: 'SPONSORED',
    sponsorships: [sponsorships[1]],
    guardian: {
      name: 'Aisha Begum',
      relation: 'Mother',
      phone: '+92-321-7654321',
      address: 'Flat 456, Block C, North Nazimabad, Karachi'
    },
    financialInfo: {
      lastPaymentDate: new Date('2024-01-01'),
      lastPaymentAmount: 3500,
      totalPaid: 42000,
      paymentHistory: ['Jan-2024: ₨3,500', 'Dec-2023: ₨3,500', 'Nov-2023: ₨3,500']
    },
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'std-003',
    rollNumber: 'TQ-2024-003',
    name: 'Ahmed Ali',
    fatherName: 'Ali Hassan',
    dateOfBirth: new Date('2011-08-10'),
    address: 'House 789, Block D, Malir, Karachi',
    phone: '+92-333-1122334',
    emergencyContact: '+92-300-2233445',
    admissionDate: new Date('2024-01-01'),
    class: 'HIFZ - Para 16-30 (Final)',
    section: 'A',
    program: 'HIFZ',
    status: 'ACTIVE',
    monthlyFee: 4000,
    outstandingFees: 2000,
    paymentStatus: 'PARTIAL',
    sponsorships: [sponsorships[2]],
    guardian: {
      name: 'Ali Hassan',
      relation: 'Father',
      phone: '+92-333-1122334',
      address: 'House 789, Block D, Malir, Karachi'
    },
    financialInfo: {
      lastPaymentDate: new Date('2023-12-15'),
      lastPaymentAmount: 2000,
      totalPaid: 8000,
      paymentHistory: ['Dec-2023: ₨2,000 (Partial)', 'Nov-2023: ₨2,000 (Partial)']
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'std-004',
    rollNumber: 'TQ-2024-004',
    name: 'Zainab Sheikh',
    fatherName: 'Muhammad Sheikh',
    dateOfBirth: new Date('2013-01-18'),
    address: 'Plot 321, Block E, Gulberg, Karachi',
    phone: '+92-300-5566778',
    emergencyContact: '+92-321-6677889',
    admissionDate: new Date('2024-02-01'),
    class: 'NAZRA - Beginner',
    section: 'A',
    program: 'NAZRA',
    status: 'ACTIVE',
    monthlyFee: 2000,
    outstandingFees: 4000,
    paymentStatus: 'OVERDUE',
    sponsorships: [],
    guardian: {
      name: 'Khadija Sheikh',
      relation: 'Mother',
      phone: '+92-300-5566778',
      address: 'Plot 321, Block E, Gulberg, Karachi'
    },
    financialInfo: {
      lastPaymentDate: new Date('2023-10-01'),
      lastPaymentAmount: 2000,
      totalPaid: 4000,
      paymentHistory: ['Oct-2023: ₨2,000', 'Sep-2023: ₨2,000']
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: 'std-005',
    rollNumber: 'TQ-2024-005',
    name: 'Omar Farooq',
    fatherName: 'Abdul Farooq',
    dateOfBirth: new Date('2010-11-25'),
    address: 'House 654, Block F, Korangi, Karachi',
    emergencyContact: '+92-321-9988776',
    admissionDate: new Date('2024-01-20'),
    class: 'NAZRA - Intermediate',
    section: 'B',
    program: 'NAZRA',
    status: 'ACTIVE',
    monthlyFee: 2500,
    outstandingFees: 0,
    paymentStatus: 'PAID',
    sponsorships: [],
    guardian: {
      name: 'Abdul Farooq',
      relation: 'Father',
      phone: '+92-321-9988776',
      address: 'House 654, Block F, Korangi, Karachi'
    },
    financialInfo: {
      lastPaymentDate: new Date('2024-01-01'),
      lastPaymentAmount: 2500,
      totalPaid: 2500,
      paymentHistory: ['Jan-2024: ₨2,500']
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25')
  }
];

// Teachers
export const teachers: Teacher[] = [
  {
    id: 'teach-001',
    name: 'Qari Muhammad Yusuf',
    qualification: 'Hafiz-e-Quran, Certificate in Qirat',
    specialization: ['Hifz', 'Qirat', 'Tajweed'],
    phone: '+92-300-1111122',
    address: 'Gulistan-e-Johar, Karachi',
    joiningDate: new Date('2020-01-01'),
    salary: 45000,
    classes: ['HIFZ - Para 1-5'],
    status: 'ACTIVE'
  },
  {
    id: 'teach-002',
    name: 'Qari Abdul Rahman',
    qualification: 'Hafiz-e-Quran, Aalim',
    specialization: ['Hifz', 'Islamic Studies'],
    phone: '+92-321-2222233',
    address: 'Nazimabad, Karachi',
    joiningDate: new Date('2019-06-01'),
    salary: 50000,
    classes: ['HIFZ - Para 6-15'],
    status: 'ACTIVE'
  },
  {
    id: 'teach-003',
    name: 'Qari Hafiz Saeed',
    qualification: 'Hafiz-e-Quran, Maulvi Fazil',
    specialization: ['Hifz', 'Completion Classes', 'Advanced Tajweed'],
    phone: '+92-333-3333344',
    address: 'Malir, Karachi',
    joiningDate: new Date('2018-01-01'),
    salary: 55000,
    classes: ['HIFZ - Para 16-30 (Final)'],
    status: 'ACTIVE'
  },
  {
    id: 'teach-004',
    name: 'Maulana Ahmad Ali',
    qualification: 'Aalim, Certificate in Quranic Teaching',
    specialization: ['Nazra', 'Basic Arabic', 'Islamic Fundamentals'],
    phone: '+92-300-4444455',
    address: 'Korangi, Karachi',
    joiningDate: new Date('2021-03-01'),
    salary: 35000,
    classes: ['NAZRA - Beginner'],
    status: 'ACTIVE'
  },
  {
    id: 'teach-005',
    name: 'Maulana Dr. Khalil Ahmad',
    qualification: 'PhD Islamic Studies, Aalim Fazil',
    specialization: ['Dars-e-Nizami', 'Arabic Literature', 'Fiqh'],
    phone: '+92-321-5555566',
    address: 'Gulshan-e-Iqbal, Karachi',
    joiningDate: new Date('2017-09-01'),
    salary: 65000,
    classes: ['ALIM - Year 1'],
    status: 'ACTIVE'
  },
  {
    id: 'teach-006',
    name: 'Maulana Mufti Ibrahim',
    qualification: 'Mufti, Aalim Fazil, Masters in Islamic Law',
    specialization: ['Advanced Fiqh', 'Hadith', 'Tafseer'],
    phone: '+92-333-6666677',
    address: 'Defence, Karachi',
    joiningDate: new Date('2016-01-01'),
    salary: 75000,
    classes: ['FAZIL - Advanced Studies'],
    status: 'ACTIVE'
  }
];

// Fee Transactions with Donor Integration
export const feeTransactions: FeeTransaction[] = [
  {
    id: 'fee-001',
    studentId: 'std-001',
    studentName: 'Muhammad Abdullah',
    rollNumber: 'TQ-2024-001',
    month: 'January',
    year: 2024,
    amount: 3000,
    paymentDate: new Date('2024-01-05'),
    paymentMethod: 'DONOR_SPONSORED',
    receiptNumber: 'RCP-2024-001',
    status: 'PAID',
    donorId: 'donor-001',
    sponsorshipId: 'sponsor-001',
    remarks: 'Paid by Muhammad Ahmed Foundation',
    collectedBy: 'Admin Office'
  },
  {
    id: 'fee-002',
    studentId: 'std-002',
    studentName: 'Fatima Khatoon',
    rollNumber: 'TQ-2024-002',
    month: 'January',
    year: 2024,
    amount: 3500,
    paymentDate: new Date('2024-01-03'),
    paymentMethod: 'DONOR_SPONSORED',
    receiptNumber: 'RCP-2024-002',
    status: 'PAID',
    donorId: 'donor-002',
    sponsorshipId: 'sponsor-002',
    remarks: 'Sponsored by Fatima Bibi',
    collectedBy: 'Admin Office'
  },
  {
    id: 'fee-003',
    studentId: 'std-003',
    studentName: 'Ahmed Ali',
    rollNumber: 'TQ-2024-003',
    month: 'December',
    year: 2023,
    amount: 2000,
    paymentDate: new Date('2023-12-15'),
    paymentMethod: 'DONOR_SPONSORED',
    receiptNumber: 'RCP-2023-089',
    status: 'PARTIAL',
    donorId: 'donor-003',
    sponsorshipId: 'sponsor-003',
    remarks: 'Partial payment by Al-Khair Trust - 50% coverage',
    collectedBy: 'Finance Office'
  },
  {
    id: 'fee-004',
    studentId: 'std-005',
    studentName: 'Omar Farooq',
    rollNumber: 'TQ-2024-005',
    month: 'January',
    year: 2024,
    amount: 2500,
    paymentDate: new Date('2024-01-10'),
    paymentMethod: 'CASH',
    receiptNumber: 'RCP-2024-003',
    status: 'PAID',
    remarks: 'Direct payment by guardian',
    collectedBy: 'Cashier'
  }
];

// Financial KPIs for Dashboard
export const financialKPIs: FinancialKPIs = {
  totalStudents: 387,
  activeStudents: 362,
  totalMonthlyRevenue: 1245000,
  collectionRate: 89.5, // 89.5% collection rate
  outstandingAmount: 156000,
  sponsoredStudents: 156, // 43% of students are sponsored
  totalDonorContributions: 850000,
  averageFeePerStudent: 3200
};

// Academic Statistics
export const getAcademicStatistics = () => {
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'ACTIVE').length;
  const totalOutstanding = students.reduce((sum, s) => sum + s.outstandingFees, 0);
  const studentsWithOutstanding = students.filter(s => s.outstandingFees > 0).length;
  const totalClasses = academicClasses.length;
  const totalTeachers = teachers.filter(t => t.status === 'ACTIVE').length;
  
  const programDistribution = {
    HIFZ: students.filter(s => s.program === 'HIFZ').length,
    NAZRA: students.filter(s => s.program === 'NAZRA').length,
    ALIM: students.filter(s => s.program === 'ALIM').length,
    FAZIL: students.filter(s => s.program === 'FAZIL').length,
    GENERAL: students.filter(s => s.program === 'GENERAL').length
  };

  return {
    totalStudents,
    activeStudents,
    totalOutstanding,
    studentsWithOutstanding,
    totalClasses,
    totalTeachers,
    programDistribution
  };
};

// Cost Centers - matching current system
export const costCenters = [
  {
    id: 'cc-001',
    code: 'LOCAL_STUDENT_DEP',
    name: 'LOCAL STUDENT DEPARTMENT',
    description: 'Cost center for local residential students',
    isActive: true
  },
  {
    id: 'cc-002',
    code: 'TEHFEEZ_QURAN',
    name: 'TEHFEEZ UL QURAN',
    description: 'Quran memorization department',
    isActive: true
  },
  {
    id: 'cc-003',
    code: 'RESTAURANT_DEP',
    name: 'RESTAURANT DEPARTMENT',
    description: 'Food and catering operations',
    isActive: true
  },
  {
    id: 'cc-004',
    code: 'JAMIA_ADMIN',
    name: 'JAMIA ADMINISTRATION',
    description: 'General administrative costs',
    isActive: true
  }
];

export default {
  students,
  academicClasses,
  teachers,
  feeTransactions,
  costCenters,
  getAcademicStatistics
};