import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiCalendar, FiCheck, FiClock, FiDollarSign, FiPlayCircle, FiUserPlus, FiUsers, FiX } from 'react-icons/fi'
import { Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, Cell, XAxis, YAxis } from 'recharts'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { getAllAttendance } from '../services/attendanceService'
import { getAllEmployees } from '../services/employeeService'
import { approveLeave, getAllLeaves, getPendingLeaves, rejectLeave } from '../services/leaveService'
import EmptyState from '../components/common/EmptyState'

const chartColors = ['#2563eb', '#14b8a6', '#f59e0b', '#8b5cf6', '#f43f5e', '#64748b']

/** Render a role-aware dashboard for employees and administrators. @returns {JSX.Element} Dashboard page. */
export default function DashboardPage() {
  const { user } = useAuth()
  return user?.role === 'admin' || user?.role === 'manager' ? <AdminDashboard user={user} /> : <EmployeeDashboard user={user} />
}

function EmployeeDashboard({ user }) {
  const employees = getAllEmployees()
  const attendance = getAllAttendance()
  const today = new Date().toLocaleDateString('en-CA')
  const presentToday = attendance.filter((record) => record.date === today).length
  const onLeave = getAllLeaves().filter((leave) => leave.status === 'approved' && today >= leave.startDate && today <= leave.endDate).length
  const pendingApprovals = getPendingLeaves().length
  const attendanceTrend = useMemo(() => buildTrend(attendance), [attendance])
  const departmentDistribution = useMemo(() => Object.entries(employees.reduce((groups, employee) => { groups[employee.department] = (groups[employee.department] || 0) + 1; return groups }, {})).map(([name, value]) => ({ name, value })), [employees])
  const recentActivity = [...attendance].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 5)
  const stats = [['Total Employees', employees.length, FiUsers, 'text-blue-600 bg-blue-50'], ['Present Today', presentToday, FiClock, 'text-emerald-600 bg-emerald-50'], ['On Leave', onLeave, FiCalendar, 'text-amber-600 bg-amber-50'], ['Pending Approvals', pendingApprovals, FiUserPlus, 'text-violet-600 bg-violet-50']]

  return <div className="space-y-6"><Welcome user={user} /><StatCards stats={stats} /><Charts attendanceTrend={attendanceTrend} departmentDistribution={departmentDistribution} /><ActivityAndActions recentActivity={recentActivity} /></div>
}

function AdminDashboard({ user }) {
  const [refreshKey, setRefreshKey] = useState(0)
  const employees = getAllEmployees()
  const attendance = getAllAttendance()
  const today = new Date().toLocaleDateString('en-CA')
  const presentEmployees = employees.filter((employee) => attendance.some((record) => record.employeeId === employee.id && record.date === today))
  const pendingLeaves = getPendingLeaves()
  const activeLeaves = getAllLeaves().filter((leave) => leave.status === 'approved' && today >= leave.startDate && today <= leave.endDate).length
  const stats = [['Total Employees', employees.length, FiUsers, 'text-blue-600 bg-blue-50'], ['Present Today', presentEmployees.length, FiCheck, 'text-emerald-600 bg-emerald-50'], ['On Leave', activeLeaves, FiCalendar, 'text-amber-600 bg-amber-50'], ['Pending Approvals', pendingLeaves.length, FiUserPlus, 'text-violet-600 bg-violet-50']]

  function decide(leave, action) {
    const actionFn = action === 'approve' ? approveLeave : rejectLeave
    actionFn(leave.id, `Decision by ${user.fullName || user.username}`)
    setRefreshKey((value) => value + 1)
    toast.success(`Leave request ${action}d.`)
  }

  return <div className="space-y-6"><Welcome user={user} admin /><StatCards stats={stats} /><div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold text-slate-900">Present employees</h2><p className="mt-1 text-sm text-slate-500">Employees marked present today</p></div><Link className="text-sm font-semibold text-blue-600" to="/attendance">Attendance <FiArrowRight className="inline" /></Link></div>{presentEmployees.length ? <div className="divide-y divide-slate-100">{presentEmployees.map((employee) => <div className="flex items-center justify-between px-5 py-4" key={employee.id}><div><p className="font-semibold text-slate-800">{employee.fullName}</p><p className="text-xs text-slate-500">{employee.department} · {employee.designation || 'Team Member'}</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Present</span></div>)}</div> : <EmptyState message="No employees have marked attendance today." icon={FiUsers} />}</section><section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold text-slate-900">Leave approvals</h2><p className="mt-1 text-sm text-slate-500">Review pending requests</p></div><Link className="text-sm font-semibold text-blue-600" to="/leave">Open leave <FiArrowRight className="inline" /></Link></div>{pendingLeaves.length ? <div className="divide-y divide-slate-100">{pendingLeaves.slice(0, 4).map((leave) => <div className="px-5 py-4" key={`${leave.id}-${refreshKey}`}><p className="font-semibold text-slate-800">{leave.employeeName}</p><p className="mt-1 text-sm capitalize text-slate-500">{leave.type} · {leave.startDate} to {leave.endDate}</p><div className="mt-3 flex gap-2"><button className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700" onClick={() => decide(leave, 'approve')} type="button"><FiCheck /> Approve</button><button className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700" onClick={() => decide(leave, 'reject')} type="button"><FiX /> Reject</button></div></div>)}</div> : <EmptyState message="No pending leave approvals." icon={FiCalendar} />}</section></div><AdminQuickLinks /></div>
}

function Welcome({ user, admin = false }) { return <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-slate-950 p-6 text-white shadow-xl sm:p-8"><p className="text-sm font-semibold uppercase tracking-widest text-blue-200">{admin ? 'Administrator control center' : 'Your workspace'}</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Welcome back, {user?.fullName || user?.username || 'there'}!</h1><p className="mt-3 max-w-xl text-blue-100">{admin ? 'Monitor your workforce, review requests, and keep operations moving.' : 'Here is what is happening across your team today.'}</p></section> }
function StatCards({ stats }) { return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value, Icon, color]) => <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" key={label}><div className="flex items-start justify-between"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-2xl font-bold text-slate-900">{value}</p></div><span className={`rounded-lg p-3 ${color}`}><Icon size={20} /></span></div></article>)}</div> }
function Charts({ attendanceTrend, departmentDistribution }) { return <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]"><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-900">Attendance trend</h2><p className="mt-1 text-sm text-slate-500">Last 7 days</p><div className="mt-5 h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={attendanceTrend}><XAxis dataKey="day" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} /><Tooltip /><Line dataKey="present" name="Attendance" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></div></section><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-900">Department distribution</h2><div className="mt-3 h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={departmentDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>{departmentDistribution.map((entry, index) => <Cell fill={chartColors[index % chartColors.length]} key={entry.name} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></section></div> }
function ActivityAndActions({ recentActivity }) { return <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]"><section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-900">Recent activity</h2><Link className="text-sm font-semibold text-blue-600" to="/attendance">View all <FiArrowRight className="inline" /></Link></div>{recentActivity.length ? <div className="overflow-x-auto"><table className="min-w-[620px] w-full text-left text-sm"><tbody className="divide-y divide-slate-100">{recentActivity.map((record) => <tr key={record.id}><td className="px-5 py-4 font-medium text-slate-800">{record.employeeName}</td><td className="px-5 py-4 text-slate-500">{record.date}</td><td className="px-5 py-4 capitalize text-slate-600">{record.status}</td></tr>)}</tbody></table></div> : <EmptyState message="No attendance activity yet." icon={FiClock} />}</section><AdminQuickLinks /></div> }
function AdminQuickLinks() { return <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-900">Quick actions</h2><div className="mt-4 space-y-3"><QuickAction icon={FiPlayCircle} label="View attendance" to="/attendance" /><QuickAction icon={FiCalendar} label="Review leave" to="/leave" /><QuickAction icon={FiDollarSign} label="Generate payroll" to="/payroll" /><QuickAction icon={FiUsers} label="Manage organization" to="/organization" /></div></section> }
function QuickAction({ icon: Icon, label, to }) { return <Link className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700" to={to}><span className="flex items-center gap-3"><Icon className="text-blue-600" />{label}</span><FiArrowRight /></Link> }
function buildTrend(attendance) { return Array.from({ length: 7 }, (_, index) => { const date = new Date(); date.setDate(date.getDate() - (6 - index)); const key = date.toLocaleDateString('en-CA'); return { day: date.toLocaleDateString([], { weekday: 'short' }), present: attendance.filter((record) => record.date === key).length } }) }
