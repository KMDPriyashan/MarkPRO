import { getItem, removeItem, setItem } from '../utils/storage'
import { validateEmail, validatePassword, validateRequired, validateUsername } from '../utils/validators'
import { logAction } from '../utils/auditLogger'

const USERS_KEY = 'attendEaseUsers'
const CURRENT_USER_KEY = 'attendEaseCurrentUser'

/**
 * Return all registered AttendEase users.
 *
 * Invalid or missing stored data is treated as an empty user list.
 *
 * @returns {Array<Object>} The registered users.
 */
export function getAllUsers() {
  const users = getItem(USERS_KEY, [])
  return Array.isArray(users) ? users : []
}

/**
 * Persist a user by adding it to the registered user list.
 *
 * @param {Object} user - The user record to persist.
 * @returns {Object} The saved user record.
 */
export function saveUser(user) {
  const users = getAllUsers()
  users.push(user)
  setItem(USERS_KEY, users)
  return user
}

/**
 * Find a user by username without regard to letter case.
 *
 * @param {string} username - The username to search for.
 * @returns {Object|undefined} The matching user, when found.
 */
export function findUserByUsername(username) {
  if (typeof username !== 'string') {
    return undefined
  }

  const normalizedUsername = username.trim().toLowerCase()
  return getAllUsers().find((user) => user.username?.toLowerCase() === normalizedUsername)
}

/**
 * Remove the password hash before exposing a user as the active session.
 *
 * @param {Object} user - A stored user record.
 * @returns {Object} A safe user record for the current session.
 */
function sanitizeUser(user) {
  const safeUser = { ...user }
  delete safeUser.passwordHash
  delete safeUser.password
  return safeUser
}

/**
 * Create a new user account.
 *
 * The first registered account receives the admin role. Later accounts receive
 * the employee role. Passwords are encoded with btoa before persistence.
 * Username and email uniqueness checks are case-insensitive.
 *
 * @param {Object} userData - Account details, including username, email, and password.
 * @returns {{success: boolean, user?: Object, message: string}} Signup result.
 */
export function signup(userData) {
  const { username, email, password, ...profile } = userData ?? {}
  const users = getAllUsers()

  if (!validateUsername(username)) {
    return { success: false, message: 'Username must be at least 4 characters.' }
  }
  if (!validateEmail(email)) {
    return { success: false, message: 'Please enter a valid email address.' }
  }
  if (!validatePassword(password)) {
    return { success: false, message: 'Password must be at least 6 characters.' }
  }
  if (users.some((user) => user.username?.toLowerCase() === username.trim().toLowerCase())) {
    return { success: false, message: 'That username is already in use.' }
  }
  if (users.some((user) => user.email?.toLowerCase() === email.trim().toLowerCase())) {
    return { success: false, message: 'That email is already in use.' }
  }

  const user = {
    ...profile,
    username: username.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: btoa(password),
    role: users.length === 0 ? 'admin' : ['employee', 'manager', 'admin'].includes(profile.role) ? profile.role : 'employee',
    createdAt: new Date().toISOString(),
  }

  saveUser(user)
  logAction(null, 'signup', { username: user.username, email: user.email, role: user.role })
  return { success: true, user: sanitizeUser(user), message: 'Account created successfully.' }
}

/**
 * Authenticate a user with a username and password.
 *
 * When no accounts exist, callers can use redirectToSignup to send the user
 * directly to registration. Successful authentication stores the safe user
 * record in currentUser.
 *
 * @param {string} username - The account username.
 * @param {string} password - The plain-text password to verify.
 * @returns {{success: boolean, redirectToSignup?: boolean, user?: Object, message: string}} Login result.
 */
export function login(username, password) {
  const users = getAllUsers()
  if (users.length === 0) {
    return { success: false, redirectToSignup: true, message: 'No users found. Please sign up first.' }
  }

  if (!validateRequired(username) || !validatePassword(password)) {
    return { success: false, message: 'Invalid username or password.' }
  }

  const user = findUserByUsername(username)
  if (!user || (user.passwordHash ?? user.password) !== btoa(password)) {
    return { success: false, message: 'Invalid username or password.' }
  }

  const safeUser = sanitizeUser(user)
  setItem(CURRENT_USER_KEY, safeUser)
  logAction(safeUser, 'login', 'User signed in successfully')
  return { success: true, user: safeUser, message: 'Login successful.' }
}

/**
 * End the active session by removing the current user.
 *
 * @returns {boolean} Whether the current user was removed successfully.
 */
export function logout() {
  return removeItem(CURRENT_USER_KEY)
}

/**
 * Read the currently authenticated user.
 *
 * @returns {Object|null} The active user, or null when nobody is authenticated.
 */
export function getCurrentUser() {
  return getItem(CURRENT_USER_KEY, null)
}

/**
 * Check whether an authenticated user is stored for the current session.
 *
 * @returns {boolean} True when a current user exists.
 */
export function isAuthenticated() {
  return getCurrentUser() !== null
}
