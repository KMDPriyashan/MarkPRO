import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { login as loginUser, signup } from '../services/authService'

/**
 * Render the login or signup form and connect it to the auth service.
 *
 * @returns {JSX.Element} Authentication page.
 */
export default function AuthPage() {
  const isSignup = useLocation().pathname === '/signup'
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ fullName: '', username: '', email: '', password: '' })

  function handleChange(event) {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const result = isSignup
      ? signup(formData)
      : loginUser(formData.username, formData.password)

    if (!result.success) {
      toast.error(result.message)
      if (result.redirectToSignup) {
        navigate('/signup')
      }
      return
    }

    login(result.user)
    toast.success(result.message)
    navigate('/dashboard')
  }

  return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12"><section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"><div className="mb-8 flex items-center gap-3"><div className="rounded-xl bg-blue-600 p-3 text-white">AE</div><div><p className="font-bold text-slate-900">AttendEase</p><p className="text-xs text-slate-500">People operations, simplified</p></div></div><h1 className="text-2xl font-bold text-slate-900">{isSignup ? 'Create your account' : 'Welcome back'}</h1><p className="mt-2 text-sm text-slate-500">{isSignup ? 'Set up your workspace in a few seconds.' : 'Sign in to your workforce workspace.'}</p><form className="mt-7 space-y-4" onSubmit={handleSubmit}>{isSignup && <input className="field" name="fullName" onChange={handleChange} placeholder="Full name" required />}{isSignup && <input className="field" name="email" onChange={handleChange} placeholder="Work email" required type="email" />}<input className="field" name="username" onChange={handleChange} placeholder="Username" required minLength={4} /><input className="field" name="password" onChange={handleChange} placeholder="Password" required minLength={6} type="password" /><button className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700" type="submit">{isSignup ? 'Create account' : 'Sign in'}</button></form><p className="mt-6 text-center text-sm text-slate-500">{isSignup ? 'Already have an account?' : 'New to AttendEase?'} <Link className="font-semibold text-blue-600 hover:text-blue-700" to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create one'}</Link></p></section></main>
}
