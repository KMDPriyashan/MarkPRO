import { FiArrowLeft, FiCompass } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return <main className="flex min-h-screen items-center justify-center bg-mist p-6 text-center"><div className="max-w-md"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600"><FiCompass size={30} /></span><p className="mt-6 text-sm font-bold uppercase tracking-widest text-blue-600">404 error</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Page not found</h1><p className="mt-3 text-slate-500">The page you are looking for does not exist or has moved.</p><Link className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700" to="/dashboard"><FiArrowLeft /> Return to dashboard</Link></div></main>
}
