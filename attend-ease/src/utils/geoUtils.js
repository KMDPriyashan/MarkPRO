export const OFFICE_LOCATION = { lat: 6.9271, lng: 79.8612, radius: 200 }

/**
 * Request the browser's current geographic position.
 *
 * @returns {Promise<{lat: number, lng: number, accuracy: number}>} Current coordinates.
 * @throws {Error} When geolocation is unavailable or permission is denied.
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude, accuracy: coords.accuracy }),
      (error) => reject(new Error(error.code === error.PERMISSION_DENIED ? 'Location permission was denied.' : 'Unable to determine your location.')),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  })
}

/**
 * Calculate the great-circle distance between two coordinates.
 *
 * @param {number} lat1 - First latitude.
 * @param {number} lng1 - First longitude.
 * @param {number} lat2 - Second latitude.
 * @param {number} lng2 - Second longitude.
 * @returns {number} Distance in metres.
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const earthRadius = 6371000
  const toRadians = (degrees) => degrees * Math.PI / 180
  const latitudeDifference = toRadians(lat2 - lat1)
  const longitudeDifference = toRadians(lng2 - lng1)
  const haversine = Math.sin(latitudeDifference / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(longitudeDifference / 2) ** 2
  return 2 * earthRadius * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}
