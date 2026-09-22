import { v4 as uuidv4 } from 'uuid'
import { getItem, setItem } from '../utils/storage'
import { getCurrentUser } from './authService'
import { logAction } from '../utils/auditLogger'

const EMPLOYEES_KEY = 'employees'

/**
 * Read all employee records from localStorage.
 *
 * @returns {Array<Object>} Stored employees, or an empty array when unavailable.
 */
export function getAllEmployees() {
  const employees = getItem(EMPLOYEES_KEY, [])
  return Array.isArray(employees) ? employees : []
}

/**
 * Find one employee by their identifier.
 *
 * @param {string} employeeId - Employee identifier.
 * @returns {Object|undefined} Matching employee, when found.
 */
export function getEmployeeById(employeeId) {
  return getAllEmployees().find((employee) => employee.id === employeeId)
}

/**
 * Create and persist an employee record.
 *
 * @param {Object} employeeData - Employee profile fields.
 * @returns {Object} The created employee.
 */
export function createEmployee(employeeData) {
  const employee = normalizeEmployee(employeeData)
  const employees = [...getAllEmployees(), employee]
  setItem(EMPLOYEES_KEY, employees)
  logAction(getCurrentUser(), 'employee.created', { employeeId: employee.id, employeeName: employee.fullName })
  return employee
}

/**
 * Update an existing employee record.
 *
 * @param {string} employeeId - Employee identifier.
 * @param {Object} updates - Fields to update.
 * @returns {Object|null} Updated employee, or null when not found.
 */
export function updateEmployee(employeeId, updates) {
  const employees = getAllEmployees()
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId)
  if (employeeIndex === -1) {
    return null
  }

  const updatedEmployee = normalizeEmployee({ ...employees[employeeIndex], ...updates }, employeeId)
  employees[employeeIndex] = updatedEmployee
  setItem(EMPLOYEES_KEY, employees)
  logAction(getCurrentUser(), 'employee.updated', { employeeId, employeeName: updatedEmployee.fullName })
  return updatedEmployee
}

/**
 * Delete an employee record.
 *
 * @param {string} employeeId - Employee identifier.
 * @returns {boolean} Whether an employee was deleted.
 */
export function deleteEmployee(employeeId) {
  const employees = getAllEmployees()
  const remainingEmployees = employees.filter((employee) => employee.id !== employeeId)
  if (remainingEmployees.length === employees.length) {
    return false
  }

  setItem(EMPLOYEES_KEY, remainingEmployees)
  logAction(getCurrentUser(), 'employee.deleted', { employeeId })
  return true
}

/**
 * Import multiple employee records in one localStorage write.
 *
 * @param {Array<Object>} employeeData - Employee rows from a CSV preview.
 * @returns {Array<Object>} The created employee records.
 */
export function bulkImport(employeeData) {
  if (!Array.isArray(employeeData)) {
    return []
  }

  const importedEmployees = employeeData.map((employee) => normalizeEmployee(employee))
  setItem(EMPLOYEES_KEY, [...getAllEmployees(), ...importedEmployees])
  logAction(getCurrentUser(), 'employee.bulk_imported', { count: importedEmployees.length })
  return importedEmployees
}

/**
 * Search employee records by name, username, email, department, or designation.
 *
 * @param {string} query - Search text.
 * @param {Array<Object>} [employees=getAllEmployees()] - Optional source records.
 * @returns {Array<Object>} Matching employees.
 */
export function searchEmployees(query, employees = getAllEmployees()) {
  const normalizedQuery = String(query ?? '').trim().toLowerCase()
  if (!normalizedQuery) {
    return employees
  }

  return employees.filter((employee) => [employee.fullName, employee.username, employee.email, employee.department, employee.designation].some((value) => String(value ?? '').toLowerCase().includes(normalizedQuery)))
}

/**
 * Filter employee records by department.
 *
 * @param {string} department - Department name, or "All Departments" for no filter.
 * @param {Array<Object>} [employees=getAllEmployees()] - Optional source records.
 * @returns {Array<Object>} Employees in the requested department.
 */
export function filterByDepartment(department, employees = getAllEmployees()) {
  if (!department || department === 'All Departments') {
    return employees
  }

  return employees.filter((employee) => employee.department === department)
}

/**
 * Normalize employee values so seeded, form-created, and imported records share a shape.
 *
 * @param {Object} employeeData - Raw employee data.
 * @param {string} [employeeId] - Existing identifier for updates.
 * @returns {Object} Normalized employee.
 */
function normalizeEmployee(employeeData = {}, employeeId = employeeData.id) {
  return {
    ...employeeData,
    id: employeeId || uuidv4(),
    fullName: String(employeeData.fullName ?? '').trim(),
    username: String(employeeData.username ?? '').trim(),
    email: String(employeeData.email ?? '').trim().toLowerCase(),
    phone: String(employeeData.phone ?? '').trim(),
    department: String(employeeData.department ?? 'Engineering').trim(),
    designation: String(employeeData.designation ?? 'Team Member').trim(),
    baseSalary: Number(employeeData.baseSalary) || 0,
    role: employeeData.role || 'employee',
    status: employeeData.status || 'Active',
  }
}
