// Academic Data - Madrassah Tahfeez ul Quran System
// Based on current system structure and Islamic educational requirements

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
  guardian: {
    name: string;
    relation: string;
    phone: string;
    address: string;
  };
  academicProgress: {
    currentPara: number;
    totalParas: number;
    lastExamDate?: Date;
    lastExamResult?: string;
    teacherRemarks?: string;
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
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE';
  receiptNumber: string;
  status: 'PAID' | 'PARTIAL' | 'OVERDUE';
  remarks?: string;
  collectedBy: string;
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

// Sample Students for the Academic System
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
    guardian: {
      name: 'Abdul Rahman Khan',
      relation: 'Father',
      phone: '+92-300-1234567',
      address: 'House #123, Block B, Gulshan-e-Iqbal, Karachi'
    },
    academicProgress: {
      currentPara: 3,
      totalParas: 30,
      lastExamDate: new Date('2024-01-10'),
      lastExamResult: 'Excellent',
      teacherRemarks: 'Very good memorization and recitation'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'std-002',
    rollNumber: 'TQ-2024-002',
    name: 'Ahmad Hassan',
    fatherName: 'Muhammad Yusuf',
    dateOfBirth: new Date('2009-08-22'),
    address: 'Flat #45, North Nazimabad, Karachi',
    phone: '+92-333-5555555',
    emergencyContact: '+92-322-4444444',
    admissionDate: new Date('2023-09-01'),
    class: 'HIFZ - Para 6-15',
    section: 'A',
    program: 'HIFZ',
    status: 'ACTIVE',
    monthlyFee: 3500,
    outstandingFees: 3500, // One month outstanding
    guardian: {
      name: 'Muhammad Yusuf',
      relation: 'Father',
      phone: '+92-333-5555555',
      address: 'Flat #45, North Nazimabad, Karachi'
    },
    academicProgress: {
      currentPara: 8,
      totalParas: 30,
      lastExamDate: new Date('2024-01-05'),
      lastExamResult: 'Good',
      teacherRemarks: 'Consistent progress, needs to improve pronunciation'
    },
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'std-003',
    rollNumber: 'TQ-2024-003',
    name: 'Ali Raza',
    fatherName: 'Muhammad Raza',
    dateOfBirth: new Date('2008-03-10'),
    address: 'House #789, Defence Housing Authority, Karachi',
    phone: '+92-321-1111111',
    emergencyContact: '+92-300-9999999',
    admissionDate: new Date('2022-01-10'),
    class: 'HIFZ - Para 16-30 (Final)',
    section: 'A',
    program: 'HIFZ',
    status: 'ACTIVE',
    monthlyFee: 4000,
    outstandingFees: 0,
    guardian: {
      name: 'Muhammad Raza',
      relation: 'Father',
      phone: '+92-321-1111111',
      address: 'House #789, Defence Housing Authority, Karachi'
    },
    academicProgress: {
      currentPara: 25,
      totalParas: 30,
      lastExamDate: new Date('2024-01-12'),
      lastExamResult: 'Excellent',
      teacherRemarks: 'Exceptional student, likely to complete Hifz soon'
    },
    createdAt: new Date('2022-01-10'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'std-004',
    rollNumber: 'TQ-2024-004',
    name: 'Fatima Zahra',
    fatherName: 'Muhammad Akram',
    dateOfBirth: new Date('2012-11-05'),
    address: 'Apartment #12, Clifton, Karachi',
    emergencyContact: '+92-300-7777777',
    admissionDate: new Date('2024-01-20'),
    class: 'NAZRA - Beginner',
    program: 'NAZRA',
    status: 'ACTIVE',
    monthlyFee: 2000,
    outstandingFees: 0,
    guardian: {
      name: 'Muhammad Akram',
      relation: 'Father',
      phone: '+92-300-7777777',
      address: 'Apartment #12, Clifton, Karachi'
    },
    academicProgress: {
      currentPara: 0,
      totalParas: 30,
      lastExamDate: undefined,
      lastExamResult: undefined,
      teacherRemarks: 'New student, learning Arabic letters'
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'std-005',
    rollNumber: 'TQ-2024-005',
    name: 'Usman Ahmed',
    fatherName: 'Ahmed Ali',
    dateOfBirth: new Date('2007-12-18'),
    address: 'House #456, Shah Faisal Colony, Karachi',
    phone: '+92-333-8888888',
    emergencyContact: '+92-321-6666666',
    admissionDate: new Date('2023-03-01'),
    class: 'ALIM - Year 1',
    program: 'ALIM',
    status: 'ACTIVE',
    monthlyFee: 2500,
    outstandingFees: 5000, // Two months outstanding
    guardian: {
      name: 'Ahmed Ali',
      relation: 'Father',
      phone: '+92-333-8888888',
      address: 'House #456, Shah Faisal Colony, Karachi'
    },
    academicProgress: {
      currentPara: 30, // Completed Hifz, now in Alim
      totalParas: 30,
      lastExamDate: new Date('2023-12-15'),
      lastExamResult: 'Good',
      teacherRemarks: 'Hafiz-e-Quran, good in Arabic grammar studies'
    },
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2024-01-20')
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

// Fee Transactions - Recent payments
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
    paymentMethod: 'CASH',
    receiptNumber: 'RCP-2024-001',
    status: 'PAID',
    collectedBy: 'Office Staff - Ahmed'
  },
  {
    id: 'fee-002',
    studentId: 'std-003',
    studentName: 'Ali Raza',
    rollNumber: 'TQ-2024-003',
    month: 'January',
    year: 2024,
    amount: 4000,
    paymentDate: new Date('2024-01-03'),
    paymentMethod: 'BANK_TRANSFER',
    receiptNumber: 'RCP-2024-002',
    status: 'PAID',
    collectedBy: 'Office Staff - Fatima'
  },
  {
    id: 'fee-003',
    studentId: 'std-004',
    studentName: 'Fatima Zahra',
    rollNumber: 'TQ-2024-004',
    month: 'January',
    year: 2024,
    amount: 2000,
    paymentDate: new Date('2024-01-20'),
    paymentMethod: 'CASH',
    receiptNumber: 'RCP-2024-003',
    status: 'PAID',
    remarks: 'Admission fee paid',
    collectedBy: 'Office Staff - Ahmed'
  }
];

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