import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

/**
 * Compose the authenticated page layout around nested route content.
 *
 * @returns {JSX.Element} Responsive navbar, sidebar, and outlet layout.
 */
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return <div className="min-h-screen bg-mist text-slate-700"><Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="lg:pl-64"><Navbar onMenuToggle={() => setSidebarOpen(true)} /><main className="mx-auto max-w-7xl p-5 sm:p-8"><Outlet /></main></div>{sidebarOpen && <button aria-label="Close navigation overlay" className="fixed inset-0 z-20 bg-slate-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} type="button" />}</div>
}
