export const WORKING_DAYS = 22
export const STANDARD_HOURS = 8

/**
 * Calculate an employee's monthly salary from attendance records.
 *
 * @param {Object} employee - Employee containing id, fullName, and baseSalary.
 * @param {Array<Object>} attendanceRecords - Records for the selected month.
 * @param {string} month - Payroll month in YYYY-MM format.
 * @returns {Object} Complete payroll breakdown.
 */
export function calculatePayroll(employee, attendanceRecords = [], month) {
  const records = attendanceRecords.filter((record) => !month || record.date?.startsWith(month))
  const presentDays = records.filter((record) => ['present', 'late'].includes(record.status)).length
  const lateDays = records.filter((record) => record.status === 'late').length
  const absentDays = Math.max(0, WORKING_DAYS - presentDays)
  const overtimeHours = records.reduce((total, record) => {
    const hours = Number(record.workingHours) || 0
    return total + Math.max(0, hours - STANDARD_HOURS)
  }, 0)
  const baseSalary = Number(employee.baseSalary) || 0
  const perDaySalary = baseSalary / WORKING_DAYS
  const perHourSalary = perDaySalary / STANDARD_HOURS
  const lateDeduction = (lateDays / 3) * perDaySalary
  const absentDeduction = absentDays * perDaySalary
  const overtimePay = overtimeHours * perHourSalary * 1.5
  const roundMoney = (value) => Math.round(value)

  return {
    id: `payroll-${employee.id}-${month}`,
    employeeId: employee.id,
    employeeName: employee.fullName,
    email: employee.email,
    department: employee.department,
    designation: employee.designation || 'Team Member',
    month,
    baseSalary: roundMoney(baseSalary),
    perDaySalary: roundMoney(perDaySalary),
    perHourSalary: roundMoney(perHourSalary),
    presentDays,
    lateDays,
    absentDays,
    overtimeHours: Math.round(overtimeHours * 100) / 100,
    lateDeduction: roundMoney(lateDeduction),
    absentDeduction: roundMoney(absentDeduction),
    totalDeductions: roundMoney(lateDeduction + absentDeduction),
    overtimePay: roundMoney(overtimePay),
    netSalary: roundMoney(baseSalary - lateDeduction - absentDeduction + overtimePay),
    status: 'processed',
    generatedAt: new Date().toISOString(),
  }
}
