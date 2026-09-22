import { v4 as uuidv4 } from 'uuid'
import { getItem, setItem } from '../utils/storage'
import { getAllEmployees } from './employeeService'
import { getCurrentUser } from './authService'
import { logAction } from '../utils/auditLogger'

const ATTENDANCE_KEY = 'attendanceRecords'
const LEAVE_KEY = 'leaveRequests'

/** Read every attendance record. @returns {Array<Object>} Attendance records. */
export function getAllAttendance() {
  const records = getItem(ATTENDANCE_KEY, [])
  return Array.isArray(records) ? records : []
}

/**
 * Create a clock-in record for a user on the current day.
 *
 * @param {Object} user - Current authenticated user.
 * @param {{lat?: number, lng?: number, distance?: number}} [location] - Captured location.
 * @returns {Object} The saved attendance record.
 */
export function clockIn(user, location = {}) {
  const records = getAllAttendance()
  const today = getDateKey()
  const employeeId = getEmployeeId(user)
  const existing = records.find((record) => record.employeeId === employeeId && record.date === today)
  if (existing?.clockIn) {
    return existing
  }

  const record = { id: uuidv4(), employeeId, employeeName: user?.fullName || user?.username || 'Employee', date: today, clockIn: new Date().toISOString(), clockOut: null, location, status: calculateStatus(new Date()), workingHours: 0 }
  setItem(ATTENDANCE_KEY, [...records.filter((item) => item.id !== existing?.id), record])
  logAction(getCurrentUser(), 'attendance.clocked_in', { employeeId, date: today })
  return record
}

/**
 * Add a clock-out time to today's record for a user.
 *
 * @param {Object} user - Current authenticated user.
 * @returns {Object|null} Updated record, or null when no clock-in exists.
 */
export function clockOut(user) {
  const records = getAllAttendance()
  const employeeId = getEmployeeId(user)
  const recordIndex = records.findIndex((record) => record.employeeId === employeeId && record.date === getDateKey())
  if (recordIndex === -1) return null

  const record = { ...records[recordIndex], clockOut: new Date().toISOString() }
  record.workingHours = calculateWorkingHours(record.clockIn, record.clockOut)
  records[recordIndex] = record
  setItem(ATTENDANCE_KEY, records)
  logAction(getCurrentUser(), 'attendance.clocked_out', { employeeId, date: record.date })
  return record
}

/** Get today's attendance record for an employee. @param {string} employeeId - Employee ID. @returns {Object|null} Today's record. */
export function getTodayAttendance(employeeId) {
  return getAllAttendance().find((record) => record.employeeId === employeeId && record.date === getDateKey()) || null
}

/** Get all records for an employee. @param {string} employeeId - Employee ID. @returns {Array<Object>} Employee records. */
export function getAttendanceByEmployee(employeeId) {
  return getAllAttendance().filter((record) => record.employeeId === employeeId)
}

/** Get records within a calendar month. @param {string} month - YYYY-MM month. @param {string} [employeeId] - Optional employee ID. @returns {Array<Object>} Monthly records. */
export function getMonthlyAttendance(month, employeeId) {
  return getAllAttendance().filter((record) => record.date.startsWith(month) && (!employeeId || record.employeeId === employeeId))
}

/**
 * Classify a clock-in time relative to the 09:00 office start.
 * @param {Date|string} clockIn - Clock-in timestamp.
 * @returns {'present'|'late'} Attendance status.
 */
export function calculateStatus(clockIn) {
  const value = new Date(clockIn)
  const start = new Date(value)
  start.setHours(9, 0, 0, 0)
  return value > start ? 'late' : 'present'
}

/** Calculate elapsed working hours between two timestamps. @param {Date|string} clockIn - Start. @param {Date|string|null} clockOut - End. @returns {number} Hours rounded to two decimals. */
export function calculateWorkingHours(clockIn, clockOut) {
  if (!clockIn || !clockOut) return 0
  return Math.round((new Date(clockOut) - new Date(clockIn)) / 3600000 * 100) / 100
}

/**
 * Calculate today's present, late, absent, and on-leave totals.
 * @param {Array<Object>} [records=getAllAttendance()] - Records to summarize.
 * @param {string} [date=getDateKey()] - Date to summarize.
 * @returns {{present: number, late: number, absent: number, onLeave: number}} Attendance totals.
 */
export function getAttendanceStats(records = getAllAttendance(), date = getDateKey()) {
  const todayRecords = records.filter((record) => record.date === date)
  const present = todayRecords.filter((record) => record.status === 'present').length
  const late = todayRecords.filter((record) => record.status === 'late').length
  const employeeIds = new Set(getItem('employees', []).map((employee) => employee.id))
  const absent = Math.max(0, employeeIds.size - new Set(todayRecords.map((record) => record.employeeId)).size)
  const leaveRequests = getItem(LEAVE_KEY, [])
  const onLeave = Array.isArray(leaveRequests) ? leaveRequests.filter((leave) => leave.status === 'approved' && date >= leave.startDate && date <= leave.endDate).length : 0
  return { present, late, absent, onLeave }
}

function getDateKey(date = new Date()) {
  return date.toLocaleDateString('en-CA')
}

function getEmployeeId(user) {
  if (user?.id || user?.employeeId) return user.id || user.employeeId
  return getAllEmployees().find((employee) => employee.username === user?.username)?.id || user?.username
}
