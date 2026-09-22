import { useState } from 'react'
import { FiArrowRight, FiBriefcase, FiCheckCircle, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getAllUsers, signup } from '../services/authService'
import { validateEmail, validatePassword, validateRequired, validateUsername } from '../utils/validators'

const departments = ['Operations', 'Engineering', 'Finance', 'Human Resources', 'Marketing', 'Sales']

/**
 * Render the AttendEase account creation page.
 *
 * @returns {JSX.Element} Split-screen signup experience.
 */
export default function SignupPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({ fullName: '', username: '', email: '', password: '', confirmPassword: '', role: 'employee', department: 'Operations' })
  const firstUser = getAllUsers().length === 0

  function handleChange(event) {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!validateRequired(formData.fullName) || !validateUsername(formData.username)) {
      toast.error('Enter a full name and a username of at least 4 characters.')
      return
    }
    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address.')
      return
    }
    if (!validatePassword(formData.password)) {
      toast.error('Password must be at least 6 characters.')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    const result = signup(formData)
    if (!result.success) {
      toast.error(result.message)
      return
    }

    toast.success('Account created! Please login')
    navigate('/login')
  }

  return <main className="min-h-screen bg-slate-950 lg:grid lg:grid-cols-[0.9fr_1.1fr]"><section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-slate-950 px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between xl:px-20"><div className="relative"><div className="flex items-center gap-3"><div className="rounded-xl bg-white/15 px-3 py-2 text-sm font-bold">AE</div><span className="text-xl font-bold tracking-tight">AttendEase</span></div><div className="mt-28 max-w-md"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">Build your workspace</p><h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight">Make every workday easier to manage.</h1><div className="mt-8 space-y-4 text-blue-100">{['One view for your entire team', 'Clear, accountable people operations', 'Reports that keep decisions moving'].map((item) => <p className="flex items-center gap-3" key={item}><FiCheckCircle className="text-blue-200" />{item}</p>)}</div></div></div><p className="relative text-sm text-blue-200">Start with the essentials. Grow from there.</p></section><section className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10 sm:px-10"><div className="w-full max-w-xl"><div className="mb-8 flex items-center gap-3 lg:hidden"><div className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white">AE</div><span className="text-xl font-bold text-slate-900">AttendEase</span></div><p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Get started</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Create your account</h2><p className="mt-3 text-slate-500">Set up your profile and join your team workspace.</p>{firstUser && <div className="mt-6 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800"><FiCheckCircle /> You&apos;ll be the Admin</div>}<form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}><label className="block sm:col-span-2"><span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span><span className="relative block"><FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input className="field pl-11" name="fullName" onChange={handleChange} placeholder="Jordan Lee" value={formData.fullName} /></span></label><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Username</span><input className="field" name="username" onChange={handleChange} placeholder="jordanlee" value={formData.username} /></label><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Work email</span><span className="relative block"><FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input className="field pl-11" name="email" onChange={handleChange} placeholder="you@company.com" type="email" value={formData.email} /></span></label><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Role</span><select className="field bg-white" disabled={firstUser} name="role" onChange={handleChange} value={firstUser ? 'admin' : formData.role}><option value="employee">Employee</option><option value="manager">Manager</option><option value="admin">Administrator</option></select></label><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Department</span><span className="relative block"><FiBriefcase className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><select className="field bg-white pl-11" name="department" onChange={handleChange} value={formData.department}>{departments.map((department) => <option key={department}>{department}</option>)}</select></span></label><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Password</span><span className="relative block"><FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input className="field pl-11 pr-12" name="password" onChange={handleChange} placeholder="At least 6 characters" type={showPassword ? 'text' : 'password'} value={formData.password} /><button aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 hover:text-slate-700" onClick={() => setShowPassword((visible) => !visible)} type="button">{showPassword ? <FiEyeOff /> : <FiEye />}</button></span></label><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</span><span className="relative block"><FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input className="field pl-11 pr-12" name="confirmPassword" onChange={handleChange} placeholder="Repeat password" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} /><button aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 hover:text-slate-700" onClick={() => setShowConfirmPassword((visible) => !visible)} type="button">{showConfirmPassword ? <FiEyeOff /> : <FiEye />}</button></span></label><button className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:col-span-2" type="submit">Create account <FiArrowRight /></button></form><p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link className="font-semibold text-blue-600 hover:text-blue-700" to="/login">Sign in</Link></p></div></section></main>
}
