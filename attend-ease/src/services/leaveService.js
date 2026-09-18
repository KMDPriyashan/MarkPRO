import { v4 as uuidv4 } from 'uuid'
import { getItem, setItem } from '../utils/storage'

const LEAVE_KEY = 'leaveRequests'
export const LEAVE_BALANCES = { annual: 14, sick: 7, casual: 7 }

/** Read all leave requests. @returns {Array<Object>} Stored leave requests. */
export function getAllLeaves() {
  const leaves = getItem(LEAVE_KEY, [])
  return Array.isArray(leaves) ? leaves : []
}

/** Get leave requests belonging to one employee. @param {string} employeeId - Employee ID. @returns {Array<Object>} Employee leave requests. */
export function getLeavesByEmployee(employeeId) {
  return getAllLeaves().filter((leave) => leave.employeeId === employeeId)
}

/** Get all pending leave requests. @returns {Array<Object>} Pending requests. */
export function getPendingLeaves() {
  return getAllLeaves().filter((leave) => leave.status === 'pending')
}

/**
 * Apply for leave and persist the request.
 * @param {Object} user - Requesting user.
 * @param {{type: string, startDate: string, endDate: string, reason: string}} leaveData - Leave details.
 * @returns {{success: boolean, leave?: Object, message: string}} Application result.
 */
export function applyLeave(user, leaveData) {
  const days = calculateLeaveDays(leaveData.startDate, leaveData.endDate)
  const balance = getLeaveBalance(getEmployeeId(user))
  const type = normalizeType(leaveData.type)
  if (!type || !days) return { success: false, message: 'Choose a valid leave type and date range.' }
  if (days > balance[type].remaining) return { success: false, message: `Only ${balance[type].remaining} ${type} leave days remain.` }

  const leave = { id: uuidv4(), employeeId: getEmployeeId(user), employeeName: user?.fullName || user?.username || 'Employee', type, startDate: leaveData.startDate, endDate: leaveData.endDate, days, reason: String(leaveData.reason || '').trim(), status: 'pending', appliedAt: new Date().toISOString() }
  setItem(LEAVE_KEY, [...getAllLeaves(), leave])
  return { success: true, leave, message: 'Leave request submitted.' }
}

/** Approve a pending leave request. @param {string} leaveId - Request ID. @param {string} [reason] - Approval note. @returns {Object|null} Updated request. */
export function approveLeave(leaveId, reason = '') { return updateLeaveStatus(leaveId, 'approved', reason) }

/** Reject a pending leave request. @param {string} leaveId - Request ID. @param {string} [reason] - Rejection reason. @returns {Object|null} Updated request. */
export function rejectLeave(leaveId, reason = '') { return updateLeaveStatus(leaveId, 'rejected', reason) }

/** Cancel a pending leave request. @param {string} leaveId - Request ID. @param {string} employeeId - Request owner. @returns {Object|null} Cancelled request. */
export function cancelLeave(leaveId, employeeId) {
  const leaves = getAllLeaves()
  const index = leaves.findIndex((leave) => leave.id === leaveId && leave.employeeId === employeeId && leave.status === 'pending')
  if (index === -1) return null
  leaves[index] = { ...leaves[index], status: 'cancelled', cancelledAt: new Date().toISOString() }
  setItem(LEAVE_KEY, leaves)
  return leaves[index]
}

/** Calculate inclusive calendar days between two ISO dates. @param {string} startDate - Start date. @param {string} endDate - End date. @returns {number} Inclusive day count, or zero for invalid ranges. */
export function calculateLeaveDays(startDate, endDate) {
  if (!startDate || !endDate) return 0
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  const days = Math.floor((end - start) / 86400000) + 1
  return Number.isFinite(days) && days > 0 ? days : 0
}

/**
 * Calculate leave totals and remaining balances for an employee.
 * @param {string} employeeId - Employee ID.
 * @returns {Object} Annual, sick, and casual balances with total, used, pending, and remaining values.
 */
export function getLeaveBalance(employeeId) {
  const employeeLeaves = getLeavesByEmployee(employeeId)
  return Object.entries(LEAVE_BALANCES).reduce((balance, [type, total]) => {
    const matching = employeeLeaves.filter((leave) => normalizeType(leave.type) === type)
    const used = matching.filter((leave) => leave.status === 'approved').reduce((sum, leave) => sum + (leave.days || calculateLeaveDays(leave.startDate, leave.endDate)), 0)
    const pending = matching.filter((leave) => leave.status === 'pending').reduce((sum, leave) => sum + (leave.days || calculateLeaveDays(leave.startDate, leave.endDate)), 0)
    balance[type] = { total, used, pending, remaining: Math.max(0, total - used - pending) }
    return balance
  }, {})
}

function updateLeaveStatus(leaveId, status, reason) {
  const leaves = getAllLeaves()
  const index = leaves.findIndex((leave) => leave.id === leaveId && leave.status === 'pending')
  if (index === -1) return null
  leaves[index] = { ...leaves[index], status, decisionReason: String(reason).trim(), decidedAt: new Date().toISOString() }
  setItem(LEAVE_KEY, leaves)
  return leaves[index]
}

function normalizeType(type) {
  const normalized = String(type || '').toLowerCase().replace(/\s+leave$/, '')
  return Object.prototype.hasOwnProperty.call(LEAVE_BALANCES, normalized) ? normalized : null
}

function getEmployeeId(user) { return user?.id || user?.employeeId || user?.username }
