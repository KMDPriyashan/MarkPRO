import { useState } from 'react'
import { FiDollarSign, FiFileText, FiLoader } from 'react-icons/fi'
import { toast } from 'react-toastify'
import Payslip from '../components/payroll/Payslip'
import { getAllEmployees } from '../services/employeeService'
import { generateBulkPayroll, getPayrollByMonth } from '../services/payrollService'
import Loader from '../components/common/Loader'
import EmptyState from '../components/common/EmptyState'

function getMonthOptions() { return Array.from({ length: 12 }, (_, index) => { const date = new Date(); date.setDate(1); date.setMonth(date.getMonth() - index); return date.toISOString().slice(0, 7) }) }

/** Render monthly payroll generation and payslip access. @returns {JSX.Element} Payroll page. */
export default function PayrollPage() {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7))
  const [payrolls, setPayrolls] = useState(() => getPayrollByMonth(new Date().toISOString().slice(0, 7)))
  const [selectedPayslip, setSelectedPayslip] = useState(null)
  const [generating, setGenerating] = useState(false)
  const employees = getAllEmployees()

  function selectMonth(event) { const selected = event.target.value; setMonth(selected); setPayrolls(getPayrollByMonth(selected)) }
  function generate() { setGenerating(true); window.setTimeout(() => { const generated = generateBulkPayroll(month, employees); setPayrolls(generated); setGenerating(false); toast.success(`Payroll generated for ${generated.length} employees.`) }, 250) }

  return <div className="space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-blue-600">People operations</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Payroll</h1><p className="mt-2 text-slate-500">Generate accurate monthly salary breakdowns from attendance.</p></div><div className="flex flex-wrap gap-3"><select className="field bg-white" onChange={selectMonth} value={month}>{getMonthOptions().map((option) => <option key={option} value={option}>{option}</option>)}</select><button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60" disabled={generating} onClick={generate} type="button">{generating ? <FiLoader className="animate-spin" /> : <FiDollarSign />}{generating ? 'Generating...' : 'Generate Payroll for All'}</button></div></div>{generating && <Loader label="Calculating payroll..." />}<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4"><FiFileText className="text-blue-600" /><p className="font-semibold text-slate-900">Payroll for {month}</p><span className="ml-auto text-sm text-slate-500">{payrolls.length} records</span></div><div className="overflow-x-auto"><table className="min-w-[940px] w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['Employee', 'Base', 'Present', 'Late', 'Absent', 'Deductions', 'Net', 'Actions'].map((heading) => <th className="px-5 py-3" key={heading}>{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{payrolls.map((payroll) => <tr key={payroll.id}><td className="px-5 py-4 font-semibold text-slate-800">{payroll.employeeName}</td><td className="px-5 py-4 text-slate-600">LKR {Number(payroll.baseSalary || 0).toLocaleString()}</td><td className="px-5 py-4 text-emerald-700">{payroll.presentDays ?? '-'}</td><td className="px-5 py-4 text-amber-700">{payroll.lateDays ?? '-'}</td><td className="px-5 py-4 text-rose-700">{payroll.absentDays ?? '-'}</td><td className="px-5 py-4 text-slate-600">LKR {Number(payroll.totalDeductions || payroll.deductions || 0).toLocaleString()}</td><td className="px-5 py-4 font-bold text-slate-900">LKR {Number(payroll.netSalary || 0).toLocaleString()}</td><td className="px-5 py-4"><button className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700" onClick={() => setSelectedPayslip(payroll)} type="button"><FiFileText /> View Payslip</button></td></tr>)}</tbody></table>{!payrolls.length && <EmptyState message="No payroll generated for this month. Generate payroll to begin." icon={FiFileText} />}</div></section>{selectedPayslip && <Payslip onClose={() => setSelectedPayslip(null)} payroll={selectedPayslip} />}</div>
}
