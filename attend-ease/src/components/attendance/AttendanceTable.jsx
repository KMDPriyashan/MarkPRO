import { useMemo, useState } from 'react'
import { FiDownload } from 'react-icons/fi'

const PAGE_SIZE = 10

/**
 * Render filterable and paginated attendance records.
 *
 * @param {{records: Array<Object>, employees: Array<Object>}} props - Table data.
 * @returns {JSX.Element} Attendance table.
 */
export default function AttendanceTable({ records, employees }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [employeeId, setEmployeeId] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const filteredRecords = useMemo(() => records.filter((record) => (!startDate || record.date >= startDate) && (!endDate || record.date <= endDate) && (employeeId === 'all' || record.employeeId === employeeId) && (status === 'all' || record.status === status)), [employeeId, endDate, records, startDate, status])
  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE))
  const pageRecords = filteredRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function exportCsv() {
    const header = 'Employee,Date,Clock In,Clock Out,Status,Working Hours'
    const body = filteredRecords.map((record) => [record.employeeName, record.date, record.clockIn, record.clockOut || '', record.status, record.workingHours || 0].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob([[header, body].join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'attend-ease-attendance.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  function resetPage() { setPage(1) }

  return <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-end"><label className="block"><span className="label">From</span><input className="field" onChange={(event) => { setStartDate(event.target.value); resetPage() }} type="date" value={startDate} /></label><label className="block"><span className="label">To</span><input className="field" onChange={(event) => { setEndDate(event.target.value); resetPage() }} type="date" value={endDate} /></label><label className="block min-w-44"><span className="label">Employee</span><select className="field bg-white" onChange={(event) => { setEmployeeId(event.target.value); resetPage() }} value={employeeId}><option value="all">All employees</option>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.fullName}</option>)}</select></label><label className="block min-w-36"><span className="label">Status</span><select className="field bg-white" onChange={(event) => { setStatus(event.target.value); resetPage() }} value={status}><option value="all">All statuses</option><option value="present">Present</option><option value="late">Late</option></select></label><button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50" onClick={exportCsv} type="button"><FiDownload /> Export CSV</button></div><div className="overflow-x-auto"><table className="min-w-[760px] w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['Employee', 'Date', 'Clock In', 'Clock Out', 'Status', 'Hours'].map((heading) => <th className="px-5 py-3" key={heading}>{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{pageRecords.map((record) => <tr key={record.id}><td className="px-5 py-4 font-medium text-slate-800">{record.employeeName}</td><td className="px-5 py-4 text-slate-500">{record.date}</td><td className="px-5 py-4 text-slate-500">{formatTime(record.clockIn)}</td><td className="px-5 py-4 text-slate-500">{record.clockOut ? formatTime(record.clockOut) : '-'}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${record.status === 'late' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{record.status}</span></td><td className="px-5 py-4 text-slate-500">{record.workingHours || 0}h</td></tr>)}</tbody></table>{!pageRecords.length && <div className="p-10 text-center text-sm text-slate-500">No attendance records match these filters.</div>}</div><div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm"><p className="text-slate-500">{filteredRecords.length} records · Page {page} of {pageCount}</p><div className="flex gap-2"><button className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-600 disabled:opacity-40" disabled={page === 1} onClick={() => setPage((current) => current - 1)} type="button">Previous</button><button className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-600 disabled:opacity-40" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)} type="button">Next</button></div></div></section>
}

function formatTime(value) { return value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-' }
