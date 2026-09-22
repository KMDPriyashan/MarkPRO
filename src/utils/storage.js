/**
 * Read and deserialize a value from localStorage.
 *
 * @template T
 * @param {string} key - The localStorage key to read.
 * @param {T|null} [fallback=null] - Value returned when the key is missing or invalid.
 * @returns {T|null} The parsed value, or the fallback value on failure.
 */
export function getItem(key, fallback = null) {
  try {
    const value = window.localStorage.getItem(key)
    return value === null ? fallback : JSON.parse(value)
  } catch {
    return fallback
  }
}

/**
 * Serialize and store a value in localStorage.
 *
 * @param {string} key - The localStorage key to write.
 * @param {unknown} value - The value to serialize.
 * @returns {boolean} Whether the value was stored successfully.
 */
export function setItem(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/**
 * Remove one value from localStorage.
 *
 * @param {string} key - The localStorage key to remove.
 * @returns {boolean} Whether the key was removed successfully.
 */
export function removeItem(key) {
  try {
    window.localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

/**
 * Remove every value from localStorage.
 *
 * @returns {boolean} Whether localStorage was cleared successfully.
 */
export function clearAll() {
  try {
    window.localStorage.clear()
    return true
  } catch {
    return false
  }
}
