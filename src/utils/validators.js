/**
 * Determine whether a value is a syntactically valid email address.
 *
 * @param {unknown} email - The value to validate.
 * @returns {boolean} True when the value has a valid email shape.
 */
export function validateEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

/**
 * Determine whether a password meets the minimum length requirement.
 *
 * @param {unknown} password - The value to validate.
 * @returns {boolean} True when the password contains at least six characters.
 */
export function validatePassword(password) {
  return typeof password === 'string' && password.length >= 6
}

/**
 * Determine whether a required text value is present.
 *
 * @param {unknown} value - The value to validate.
 * @returns {boolean} True when the value is a non-empty string.
 */
export function validateRequired(value) {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Determine whether a phone value contains a plausible phone number.
 *
 * Allows digits, spaces, parentheses, hyphens, and an optional leading plus sign.
 * At least seven digits must be present.
 *
 * @param {unknown} phone - The value to validate.
 * @returns {boolean} True when the phone value is valid.
 */
export function validatePhone(phone) {
  if (typeof phone !== 'string' || !/^\+?[\d\s()-]+$/.test(phone.trim())) {
    return false
  }

  return phone.replace(/\D/g, '').length >= 7
}

/**
 * Determine whether a username meets the minimum length requirement.
 *
 * @param {unknown} username - The value to validate.
 * @returns {boolean} True when the username contains at least four characters.
 */
export function validateUsername(username) {
  return typeof username === 'string' && username.trim().length >= 4
}
