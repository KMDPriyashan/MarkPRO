import { getItem, setItem } from '../utils/storage'
const REQUESTS_KEY = 'facilityRequests'
const categories = ['IT support', 'Maintenance', 'Cleaning', 'Security', 'Event setup']
/** Return facilities service categories. */
export function getFacilityCategories() { return categories }
/** Submit a facilities or functional handling request. */
export function createFacilityRequest(user, requestData) { const request = { id: `facility-${Date.now()}`, userId: user?.id || user?.username, requester: user?.fullName || user?.username, status: 'open', createdAt: new Date().toISOString(), ...requestData }; const requests = getItem(REQUESTS_KEY, []); setItem(REQUESTS_KEY, [request, ...requests]); return request }
/** Return facility requests for a user or all requests for admins. */
export function getFacilityRequests(user) { const requests = getItem(REQUESTS_KEY, []); return user?.role === 'admin' ? requests : requests.filter((request) => request.userId === (user?.id || user?.username)) }
/** Update a facilities request. */
export function updateFacilityStatus(id, status) { const requests = getItem(REQUESTS_KEY, []); const updated = requests.map((request) => request.id === id ? { ...request, status } : request); setItem(REQUESTS_KEY, updated); return updated.find((request) => request.id === id) }
