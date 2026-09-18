import { useState } from 'react'
import { FiCalendar, FiCheck, FiInfo, FiSend, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { approveLeave, applyLeave, calculateLeaveDays, cancelLeave, getAllLeaves, getLeaveBalance, getLeavesByEmployee, getPendingLeaves, rejectLeave } from '../services/leaveService'

const types = [{ value: 'annual', label: 'Annual Leave' }, { value: 'sick', label: 'Sick Leave' }, { value: 'casual', label: 'Casual Leave' }]

/** Render the three-tab leave workflow for employees and approvers. @returns {JSX.Element} Leave page. */
export default function LeavePage() {
  const { user } = useAuth()
  const employeeId = user?.id || user?.employeeId || user?.username
  const canApprove = ['admin', 'manager'].includes(user?.role)
  const [activeTab, setActiveTab] = useState('My Leaves')
  const [_leaves, setLeaves] = useState(() => getAllLeaves())
  const [statusFilter, setStatusFilter] = useState('all')
  const [showDecision, setShowDecision] = useState(null)
  const [decisionReason, setDecisionReason] = useState('')
  const [formData, setFormData] = useState({ type: 'annual', startDate: '', endDate: '', reason: '' })
  const balance = getLeaveBalance(employeeId)
  const myLeaves = getLeavesByEmployee(employeeId).filter((leave) => statusFilter === 'all' || leave.status === statusFilter)
  const pendingLeaves = getPendingLeaves()
  const days = calculateLeaveDays(formData.startDate, formData.endDate)

  function refresh() { setLeaves(getAllLeaves()) }
  function updateForm(event) { setFormData((current) => ({ ...current, [event.target.name]: event.target.value })) }

  function submitLeave(event) {
    event.preventDefault()
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) { toast.error('Complete the leave type, dates, and reason.'); return }
    const result = applyLeave(user, formData)
    if (!result.success) { toast.error(result.message); return }
    refresh()
    setFormData({ type: 'annual', startDate: '', endDate: '', reason: '' })
    setActiveTab('My Leaves')
    toast.success('Leave request submitted.')
  }

  function handleCancel(leaveId) { if (cancelLeave(leaveId, employeeId)) { refresh(); toast.success('Leave request cancelled.') } }
  function submitDecision() {
    if (!decisionReason.trim()) { toast.error('Please provide a reason.'); return }
    const action = showDecision.action === 'approve' ? approveLeave : rejectLeave
    action(showDecision.id, decisionReason)
    setShowDecision(null)
    setDecisionReason('')
    refresh()
    toast.success(`Leave request ${showDecision.action}d.`)
  }

  return <div className="space-y-6"><div><p className="text-sm font-medium text-blue-600">People operations</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Leave management</h1><p className="mt-2 text-slate-500">Plan time away and keep approvals moving.</p></div><div className="flex gap-1 overflow-x-auto border-b border-slate-200"><button className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${activeTab === 'My Leaves' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`} onClick={() => setActiveTab('My Leaves')} type="button">My Leaves</button><button className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${activeTab === 'Apply Leave' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`} onClick={() => setActiveTab('Apply Leave')} type="button">Apply Leave</button>{canApprove && <button className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${activeTab === 'Approvals' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`} onClick={() => setActiveTab('Approvals')} type="button">Approvals <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs">{pendingLeaves.length}</span></button>}</div>{activeTab === 'My Leaves' && <MyLeaves leaves={myLeaves} filter={statusFilter} onCancel={handleCancel} onFilter={setStatusFilter} balance={balance} />}{activeTab === 'Apply Leave' && <ApplyLeave balance={balance} days={days} formData={formData} onChange={updateForm} onSubmit={submitLeave} />}{activeTab === 'Approvals' && canApprove && <Approvals leaves={pendingLeaves} onDecision={(action, id) => setShowDecision({ action, id })} />}{showDecision && <DecisionModal action={showDecision.action} onChange={setDecisionReason} onClose={() => setShowDecision(null)} onSubmit={submitDecision} reason={decisionReason} />}</div>
}

function MyLeaves({ leaves, filter, onCancel, onFilter, balance }) {
  return <div className="space-y-5"><div className="grid gap-3 sm:grid-cols-3">{Object.entries(balance).map(([type, item]) => <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" key={type}><p className="text-sm capitalize text-slate-500">{type} balance</p><p className="mt-2 text-2xl font-bold text-slate-900">{item.remaining} <span className="text-sm font-normal text-slate-400">/ {item.total} days</span></p><p className="mt-1 text-xs text-slate-400">{item.pending} pending</p></div>)}</div><section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 p-5"><h2 className="font-bold text-slate-900">My leave requests</h2><select className="field w-auto bg-white" onChange={(event) => onFilter(event.target.value)} value={filter}><option value="all">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="cancelled">Cancelled</option></select></div><div className="overflow-x-auto"><table className="min-w-[720px] w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Type', 'Dates', 'Days', 'Reason', 'Status', 'Action'].map((heading) => <th className="px-5 py-3" key={heading}>{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{leaves.map((leave) => <tr key={leave.id}><td className="px-5 py-4 font-semibold capitalize text-slate-800">{leave.type}</td><td className="px-5 py-4 text-slate-500">{leave.startDate} to {leave.endDate}</td><td className="px-5 py-4 text-slate-500">{leave.days || calculateLeaveDays(leave.startDate, leave.endDate)}</td><td className="max-w-xs px-5 py-4 text-slate-500">{leave.reason}</td><td className="px-5 py-4"><StatusBadge status={leave.status} /></td><td className="px-5 py-4">{leave.status === 'pending' && <button className="text-sm font-semibold text-red-600 hover:text-red-700" onClick={() => onCancel(leave.id)} type="button">Cancel</button>}</td></tr>)}</tbody></table>{!leaves.length && <p className="p-10 text-center text-sm text-slate-500">No leave requests found.</p>}</div></section></div>
}

function ApplyLeave({ balance, days, formData, onChange, onSubmit }) {
  const selectedBalance = balance[formData.type]
  return <section className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center gap-3"><span className="rounded-lg bg-blue-50 p-3 text-blue-600"><FiCalendar /></span><div><h2 className="font-bold text-slate-900">Apply for leave</h2><p className="text-sm text-slate-500">Submit a request for manager approval.</p></div></div><form className="mt-7 space-y-5" onSubmit={onSubmit}><label className="block"><span className="label">Leave type</span><select className="field bg-white" name="type" onChange={onChange} value={formData.type}>{types.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label><div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="label">Start date</span><input className="field" min={new Date().toISOString().slice(0, 10)} name="startDate" onChange={onChange} type="date" value={formData.startDate} /></label><label className="block"><span className="label">End date</span><input className="field" min={formData.startDate || new Date().toISOString().slice(0, 10)} name="endDate" onChange={onChange} type="date" value={formData.endDate} /></label></div>{days > 0 && <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-800"><FiInfo className="mt-0.5 shrink-0" /><span>This request covers <strong>{days} day{days === 1 ? '' : 's'}</strong>. You have <strong>{selectedBalance.remaining} {formData.type} days</strong> remaining.</span></div>}<label className="block"><span className="label">Reason</span><textarea className="field min-h-28 resize-y" name="reason" onChange={onChange} placeholder="Tell us why you need leave..." value={formData.reason} /></label><button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700" type="submit"><FiSend /> Submit request</button></form></section>
}

function Approvals({ leaves, onDecision }) {
  return <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-5"><h2 className="font-bold text-slate-900">Pending approvals</h2><p className="mt-1 text-sm text-slate-500">Review requests from your team.</p></div><div className="divide-y divide-slate-100">{leaves.map((leave) => <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center" key={leave.id}><div><p className="font-semibold text-slate-800">{leave.employeeName} <span className="font-normal capitalize text-slate-500">requested {leave.type} leave</span></p><p className="mt-1 text-sm text-slate-500">{leave.startDate} to {leave.endDate} · {leave.days || calculateLeaveDays(leave.startDate, leave.endDate)} days</p><p className="mt-1 text-sm text-slate-500">{leave.reason}</p></div><div className="flex shrink-0 gap-2"><button className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700" onClick={() => onDecision('approve', leave.id)} type="button"><FiCheck /> Approve</button><button className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700" onClick={() => onDecision('reject', leave.id)} type="button"><FiX /> Reject</button></div></div>)}{!leaves.length && <p className="p-10 text-center text-sm text-slate-500">No pending requests.</p>}</div></section>
}

function DecisionModal({ action, reason, onChange, onClose, onSubmit }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><h2 className="text-xl font-bold capitalize text-slate-900">{action} leave request</h2><p className="mt-2 text-sm text-slate-500">Add a note for the employee.</p><textarea autoFocus className="field mt-5 min-h-28" onChange={(event) => onChange(event.target.value)} placeholder="Reason or note" value={reason} /><div className="mt-5 flex justify-end gap-3"><button className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600" onClick={onClose} type="button">Cancel</button><button className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white ${action === 'approve' ? 'bg-emerald-600' : 'bg-red-600'}`} onClick={onSubmit} type="button">Confirm {action}</button></div></section></div>
}

function StatusBadge({ status }) { return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${status === 'approved' ? 'bg-emerald-50 text-emerald-700' : status === 'rejected' ? 'bg-red-50 text-red-700' : status === 'cancelled' ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-700'}`}>{status}</span> }
