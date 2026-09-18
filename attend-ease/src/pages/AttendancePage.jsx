import { useMemo, useState } from 'react'
import { FiActivity, FiAlertCircle, FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import AttendanceTable from '../components/attendance/AttendanceTable'
import ClockInOut from '../components/attendance/ClockInOut'
import { clockIn, clockOut, getAllAttendance, getAttendanceStats, getTodayAttendance } from '../services/attendanceService'
import { getAllEmployees } from '../services/employeeService'
import { calculateDistance, getCurrentLocation, OFFICE_LOCATION } from '../utils/geoUtils'

/**
 * Render the attendance overview, clock action, statistics, and records table.
 *
 * @returns {JSX.Element} Attendance management page.
 */
export default function AttendancePage() {
  const { user } = useAuth()
  const [records, setRecords] = useState(() => getAllAttendance())
  const [employees, setEmployees] = useState(() => getAllEmployees())
  const [loading, setLoading] = useState(false)
  const employeeId = user?.id || user?.employeeId || user?.username
  const todayAttendance = getTodayAttendance(employeeId)
  const stats = useMemo(() => getAttendanceStats(records), [records])

  async function handleClockIn() {
    setLoading(true)
    try {
      const location = await getCurrentLocation()
      const distance = calculateDistance(location.lat, location.lng, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng)
      if (distance > OFFICE_LOCATION.radius) {
        toast.error(`You are ${Math.round(distance)}m from the office. Clock in within ${OFFICE_LOCATION.radius}m.`)
        return
      }
      clockIn(user, { ...location, distance: Math.round(distance) })
      refresh()
      toast.success('Clocked in successfully.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  function handleClockOut() {
    const result = clockOut(user)
    if (!result) {
      toast.error('No active clock-in found for today.')
      return
    }
    refresh()
    toast.success('Clocked out successfully.')
  }

  function refresh() {
    setRecords(getAllAttendance())
    setEmployees(getAllEmployees())
  }

  const cards = [
    ['Present', stats.present, FiCheckCircle, 'text-emerald-600 bg-emerald-50'],
    ['Late', stats.late, FiClock, 'text-amber-600 bg-amber-50'],
    ['Absent', stats.absent, FiAlertCircle, 'text-rose-600 bg-rose-50'],
    ['On Leave', stats.onLeave, FiCalendar, 'text-blue-600 bg-blue-50'],
  ]

  return <div className="space-y-6"><div><p className="text-sm font-medium text-blue-600">People operations</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Attendance</h1><p className="mt-2 text-slate-500">Track daily presence and keep your team on schedule.</p></div><ClockInOut attendance={todayAttendance} loading={loading} onClockIn={handleClockIn} onClockOut={handleClockOut} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, Icon, color]) => <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" key={label}><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p></div><span className={`rounded-lg p-3 ${color}`}><Icon size={20} /></span></div></article>)}</div><div><div className="mb-4 flex items-center gap-2"><FiActivity className="text-blue-600" /><h2 className="text-lg font-bold text-slate-900">Attendance records</h2></div><AttendanceTable employees={employees} records={records} /></div></div>
}
