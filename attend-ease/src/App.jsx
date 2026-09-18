import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import { FiActivity, FiCalendar, FiCreditCard, FiFileText, FiGrid, FiLogOut, FiMenu, FiUsers, FiX } from 'react-icons/fi'
import { useState } from 'react'
import AuthPage from './pages/AuthPage'
import NotFoundPage from './pages/NotFoundPage'
import WorkspacePage from './pages/WorkspacePage'

const navigation = [
  { label: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { label: 'Attendance', path: '/attendance', icon: FiActivity },
  { label: 'Leave', path: '/leave', icon: FiCalendar },
  { label: 'Payroll', path: '/payroll', icon: FiCreditCard },
  { label: 'Employees', path: '/employees', icon: FiUsers },
  { label: 'Audit logs', path: '/audit-logs', icon: FiFileText },
]

function WorkspaceLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return <div className="min-h-screen bg-mist text-slate-700"><aside className={`fixed inset-y-0 left-0 z-20 w-64 bg-navy px-5 py-6 text-slate-300 transition-transform lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex items-center justify-between px-2"><div className="flex items-center gap-3"><div className="rounded-lg bg-blue-500 px-2.5 py-2 text-sm font-bold text-white">AE</div><span className="text-lg font-bold text-white">AttendEase</span></div><button className="lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><FiX /></button></div><p className="mb-4 mt-10 px-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Workspace</p><nav className="space-y-1">{navigation.map(({ label, path, icon: Icon }) => <NavLink className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-white/10 hover:text-white'}`} key={path} to={path} onClick={() => setMenuOpen(false)}><Icon size={18} />{label}</NavLink>)}</nav><div className="absolute bottom-6 left-5 right-5 border-t border-white/10 pt-5"><button className="flex items-center gap-3 px-3 text-sm text-slate-400 hover:text-white"><FiLogOut /> Sign out</button></div></aside><div className="lg:pl-64"><header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur sm:px-8"><button className="rounded-lg p-2 text-slate-600 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><FiMenu size={22} /></button><div className="ml-auto flex items-center gap-4"><div className="hidden text-right sm:block"><p className="text-sm font-semibold text-slate-800">Jordan Lee</p><p className="text-xs text-slate-500">Administrator</p></div><div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">JL</div></div></header><main className="mx-auto max-w-7xl p-5 sm:p-8"><Routes><Route path="/dashboard" element={<WorkspacePage />} /><Route path="/attendance" element={<WorkspacePage />} /><Route path="/leave" element={<WorkspacePage />} /><Route path="/payroll" element={<WorkspacePage />} /><Route path="/employees" element={<WorkspacePage />} /><Route path="/audit-logs" element={<WorkspacePage />} /><Route path="*" element={<NotFoundPage />} /></Routes></main></div></div>
}

export default function App() {
  return <BrowserRouter><Routes><Route path="/login" element={<AuthPage />} /><Route path="/signup" element={<AuthPage />} /><Route path="/*" element={<WorkspaceLayout />} /></Routes></BrowserRouter>
}
