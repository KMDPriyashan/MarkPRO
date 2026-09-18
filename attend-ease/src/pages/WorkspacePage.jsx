import { useLocation } from 'react-router-dom'
import { FiArrowUpRight, FiCalendar, FiClock, FiDollarSign, FiUsers } from 'react-icons/fi'

const pageMeta = {
  '/dashboard': ['Dashboard', 'A clear view of your workforce today.'],
  '/attendance': ['Attendance', 'Monitor presence, schedules, and hours.'],
  '/leave': ['Leave requests', 'Review and manage time away from work.'],
  '/payroll': ['Payroll', 'Keep compensation cycles accurate and on track.'],
  '/employees': ['Employees', 'Your team directory and employee records.'],
  '/audit-logs': ['Audit logs', 'A traceable history of workspace activity.'],
}

const metrics = [
  ['Present today', '184', '+8.2%', FiUsers, 'text-blue-600 bg-blue-50'],
  ['On leave', '12', '-2.4%', FiCalendar, 'text-amber-600 bg-amber-50'],
  ['Hours tracked', '1,284', '+12.6%', FiClock, 'text-emerald-600 bg-emerald-50'],
  ['Payroll total', '$84,620', '+4.1%', FiDollarSign, 'text-violet-600 bg-violet-50'],
]

export default function WorkspacePage() {
  const { pathname } = useLocation()
  const [title, description] = pageMeta[pathname] ?? pageMeta['/dashboard']

  return <div className="space-y-8">
    <div><p className="text-sm font-medium text-blue-600">Friday, September 18, 2026</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{title}</h1><p className="mt-2 text-slate-500">{description}</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(([label, value, change, Icon, color]) => <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" key={label}><div className="flex items-start justify-between"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-2xl font-bold text-slate-900">{value}</p></div><span className={`rounded-lg p-3 ${color}`}><Icon size={20} /></span></div><p className="mt-4 text-xs font-semibold text-emerald-600">{change} <span className="font-normal text-slate-400">from last period</span></p></article>)}
    </div>
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Attendance overview</h2><p className="mt-1 text-sm text-slate-500">Team presence over the last 7 days</p></div><button className="text-sm font-semibold text-blue-600">View report <FiArrowUpRight className="inline" /></button></div><div className="mt-8 flex h-44 items-end gap-3">{[62, 74, 68, 88, 82, 94, 77].map((height, index) => <div className="flex flex-1 flex-col items-center gap-2" key={index}><div className="w-full rounded-t-md bg-blue-600" style={{ height: `${height}%` }} /><span className="text-xs text-slate-400">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</span></div>)}</div></section>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-bold text-slate-900">Recent activity</h2><div className="mt-5 space-y-5">{['Maya Patel clocked in', 'Leave request approved', 'Payroll cycle exported'].map((item, index) => <div className="flex gap-3" key={item}><span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" /><div><p className="text-sm font-medium text-slate-700">{item}</p><p className="mt-1 text-xs text-slate-400">{index + 2} hours ago</p></div></div>)}</div></section>
    </div>
  </div>
}
