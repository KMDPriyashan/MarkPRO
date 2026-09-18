import { Link, useLocation } from 'react-router-dom'

export default function AuthPage() {
  const isSignup = useLocation().pathname === '/signup'

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-3 text-white">AE</div>
          <div><p className="font-bold text-slate-900">AttendEase</p><p className="text-xs text-slate-500">People operations, simplified</p></div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="mt-2 text-sm text-slate-500">{isSignup ? 'Set up your workspace in a few seconds.' : 'Sign in to your workforce workspace.'}</p>
        <form className="mt-7 space-y-4" onSubmit={(event) => event.preventDefault()}>
          {isSignup && <input className="field" placeholder="Full name" />}
          <input className="field" type="email" placeholder="Work email" />
          <input className="field" type="password" placeholder="Password" />
          <button className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700" type="submit">{isSignup ? 'Create account' : 'Sign in'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">{isSignup ? 'Already have an account?' : 'New to AttendEase?'} <Link className="font-semibold text-blue-600 hover:text-blue-700" to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create one'}</Link></p>
      </section>
    </main>
  )
}
