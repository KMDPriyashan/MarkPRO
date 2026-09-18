import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'
import WorkspacePage from './pages/WorkspacePage'
import EmployeesPage from './pages/EmployeesPage'
import AttendancePage from './pages/AttendancePage'
import LeavePage from './pages/LeavePage'
import PayrollPage from './pages/PayrollPage'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/common/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'

/**
 * Configure the AttendEase route tree and authentication boundary.
 *
 * @returns {JSX.Element} The application router and toast notifications.
 */
export default function App() {
  return <AuthProvider><BrowserRouter><Routes><Route path="/login" element={<LoginPage />} /><Route path="/signup" element={<SignupPage />} /><Route element={<ProtectedRoute />}><Route element={<Layout />}><Route path="/dashboard" element={<WorkspacePage />} /><Route path="/attendance" element={<AttendancePage />} /><Route path="/leave" element={<LeavePage />} /><Route path="/payroll" element={<PayrollPage />} /><Route path="/employees" element={<EmployeesPage />} /><Route path="/audit-logs" element={<WorkspacePage />} /></Route></Route><Route path="*" element={<NotFoundPage />} /></Routes></BrowserRouter><ToastContainer position="top-right" /></AuthProvider>
}
