import { FiLogOut, FiMenu } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

/**
 * Render the top navigation bar for authenticated workspace pages.
 *
 * @param {{onMenuToggle: Function}} props - Mobile navigation controls.
 * @returns {JSX.Element} Workspace navbar.
 */
export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const displayName = user?.name || user?.fullName || user?.username || 'User'
  const role = user?.role || 'employee'

  return <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur sm:px-8"><button aria-label="Open navigation" className="rounded-lg p-2 text-slate-600 lg:hidden" onClick={onMenuToggle} type="button"><FiMenu size={22} /></button><div className="ml-auto flex items-center gap-3 sm:gap-4"><div className="hidden text-right sm:block"><p className="text-sm font-semibold text-slate-800">{displayName}</p><span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold capitalize text-blue-700">{role}</span></div><div aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">{displayName.slice(0, 2).toUpperCase()}</div><button aria-label="Sign out" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" onClick={logout} title="Sign out" type="button"><FiLogOut size={18} /></button></div></header>
}
