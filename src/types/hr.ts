export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department: Department;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Probation';
  status: 'Active' | 'Resigned' | 'Terminated' | 'On Leave';
  hireDate: Date;
  terminationDate?: Date;
  salary: number;
  manager?: string;
  photo?: string;
  address?: string;
  skills?: string[];
  performanceRating?: number;
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
  budget?: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employee: Employee;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Holiday' | 'Leave';
  hoursWorked?: number;
  overtimeHours?: number;
  location?: string;
  deviceType?: 'Mobile App' | 'Web Portal' | 'Biometric' | 'Manual';
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employee: Employee;
  type: 'Annual' | 'Sick' | 'Personal' | 'Maternity' | 'Paternity' | 'Emergency';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  appliedDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
  comments?: string;
}

export interface LeaveBalance {
  employeeId: string;
  annualLeave: {
    allocated: number;
    used: number;
    remaining: number;
  };
  sickLeave: {
    allocated: number;
    used: number;
    remaining: number;
  };
  personalLeave: {
    allocated: number;
    used: number;
    remaining: number;
  };
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employee: Employee;
  period: {
    month: number;
    year: number;
  };
  basicSalary: number;
  allowances: {
    name: string;
    amount: number;
  }[];
  deductions: {
    name: string;
    amount: number;
  }[];
  grossPay: number;
  netPay: number;
  overtime: {
    hours: number;
    rate: number;
    amount: number;
  };
  status: 'Draft' | 'Processed' | 'Paid';
  processedDate?: Date;
  paidDate?: Date;
}

export interface HRMetrics {
  totalEmployees: number;
  activeEmployees: number;
  newHires: number;
  resignations: number;
  turnoverRate: number;
  averageSalary: number;
  totalPayroll: number;
  attendanceRate: number;
  jobApplications: number;
  employeeSatisfaction?: number;
}

export interface AttendanceMetrics {
  totalEmployees: number;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  onTime: number;
  earlyDepartures: number;
  overtime: number;
  averageHoursWorked: number;
}

export interface Meeting {
  id: string;
  title: string;
  type: 'Interview' | 'Team Meeting' | 'One-on-One' | 'Training' | 'Other';
  startTime: Date;
  endTime: Date;
  location?: string;
  participants: Employee[];
  organizer: Employee;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: Employee;
  assignedBy: Employee;
  status: 'Todo' | 'In Progress' | 'Completed' | 'On Hold';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate: Date;
  createdDate: Date;
  completedDate?: Date;
}

export interface JobApplication {
  id: string;
  position: string;
  department: string;
  applicantName: string;
  applicantEmail: string;
  applicationDate: Date;
  status: 'Applied' | 'Under Review' | 'Interview Scheduled' | 'Interviewed' | 'Offer Made' | 'Hired' | 'Rejected';
  resume?: string;
  coverLetter?: string;
  interviewDate?: Date;
  notes?: string;
}