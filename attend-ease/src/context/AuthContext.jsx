import { createContext, useContext, useState } from 'react'
import { getCurrentUser as getStoredUser, logout as logoutUser } from '../services/authService'

const AuthContext = createContext(null)

/**
 * Provide the current authentication state to descendant components.
 *
 * The stored session is read once when the provider mounts, allowing a page
 * refresh to preserve an authenticated user.
 *
 * @param {{children: import('react').ReactNode}} props - Provider properties.
 * @returns {JSX.Element} The authentication context provider.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())

  /**
   * Set the authenticated user in React state.
   *
   * @param {Object|null} nextUser - The user to store, or null to clear it.
   * @returns {void}
   */
  function login(nextUser) {
    setUser(nextUser)
  }

  /**
   * Clear the authenticated session from storage and React state.
   *
   * @returns {void}
   */
  function logout() {
    logoutUser()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, setUser }}>{children}</AuthContext.Provider>
}

/**
 * Read the authentication context for the current component.
 *
 * @returns {{user: Object|null, login: Function, logout: Function, setUser: Function}} Auth state and actions.
 * @throws {Error} When used outside an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
