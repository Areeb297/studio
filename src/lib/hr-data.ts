import { Employee, Department, AttendanceRecord, LeaveRequest, LeaveBalance, PayrollRecord, HRMetrics, AttendanceMetrics, Meeting, Task, JobApplication } from '@/types/hr';

export const departments: Department[] = [
  { id: 'dept-1', name: 'Management', manager: 'Areeb Shafqat', employeeCount: 5, budget: 500000 },
  { id: 'dept-2', name: 'Academic', manager: 'Dr. Hassan Ali', employeeCount: 25, budget: 800000 },
  { id: 'dept-3', name: 'Kitchen', manager: 'Fatima Khan', employeeCount: 12, budget: 300000 },
  { id: 'dept-4', name: 'Service', manager: 'Zainab Ahmed', employeeCount: 18, budget: 400000 },
  { id: 'dept-5', name: 'Administration', manager: 'Bilal Chaudhry', employeeCount: 8, budget: 350000 },
  { id: 'dept-6', name: 'Maintenance', manager: 'Ali Hassan', employeeCount: 6, budget: 200000 },
];

export const employees: Employee[] = [
  {
    id: 'emp-1',
    employeeId: 'EMP001',
    name: 'Areeb Shafqat',
    email: 'areeb@rahah24.com',
    phone: '+92-300-1234567',
    role: 'General Manager',
    department: departments[0],
    employmentType: 'Full-time',
    status: 'Active',
    hireDate: new Date('2022-08-15'),
    salary: 80000,
    photo: '/avatars/areeb.jpg',
    performanceRating: 4.8,
    skills: ['Leadership', 'Strategic Planning', 'Operations Management']
  },
  {
    id: 'emp-2',
    employeeId: 'EMP002',
    name: 'Ted Johnson',
    email: 'ted@rahah24.com',
    phone: '+92-300-2345678',
    role: 'Head Chef',
    department: departments[2],
    employmentType: 'Full-time',
    status: 'Active',
    hireDate: new Date('2023-01-20'),
    salary: 45000,
    manager: 'emp-1',
    photo: '/avatars/ted.jpg',
    performanceRating: 4.6,
    skills: ['Culinary Arts', 'Team Management', 'Menu Planning']
  },
  {
    id: 'emp-3',
    employeeId: 'EMP003',
    name: 'Sarah Williams',
    email: 'sarah@rahah24.com',
    phone: '+92-300-3456789',
    role: 'Senior Teacher',
    department: departments[1],
    employmentType: 'Full-time',
    status: 'Active',
    hireDate: new Date('2021-09-01'),
    salary: 55000,
    manager: 'emp-1',
    photo: '/avatars/sarah.jpg',
    performanceRating: 4.9,
    skills: ['Teaching', 'Islamic Studies', 'Student Counseling']
  },
  {
    id: 'emp-4',
    employeeId: 'EMP004',
    name: 'Zara Ahmed',
    email: 'zara@rahah24.com',
    phone: '+92-300-4567890',
    role: 'Floor Manager',
    department: departments[3],
    employmentType: 'Full-time',
    status: 'Active',
    hireDate: new Date('2022-11-01'),
    salary: 35000,
    manager: 'emp-1',
    photo: '/avatars/zara.jpg',
    performanceRating: 4.4,
    skills: ['Customer Service', 'Team Leadership', 'Operations']
  },
  {
    id: 'emp-5',
    employeeId: 'EMP005',
    name: 'Michael Brown',
    email: 'michael@rahah24.com',
    phone: '+92-300-5678901',
    role: 'Senior Waiter',
    department: departments[3],
    employmentType: 'Full-time',
    status: 'Active',
    hireDate: new Date('2023-03-12'),
    salary: 25000,
    manager: 'emp-4',
    photo: '/avatars/michael.jpg',
    performanceRating: 4.2,
    skills: ['Customer Service', 'Food Service', 'Communication']
  },
  {
    id: 'emp-6',
    employeeId: 'EMP006',
    name: 'Emma Davis',
    email: 'emma@rahah24.com',
    phone: '+92-300-6789012',
    role: 'Accountant',
    department: departments[4],
    employmentType: 'Contract',
    status: 'Active',
    hireDate: new Date('2023-09-01'),
    salary: 40000,
    manager: 'emp-1',
    photo: '/avatars/emma.jpg',
    performanceRating: 4.5,
    skills: ['Accounting', 'Financial Analysis', 'Taxation']
  },
  {
    id: 'emp-7',
    employeeId: 'EMP007',
    name: 'James Wilson',
    email: 'james@rahah24.com',
    phone: '+92-300-7890123',
    role: 'Assistant Chef',
    department: departments[2],
    employmentType: 'Part-time',
    status: 'Active',
    hireDate: new Date('2024-01-15'),
    salary: 20000,
    manager: 'emp-2',
    photo: '/avatars/james.jpg',
    performanceRating: 4.0,
    skills: ['Food Preparation', 'Kitchen Operations', 'Recipe Development']
  },
  {
    id: 'emp-8',
    employeeId: 'EMP008',
    name: 'Sophia Miller',
    email: 'sophia@rahah24.com',
    phone: '+92-300-8901234',
    role: 'Assistant Teacher',
    department: departments[1],
    employmentType: 'Probation',
    status: 'Active',
    hireDate: new Date('2024-02-01'),
    salary: 30000,
    manager: 'emp-3',
    photo: '/avatars/sophia.jpg',
    performanceRating: 3.8,
    skills: ['Teaching Assistant', 'Quran Recitation', 'Child Psychology']
  },
  {
    id: 'emp-9',
    employeeId: 'EMP009',
    name: 'David Garcia',
    email: 'david@rahah24.com',
    phone: '+92-300-9012345',
    role: 'Maintenance Supervisor',
    department: departments[5],
    employmentType: 'Full-time',
    status: 'Active',
    hireDate: new Date('2022-05-10'),
    salary: 32000,
    manager: 'emp-1',
    photo: '/avatars/david.jpg',
    performanceRating: 4.3,
    skills: ['Facility Management', 'Electrical Systems', 'Team Coordination']
  },
  {
    id: 'emp-10',
    employeeId: 'EMP010',
    name: 'Lisa Thompson',
    email: 'lisa@rahah24.com',
    phone: '+92-300-0123456',
    role: 'HR Coordinator',
    department: departments[4],
    employmentType: 'Full-time',
    status: 'Active',
    hireDate: new Date('2023-06-15'),
    salary: 38000,
    manager: 'emp-1',
    photo: '/avatars/lisa.jpg',
    performanceRating: 4.7,
    skills: ['Human Resources', 'Recruitment', 'Employee Relations']
  },
  {
    id: 'emp-11',
    employeeId: 'EMP011',
    name: 'Alex Rodriguez',
    email: 'alex@rahah24.com',
    phone: '+92-300-1234567',
    role: 'Kitchen Assistant',
    department: departments[2],
    employmentType: 'Part-time',
    status: 'On Leave',
    hireDate: new Date('2023-11-20'),
    salary: 18000,
    manager: 'emp-2',
    photo: '/avatars/alex.jpg',
    performanceRating: 3.9,
    skills: ['Food Preparation', 'Sanitation', 'Kitchen Safety']
  },
  {
    id: 'emp-12',
    employeeId: 'EMP012',
    name: 'Rachel Green',
    email: 'rachel@rahah24.com',
    phone: '+92-300-2345678',
    role: 'Mathematics Teacher',
    department: departments[1],
    employmentType: 'Full-time',
    status: 'Active',
    hireDate: new Date('2022-03-01'),
    salary: 48000,
    manager: 'emp-3',
    photo: '/avatars/rachel.jpg',
    performanceRating: 4.8,
    skills: ['Mathematics', 'Physics', 'Curriculum Development']
  },
];

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-1',
    employeeId: 'emp-1',
    employee: employees[0],
    date: new Date('2024-01-15'),
    checkIn: new Date('2024-01-15T08:30:00'),
    checkOut: new Date('2024-01-15T17:30:00'),
    status: 'Present',
    hoursWorked: 9,
    overtimeHours: 0,
    deviceType: 'Web Portal'
  },
  {
    id: 'att-2',
    employeeId: 'emp-2',
    employee: employees[1],
    date: new Date('2024-01-15'),
    checkIn: new Date('2024-01-15T09:15:00'),
    checkOut: new Date('2024-01-15T18:00:00'),
    status: 'Late',
    hoursWorked: 8.75,
    overtimeHours: 0.75,
    deviceType: 'Mobile App'
  },
  {
    id: 'att-3',
    employeeId: 'emp-3',
    employee: employees[2],
    date: new Date('2024-01-15'),
    status: 'Absent',
    deviceType: 'Manual',
    notes: 'Sick leave'
  },
  {
    id: 'att-4',
    employeeId: 'emp-4',
    employee: employees[3],
    date: new Date('2024-01-15'),
    checkIn: new Date('2024-01-15T08:45:00'),
    checkOut: new Date('2024-01-15T17:15:00'),
    status: 'Present',
    hoursWorked: 8.5,
    overtimeHours: 0,
    deviceType: 'Biometric'
  },
];

export const leaveRequests: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'emp-3',
    employee: employees[2],
    type: 'Sick',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-16'),
    days: 2,
    reason: 'Flu symptoms',
    status: 'Approved',
    appliedDate: new Date('2024-01-14'),
    approvedBy: 'emp-1',
    approvedDate: new Date('2024-01-14')
  },
  {
    id: 'leave-2',
    employeeId: 'emp-5',
    employee: employees[4],
    type: 'Annual',
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-01-25'),
    days: 5,
    reason: 'Family vacation',
    status: 'Pending',
    appliedDate: new Date('2024-01-12')
  },
];

export const leaveBalances: LeaveBalance[] = [
  {
    employeeId: 'emp-1',
    annualLeave: { allocated: 25, used: 5, remaining: 20 },
    sickLeave: { allocated: 12, used: 2, remaining: 10 },
    personalLeave: { allocated: 5, used: 0, remaining: 5 }
  },
  {
    employeeId: 'emp-2',
    annualLeave: { allocated: 20, used: 8, remaining: 12 },
    sickLeave: { allocated: 10, used: 3, remaining: 7 },
    personalLeave: { allocated: 3, used: 1, remaining: 2 }
  },
];

export const meetings: Meeting[] = [
  {
    id: 'meet-1',
    title: 'Interview - Software Engineer',
    type: 'Interview',
    startTime: new Date('2024-01-16T10:00:00'),
    endTime: new Date('2024-01-16T11:00:00'),
    location: 'Conference Room A',
    participants: [employees[0], employees[4]],
    organizer: employees[0],
    status: 'Scheduled',
    description: 'Technical interview for software engineer position'
  },
  {
    id: 'meet-2',
    title: 'Monthly Team Meeting',
    type: 'Team Meeting',
    startTime: new Date('2024-01-17T14:00:00'),
    endTime: new Date('2024-01-17T15:30:00'),
    location: 'Main Hall',
    participants: employees.slice(0, 5),
    organizer: employees[0],
    status: 'Scheduled',
    description: 'Monthly review and planning meeting'
  },
];

export const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Complete Employee Handbook',
    description: 'Update and finalize the employee handbook with new policies',
    assignedTo: employees[5],
    assignedBy: employees[0],
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date('2024-01-20'),
    createdDate: new Date('2024-01-10')
  },
  {
    id: 'task-2',
    title: 'Organize Training Session',
    description: 'Organize customer service training for new staff',
    assignedTo: employees[3],
    assignedBy: employees[0],
    status: 'Todo',
    priority: 'Medium',
    dueDate: new Date('2024-01-25'),
    createdDate: new Date('2024-01-12')
  },
];

export const jobApplications: JobApplication[] = [
  {
    id: 'job-1',
    position: 'Software Engineer',
    department: 'IT',
    applicantName: 'Muhammad Hassan',
    applicantEmail: 'hassan@example.com',
    applicationDate: new Date('2024-01-10'),
    status: 'Interview Scheduled',
    interviewDate: new Date('2024-01-16')
  },
  {
    id: 'job-2',
    position: 'Marketing Specialist',
    department: 'Marketing',
    applicantName: 'Sara Ahmed',
    applicantEmail: 'sara@example.com',
    applicationDate: new Date('2024-01-12'),
    status: 'Under Review'
  },
];

export const hrMetrics: HRMetrics = {
  totalEmployees: 74,
  activeEmployees: 68,
  newHires: 12,
  resignations: 5,
  turnoverRate: 7.4,
  averageSalary: 42500,
  totalPayroll: 2890000,
  attendanceRate: 92.5,
  jobApplications: 24,
  employeeSatisfaction: 4.2
};

export const attendanceMetrics: AttendanceMetrics = {
  totalEmployees: 68,
  present: 62,
  absent: 3,
  late: 8,
  onLeave: 5,
  onTime: 54,
  earlyDepartures: 2,
  overtime: 12,
  averageHoursWorked: 8.5
};

export const employmentStatusData = [
  { name: 'Full-time', value: 45, color: 'hsl(var(--chart-1))' },
  { name: 'Part-time', value: 12, color: 'hsl(var(--chart-2))' },
  { name: 'Contract', value: 8, color: 'hsl(var(--chart-3))' },
  { name: 'Probation', value: 3, color: 'hsl(var(--chart-4))' }
];

export const departmentData = [
  { department: 'Academic', employees: 25, percentage: 36.8 },
  { department: 'Service', employees: 18, percentage: 26.5 },
  { department: 'Kitchen', employees: 12, percentage: 17.6 },
  { department: 'Administration', employees: 8, percentage: 11.8 },
  { department: 'Maintenance', employees: 6, percentage: 8.8 },
  { department: 'Management', employees: 5, percentage: 7.4 }
];

export const attendanceTrendData = [
  { day: 'Mon', present: 65, absent: 3 },
  { day: 'Tue', present: 67, absent: 1 },
  { day: 'Wed', present: 64, absent: 4 },
  { day: 'Thu', present: 66, absent: 2 },
  { day: 'Fri', present: 62, absent: 6 },
  { day: 'Sat', present: 58, absent: 10 },
  { day: 'Sun', present: 45, absent: 23 }
];

export const payrollTrendData = [
  { month: 'Jan', amount: 2850000 },
  { month: 'Feb', amount: 2920000 },
  { month: 'Mar', amount: 2890000 },
  { month: 'Apr', amount: 3100000 },
  { month: 'May', amount: 3050000 },
  { month: 'Jun', amount: 2980000 }
];