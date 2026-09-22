import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'

/**
 * Protect a route tree from unauthenticated access.
 *
 * @param {{children?: import('react').ReactNode}} props - Optional protected content.
 * @returns {JSX.Element} Protected children, nested routes, or a login redirect.
 */
export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (!user) {
      toast.error('Please sign in to continue.')
    }
  }, [user])

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return children ?? <Outlet />
}
