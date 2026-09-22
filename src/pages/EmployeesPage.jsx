import { useMemo, useState } from 'react'
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiUpload, FiUsers, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import BulkImport from '../components/employees/BulkImport'
import EmployeeForm from '../components/employees/EmployeeForm'
import { bulkImport, createEmployee, deleteEmployee, filterByDepartment, getAllEmployees, searchEmployees, updateEmployee } from '../services/employeeService'

const PAGE_SIZE = 10
const departments = ['All Departments', 'Engineering', 'Human Resources', 'Sales', 'Finance', 'Operations', 'Marketing']

/**
 * Render the searchable, paginated employee directory.
 *
 * @returns {JSX.Element} Employee management page.
 */
export default function EmployeesPage() {
  const [employees, setEmployees] = useState(() => getAllEmployees())
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('All Departments')
  const [page, setPage] = useState(1)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [deletingEmployee, setDeletingEmployee] = useState(null)

  const filteredEmployees = useMemo(() => filterByDepartment(department, searchEmployees(search, employees)), [department, employees, search])
  const pageCount = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE))
  const visibleEmployees = filteredEmployees.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function refresh(nextPage = 1) {
    setEmployees(getAllEmployees())
    setPage(Math.min(nextPage, pageCount))
  }

  function handleSave(employeeData) {
    if (editingEmployee) updateEmployee(editingEmployee.id, employeeData)
    else createEmployee(employeeData)
    setShowForm(false)
    setEditingEmployee(null)
    refresh()
    toast.success(editingEmployee ? 'Employee updated.' : 'Employee added.')
  }

  function handleDelete() {
    deleteEmployee(deletingEmployee.id)
    setDeletingEmployee(null)
    refresh(page)
    toast.success('Employee deleted.')
  }

  function handleImport(rows) {
    const imported = rows.map((row) => ({ ...row, fullName: row.fullname, baseSalary: row.basesalary, designation: row.designation || 'Team Member' }))
    const count = imported.length
    bulkImport(imported)
    setShowImport(false)
    refresh()
    toast.success(`${count} employee${count === 1 ? '' : 's'} imported.`)
  }

  return <div className="space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-blue-600">People operations</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Employees</h1><p className="mt-2 text-slate-500">Manage your team directory and employee records.</p></div><div className="flex gap-3"><button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50" onClick={() => setShowImport(true)} type="button"><FiUpload /> Bulk Import</button><button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700" onClick={() => { setEditingEmployee(null); setShowForm(true) }} type="button"><FiPlus /> Add Employee</button></div></div><div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"><label className="relative block flex-1"><FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="field pl-10" onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Search by name, email, department..." value={search} /></label><select className="field bg-white sm:max-w-xs" onChange={(event) => { setDepartment(event.target.value); setPage(1) }} value={department}>{departments.map((option) => <option key={option}>{option}</option>)}</select></div><section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4"><FiUsers className="text-blue-600" /><p className="font-semibold text-slate-900">{filteredEmployees.length} employees</p></div><div className="overflow-x-auto"><table className="min-w-[980px] w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['Employee ID', 'Name', 'Email', 'Department', 'Designation', 'Salary', 'Status', 'Actions'].map((heading) => <th className="px-5 py-3" key={heading}>{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{visibleEmployees.map((employee) => <tr className="hover:bg-slate-50/80" key={employee.id}><td className="px-5 py-4 font-mono text-xs text-slate-500">{employee.id}</td><td className="px-5 py-4"><p className="font-semibold text-slate-800">{employee.fullName}</p><p className="text-xs text-slate-400">@{employee.username}</p></td><td className="px-5 py-4 text-slate-600">{employee.email}</td><td className="px-5 py-4 text-slate-600">{employee.department}</td><td className="px-5 py-4 text-slate-600">{employee.designation || 'Team Member'}</td><td className="px-5 py-4 font-medium text-slate-800">LKR {Number(employee.baseSalary || 0).toLocaleString()}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${employee.status !== 'Inactive' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{employee.status || 'Active'}</span></td><td className="px-5 py-4"><div className="flex gap-1"><button aria-label={`Edit ${employee.fullName}`} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600" onClick={() => { setEditingEmployee(employee); setShowForm(true) }} title="Edit employee" type="button"><FiEdit2 /></button><button aria-label={`Delete ${employee.fullName}`} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" onClick={() => setDeletingEmployee(employee)} title="Delete employee" type="button"><FiTrash2 /></button></div></td></tr>)}</tbody></table>{!visibleEmployees.length && <div className="p-10 text-center text-sm text-slate-500">No employees match your filters.</div>}</div><div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm"><p className="text-slate-500">Page {page} of {pageCount}</p><div className="flex gap-2"><button className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40" disabled={page === 1} onClick={() => setPage((current) => current - 1)} type="button">Previous</button><button className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)} type="button">Next</button></div></div></section>{showForm && <EmployeeForm employee={editingEmployee} onClose={() => { setShowForm(false); setEditingEmployee(null) }} onSave={handleSave} />}{showImport && <BulkImport onClose={() => setShowImport(false)} onImport={handleImport} />}{deletingEmployee && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex justify-between"><div><p className="text-sm font-semibold text-red-600">Delete employee</p><h2 className="mt-2 text-xl font-bold text-slate-900">Remove {deletingEmployee.fullName}?</h2></div><button aria-label="Close confirmation" className="p-2 text-slate-400" onClick={() => setDeletingEmployee(null)} type="button"><FiX /></button></div><p className="mt-3 text-sm leading-6 text-slate-500">This will remove the employee from the directory. This action cannot be undone.</p><div className="mt-6 flex justify-end gap-3"><button className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600" onClick={() => setDeletingEmployee(null)} type="button">Cancel</button><button className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700" onClick={handleDelete} type="button">Delete employee</button></div></section></div>}</div>
}
