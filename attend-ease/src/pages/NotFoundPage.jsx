import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return <main className="flex min-h-screen items-center justify-center bg-mist p-6 text-center"><div><p className="font-semibold text-blue-600">404</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Page not found</h1><Link className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white" to="/dashboard">Return to dashboard</Link></div></main>
}
