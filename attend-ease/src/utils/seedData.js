import { setItem, getItem } from './storage'

const INITIALIZED_KEY = 'appInitialized'
const USERS_KEY = 'attendEaseUsers'
const EMPLOYEES_KEY = 'employees'
const ATTENDANCE_KEY = 'attendanceRecords'
const LEAVE_KEY = 'leaveRequests'
const PAYROLL_KEY = 'payrollRecords'

const employeeProfiles = [
  { fullName: 'Nimal Perera', username: 'nimal.perera', email: 'nimal.perera@attendease.com', department: 'Engineering', baseSalary: 185000 },
  { fullName: 'Kavindi Jayasinghe', username: 'kavindi.j', email: 'kavindi.j@attendease.com', department: 'Human Resources', baseSalary: 142000 },
  { fullName: 'Tharindu Wickramasinghe', username: 'tharindu.w', email: 'tharindu.w@attendease.com', department: 'Engineering', baseSalary: 225000 },
  { fullName: 'Hansika Gunawardena', username: 'hansika.g', email: 'hansika.g@attendease.com', department: 'Sales', baseSalary: 118000 },
  { fullName: 'Dineth Fernando', username: 'dineth.fernando', email: 'dineth.fernando@attendease.com', department: 'Sales', baseSalary: 92000 },
]

/**
 * Generate a random clock-in time between 08:30 and 09:45.
 *
 * @returns {string} A clock-in time in HH:mm format.
 */
function randomClockIn() {
  const minutes = 8 * 60 + 30 + Math.floor(Math.random() * 76)
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
}

/**
 * Calculate one monthly payroll record from an employee's base salary.
 *
 * @param {Object} employee - Employee data containing baseSalary.
 * @param {string} month - Payroll month in YYYY-MM format.
 * @returns {Object} A calculated payroll record.
 */
export function payrollLogic(employee, month) {
  const baseSalary = Number(employee.baseSalary) || 0
  const allowance = Math.round(baseSalary * 0.1)
  const deductions = Math.round(baseSalary * 0.08)

  return {
    id: `payroll-${employee.id}-${month}`,
    employeeId: employee.id,
    employeeName: employee.fullName,
    month,
    baseSalary,
    allowance,
    deductions,
    netSalary: baseSalary + allowance - deductions,
    status: 'processed',
  }
}

/**
 * Populate localStorage with a complete demo workspace on first application run.
 *
 * The operation is idempotent: once appInitialized is set, subsequent calls
 * leave existing data untouched. Seeded credentials use admin/admin123.
 *
 * @returns {boolean} True when seed data was created, false when already initialized.
 */
export function initializeSeedData() {
  if (getItem(INITIALIZED_KEY, null) !== null) {
    return false
  }

  const adminUser = {
    username: 'admin',
    password: btoa('admin123'),
    role: 'admin',
    fullName: 'System Admin',
    email: 'admin@attendease.com',
    department: 'HR',
  }

  const employees = employeeProfiles.map((profile, index) => ({
    ...profile,
    id: `employee-${index + 1}`,
    role: 'employee',
    joinedDate: new Date(Date.now() - (index + 1) * 86400000 * 30).toISOString(),
  }))

  const employeeUsers = employees.map((employee) => ({
    username: employee.username,
    passwordHash: btoa('welcome123'),
    role: employee.role,
    fullName: employee.fullName,
    email: employee.email,
    department: employee.department,
  }))

  const attendance = employees.flatMap((employee) => Array.from({ length: 30 }, (_, dayIndex) => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - (29 - dayIndex))

    return {
      id: `attendance-${employee.id}-${dayIndex + 1}`,
      employeeId: employee.id,
      employeeName: employee.fullName,
      date: date.toISOString().slice(0, 10),
      clockIn: randomClockIn(),
      status: 'present',
    }
  }))

  const leaveRequests = [
    { id: 'leave-1', employeeId: employees[0].id, employeeName: employees[0].fullName, type: 'Annual leave', startDate: '2026-09-21', endDate: '2026-09-23', status: 'pending', reason: 'Family commitment' },
    { id: 'leave-2', employeeId: employees[2].id, employeeName: employees[2].fullName, type: 'Medical leave', startDate: '2026-09-24', endDate: '2026-09-24', status: 'pending', reason: 'Medical appointment' },
    { id: 'leave-3', employeeId: employees[3].id, employeeName: employees[3].fullName, type: 'Annual leave', startDate: '2026-09-10', endDate: '2026-09-12', status: 'approved', reason: 'Personal travel' },
  ]

  const month = new Date().toISOString().slice(0, 7)
  const payroll = employees.map((employee) => payrollLogic(employee, month))

  setItem(USERS_KEY, [adminUser, ...employeeUsers])
  setItem(EMPLOYEES_KEY, employees)
  setItem(ATTENDANCE_KEY, attendance)
  setItem(LEAVE_KEY, leaveRequests)
  setItem(PAYROLL_KEY, payroll)
  setItem(INITIALIZED_KEY, true)
  return true
}
