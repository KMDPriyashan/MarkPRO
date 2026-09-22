import { FiActivity, FiCalendar, FiCreditCard, FiFileText, FiGrid, FiHome, FiTruck, FiTool, FiCoffee, FiUsers, FiSettings, FiX } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navigation = [
  { label: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { label: 'Attendance', path: '/attendance', icon: FiActivity },
  { label: 'Leave', path: '/leave', icon: FiCalendar },
  { label: 'Payroll', path: '/payroll', icon: FiCreditCard },
  { label: 'Employees', path: '/employees', icon: FiUsers, adminOnly: true },
  { label: 'Audit Logs', path: '/audit-logs', icon: FiFileText, adminOnly: true },
  { label: 'Organization', path: '/organization', icon: FiSettings, adminOnly: true },
  { label: 'Food Court', path: '/food-court', icon: FiCoffee },
  { label: 'Transport', path: '/transport', icon: FiTruck },
  { label: 'Accommodation', path: '/accommodation', icon: FiHome },
  { label: 'Facilities', path: '/facilities', icon: FiTool },
]

/**
 * Render authenticated workspace navigation with role-aware links.
 *
 * @param {{isOpen: boolean, onClose: Function}} props - Responsive sidebar controls.
 * @returns {JSX.Element} Workspace sidebar.
 */
export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-navy px-5 py-6 text-slate-300 transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex items-center justify-between px-2"><div className="flex items-center gap-3"><div className="rounded-lg bg-blue-500 px-2.5 py-2 text-sm font-bold text-white">AE</div><span className="text-lg font-bold text-white">AttendEase</span></div><button aria-label="Close navigation" className="rounded-lg p-2 hover:bg-white/10 lg:hidden" onClick={onClose} type="button"><FiX /></button></div><p className="mb-4 mt-10 px-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Workspace</p><nav aria-label="Main navigation" className="space-y-1">{navigation.filter(({ adminOnly }) => !adminOnly || isAdmin).map(({ label, path, icon: Icon }) => <NavLink className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-white/10 hover:text-white'}`} key={path} onClick={onClose} to={path}><Icon size={18} />{label}</NavLink>)}</nav></aside>
}
