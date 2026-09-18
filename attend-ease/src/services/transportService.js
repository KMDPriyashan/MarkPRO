import { getItem, setItem } from '../utils/storage'
const ROUTES_KEY = 'transportRoutes'
const REQUESTS_KEY = 'transportRequests'
const routes = [{ id: 'route-colombo', name: 'Colombo Central', time: '07:30', seats: 18, driver: 'Saman Perera' }, { id: 'route-dehiwala', name: 'Dehiwala - Mount Lavinia', time: '07:45', seats: 12, driver: 'Ruwan Silva' }, { id: 'route-kaduwela', name: 'Kaduwela Express', time: '07:15', seats: 20, driver: 'Nuwan Fernando' }]
/** Return available transport routes. */
export function getRoutes() { return getItem(ROUTES_KEY, routes) }
/** Reserve a seat on a route. */
export function bookTransport(user, routeId, date) { const request = { id: `transport-${Date.now()}`, routeId, date, userId: user?.id || user?.username, passenger: user?.fullName || user?.username, status: 'requested' }; const requests = getItem(REQUESTS_KEY, []); setItem(REQUESTS_KEY, [request, ...requests]); return request }
/** Return transport reservations for a user or all reservations for admins. */
export function getTransportBookings(user) { const requests = getItem(REQUESTS_KEY, []); return user?.role === 'admin' ? requests : requests.filter((request) => request.userId === (user?.id || user?.username)) }
