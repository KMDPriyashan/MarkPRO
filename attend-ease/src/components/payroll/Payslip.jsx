import { useRef } from 'react'
import { FiDownload, FiX } from 'react-icons/fi'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/**
 * Render a professional payslip and provide a PDF download.
 *
 * @param {{payroll: Object, onClose: Function}} props - Payslip data and close action.
 * @returns {JSX.Element} Payslip modal.
 */
export default function Payslip({ payroll, onClose }) {
  const payslipRef = useRef(null)

  async function downloadPdf() {
    const canvas = await html2canvas(payslipRef.current, { scale: 2, backgroundColor: '#ffffff' })
    const pdf = new jsPDF('p', 'mm', 'a4')
    const width = pdf.internal.pageSize.getWidth()
    const height = canvas.height * width / canvas.width
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, width, height)
    pdf.save(`attendease-payslip-${payroll.employeeName}-${payroll.month}.pdf`)
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-4"><h2 className="font-bold text-slate-900">Payslip preview</h2><button aria-label="Close payslip" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" onClick={onClose} type="button"><FiX /></button></div><div className="p-6 sm:p-8" ref={payslipRef}><div className="flex items-start justify-between border-b-2 border-blue-600 pb-6"><div><p className="text-2xl font-bold text-blue-700">AttendEase</p><p className="mt-1 text-sm text-slate-500">People operations, simplified</p></div><div className="text-right"><p className="text-lg font-bold text-slate-900">PAYSLIP</p><p className="text-sm text-slate-500">{payroll.month}</p></div></div><div className="grid gap-4 border-b border-slate-200 py-6 sm:grid-cols-2"><div><p className="text-xs uppercase tracking-wide text-slate-400">Employee</p><p className="mt-1 font-semibold text-slate-900">{payroll.employeeName}</p><p className="text-sm text-slate-500">{payroll.designation}</p></div><div className="sm:text-right"><p className="text-xs uppercase tracking-wide text-slate-400">Department</p><p className="mt-1 font-semibold text-slate-900">{payroll.department || 'N/A'}</p><p className="text-sm text-slate-500">{payroll.email}</p></div></div><div className="grid gap-8 py-6 sm:grid-cols-2"><div><h3 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Earnings</h3><Line label="Base salary" value={payroll.baseSalary} /><Line label="Overtime pay" value={payroll.overtimePay} /></div><div><h3 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Deductions</h3><Line label="Late deduction" value={payroll.lateDeduction} /><Line label="Absent deduction" value={payroll.absentDeduction} /></div></div><div className="rounded-xl bg-blue-700 p-5 text-white"><div className="flex items-center justify-between"><span className="font-semibold">Net salary</span><span className="text-2xl font-bold">LKR {payroll.netSalary.toLocaleString()}</span></div></div><div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-slate-500"><div><p className="font-bold text-slate-800">{payroll.presentDays}</p>Present days</div><div><p className="font-bold text-slate-800">{payroll.lateDays}</p>Late days</div><div><p className="font-bold text-slate-800">{payroll.overtimeHours}h</p>Overtime</div></div></div><div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4"><button className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600" onClick={onClose} type="button">Close</button><button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700" onClick={downloadPdf} type="button"><FiDownload /> Download PDF</button></div></section></div>
}

function Line({ label, value }) { return <div className="flex justify-between border-b border-slate-100 py-3 text-sm"><span className="text-slate-500">{label}</span><span className="font-semibold text-slate-800">LKR {Number(value || 0).toLocaleString()}</span></div> }
