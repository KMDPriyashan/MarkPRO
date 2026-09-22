import { useState } from 'react'
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiUser } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { login } from '../services/authService'
import { validatePassword, validateRequired } from '../utils/validators'

/**
 * Render the AttendEase login page and authenticate submitted credentials.
 *
 * @returns {JSX.Element} Split-screen login experience.
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ username: '', password: '' })

  function handleChange(event) {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!validateRequired(formData.username) || !validatePassword(formData.password)) {
      toast.error('Enter a username and a password of at least 6 characters.')
      return
    }

    const result = login(formData.username, formData.password)
    if (result.success) {
      setUser(result.user)
      toast.success(result.message)
      navigate('/dashboard')
    } else if (result.redirectToSignup) {
      toast.info(result.message)
      navigate('/signup')
    } else {
      toast.error(result.message)
    }
  }

  return <main className="min-h-screen bg-slate-950 lg:grid lg:grid-cols-[1.05fr_0.95fr]"><section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-slate-950 px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between xl:px-20"><div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" /><div className="absolute bottom-20 right-20 h-44 w-44 rounded-full border border-white/10" /><div className="relative"><div className="flex items-center gap-3"><div className="rounded-xl bg-white/15 px-3 py-2 text-sm font-bold">AE</div><span className="text-xl font-bold tracking-tight">AttendEase</span></div><div className="mt-28 max-w-lg"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">Workforce clarity</p><h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight">Every shift, request, and payday in sync.</h1><p className="mt-6 max-w-md text-lg leading-8 text-blue-100">A focused workspace for teams that want people operations to feel simple.</p></div></div><p className="relative text-sm text-blue-200">Trusted workspace for modern teams</p></section><section className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 sm:px-10"><div className="w-full max-w-md"><div className="mb-10 flex items-center gap-3 lg:hidden"><div className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white">AE</div><span className="text-xl font-bold text-slate-900">AttendEase</span></div><div><p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Welcome back</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Sign in to your workspace</h2><p className="mt-3 text-slate-500">Use your AttendEase account to continue.</p></div><form className="mt-8 space-y-5" onSubmit={handleSubmit}><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Username</span><span className="relative block"><FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input autoComplete="username" className="field pl-11" name="username" onChange={handleChange} placeholder="Enter your username" value={formData.username} /></span></label><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Password</span><span className="relative block"><FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input autoComplete="current-password" className="field pl-11 pr-12" name="password" onChange={handleChange} placeholder="Enter your password" type={showPassword ? 'text' : 'password'} value={formData.password} /><button aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 hover:text-slate-700" onClick={() => setShowPassword((visible) => !visible)} type="button">{showPassword ? <FiEyeOff /> : <FiEye />}</button></span></label><button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700" type="submit">Sign in <FiArrowRight /></button></form><p className="mt-8 text-center text-sm text-slate-500">Need an account? <Link className="font-semibold text-blue-600 hover:text-blue-700" to="/signup">Create one</Link></p></div></section></main>
}
