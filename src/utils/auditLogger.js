import { v4 as uuidv4 } from 'uuid'
import { getItem, setItem } from './storage'

const AUDIT_KEY = 'auditLogs'

/**
 * Record an action in the local audit trail.
 *
 * @param {Object|null} user - Acting user, when available.
 * @param {string} action - Short action label.
 * @param {Object|string} details - Structured or human-readable action details.
 * @returns {Object} The created audit record.
 */
export function logAction(user, action, details) {
  const entry = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    userId: user?.id || user?.username || 'system',
    user: user?.fullName || user?.username || 'System',
    action,
    details: typeof details === 'string' ? details : JSON.stringify(details),
  }
  const logs = getItem(AUDIT_KEY, [])
  setItem(AUDIT_KEY, [entry, ...(Array.isArray(logs) ? logs : [])])
  return entry
}

/**
 * Read audit records matching optional filters.
 *
 * @param {{user?: string, action?: string, startDate?: string, endDate?: string}} [filters={}] - Filter values.
 * @returns {Array<Object>} Newest-first matching audit records.
 */
export function getAuditLogs(filters = {}) {
  const logs = getItem(AUDIT_KEY, [])
  if (!Array.isArray(logs)) return []
  const query = String(filters.user || '').toLowerCase()
  return logs.filter((log) => {
    const date = log.timestamp.slice(0, 10)
    return (!query || `${log.user} ${log.userId}`.toLowerCase().includes(query)) && (!filters.action || log.action === filters.action) && (!filters.startDate || date >= filters.startDate) && (!filters.endDate || date <= filters.endDate)
  })
}
