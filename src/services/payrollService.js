import { calculatePayroll } from '../utils/payrollLogic'
import { getMonthlyAttendance } from './attendanceService'
import { getAllEmployees } from './employeeService'
import { getItem, setItem } from '../utils/storage'
import { getCurrentUser } from './authService'
import { logAction } from '../utils/auditLogger'

const PAYROLL_KEY = 'payrollRecords'

/** Read all generated payroll records. @returns {Array<Object>} Payroll records. */
export function getAllPayrolls() {
  const payrolls = getItem(PAYROLL_KEY, [])
  return Array.isArray(payrolls) ? payrolls : []
}

/** Generate or replace one employee's payroll for a month. @param {Object} employee - Employee. @param {string} month - YYYY-MM. @returns {Object} Generated payroll. */
export function generatePayroll(employee, month) {
  const payroll = calculatePayroll(employee, getMonthlyAttendance(month, employee.id), month)
  const records = getAllPayrolls().filter((record) => record.id !== payroll.id)
  setItem(PAYROLL_KEY, [...records, payroll])
  logAction(getCurrentUser(), 'payroll.generated', { employeeId: employee.id, month, netSalary: payroll.netSalary })
  return payroll
}

/** Generate payroll for every employee. @param {string} month - YYYY-MM. @param {Array<Object>} [employees=getAllEmployees()] - Employees to process. @returns {Array<Object>} Generated payroll records. */
export function generateBulkPayroll(month, employees = getAllEmployees()) {
  return employees.map((employee) => generatePayroll(employee, month))
}

/** Get payroll records for one employee. @param {string} employeeId - Employee ID. @returns {Array<Object>} Employee payroll records. */
export function getPayrollByEmployee(employeeId) {
  return getAllPayrolls().filter((record) => record.employeeId === employeeId)
}

/** Get payroll records for one month. @param {string} month - YYYY-MM. @returns {Array<Object>} Monthly payroll records. */
export function getPayrollByMonth(month) {
  return getAllPayrolls().filter((record) => record.month === month)
}
