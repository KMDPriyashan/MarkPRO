import { useEffect, useState } from 'react'
import { FiClock, FiMapPin } from 'react-icons/fi'

/**
 * Render a live clock-in/out control with today's status.
 *
 * @param {{attendance: Object|null, onClockIn: Function, onClockOut: Function, loading: boolean}} props - Widget data and actions.
 * @returns {JSX.Element} Clock widget.
 */
export default function ClockInOut({ attendance, onClockIn, onClockOut, loading }) {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const isClockedIn = Boolean(attendance?.clockIn && !attendance?.clockOut)
  const status = attendance?.status || 'not clocked in'

  return <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-slate-950 p-6 text-white shadow-xl sm:p-8"><div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2 text-sm font-semibold text-blue-200"><FiClock /> Live attendance clock</div><p className="mt-4 text-5xl font-bold tracking-tight">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p><p className="mt-2 text-blue-100">{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p></div><div className="sm:text-right"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${status === 'late' ? 'bg-amber-400/20 text-amber-200' : status === 'present' ? 'bg-emerald-400/20 text-emerald-200' : 'bg-white/10 text-blue-100'}`}>{status}</span><p className="mt-3 text-sm text-blue-100">{attendance?.clockIn ? `Clocked in at ${new Date(attendance.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'You have not clocked in today'}</p><button className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold transition disabled:cursor-wait disabled:opacity-60 sm:w-auto ${isClockedIn ? 'bg-white text-blue-800 hover:bg-blue-50' : 'animate-pulse bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/30 ring-4 ring-emerald-300/30 hover:bg-emerald-300'}`} disabled={loading} onClick={isClockedIn ? onClockOut : onClockIn} type="button"><FiMapPin />{loading ? 'Getting location...' : isClockedIn ? 'Clock Out' : 'Mark attendance'}</button></div></div></section>
}
