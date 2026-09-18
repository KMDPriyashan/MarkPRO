import { useState } from 'react'
import { FiSave, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { validateEmail, validateRequired, validateUsername } from '../../utils/validators'

const emptyEmployee = { fullName: '', username: '', email: '', phone: '', department: 'Engineering', designation: '', baseSalary: '', role: 'employee', status: 'Active' }
const departments = ['Engineering', 'Human Resources', 'Sales', 'Finance', 'Operations', 'Marketing']

/**
 * Render a modal for creating or editing an employee.
 *
 * @param {{employee?: Object|null, onClose: Function, onSave: Function}} props - Form properties.
 * @returns {JSX.Element} Employee form modal.
 */
export default function EmployeeForm({ employee, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...emptyEmployee, ...employee, baseSalary: employee?.baseSalary ?? '' })
  const isEditing = Boolean(employee)

  function handleChange(event) {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!validateRequired(formData.fullName) || !validateUsername(formData.username)) {
      toast.error('Enter a name and a username of at least 4 characters.')
      return
    }
    if (!validateEmail(formData.email) || !validateRequired(formData.department) || !validateRequired(formData.designation)) {
      toast.error('Complete the email, department, and designation fields.')
      return
    }
    if (!Number(formData.baseSalary) || Number(formData.baseSalary) < 0) {
      toast.error('Enter a valid base salary.')
      return
    }

    onSave({ ...formData, baseSalary: Number(formData.baseSalary) })
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="presentation"><section aria-labelledby="employee-form-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8" role="dialog"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Employee directory</p><h2 className="mt-2 text-2xl font-bold text-slate-900" id="employee-form-title">{isEditing ? 'Edit employee' : 'Add employee'}</h2></div><button aria-label="Close employee form" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" onClick={onClose} type="button"><FiX size={20} /></button></div><form className="mt-7 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}><Field label="Full name" name="fullName" onChange={handleChange} value={formData.fullName} /><Field label="Username" name="username" onChange={handleChange} value={formData.username} /><Field label="Email" name="email" onChange={handleChange} type="email" value={formData.email} /><Field label="Phone" name="phone" onChange={handleChange} value={formData.phone} /><label className="block"><span className="label">Department</span><select className="field bg-white" name="department" onChange={handleChange} value={formData.department}>{departments.map((department) => <option key={department}>{department}</option>)}</select></label><Field label="Designation" name="designation" onChange={handleChange} value={formData.designation} /><Field label="Base salary" min="0" name="baseSalary" onChange={handleChange} type="number" value={formData.baseSalary} /><label className="block"><span className="label">Status</span><select className="field bg-white" name="status" onChange={handleChange} value={formData.status}><option>Active</option><option>Inactive</option></select></label><label className="block"><span className="label">Role</span><select className="field bg-white" name="role" onChange={handleChange} value={formData.role}><option value="employee">Employee</option><option value="manager">Manager</option><option value="admin">Administrator</option></select></label><div className="mt-3 flex justify-end gap-3 sm:col-span-2"><button className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50" onClick={onClose} type="button">Cancel</button><button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700" type="submit"><FiSave />{isEditing ? 'Save changes' : 'Add employee'}</button></div></form></section></div>
}

function Field({ label, ...props }) {
  return <label className="block"><span className="label">{label}</span><input className="field" {...props} /></label>
}
