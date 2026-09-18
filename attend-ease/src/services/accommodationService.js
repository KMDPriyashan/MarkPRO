import { getItem, setItem } from '../utils/storage'
const REQUESTS_KEY = 'accommodationRequests'
const rooms = [{ id: 'room-a', name: 'Guest House A', type: 'Single room', capacity: 1, nightlyRate: 4500, available: true }, { id: 'room-b', name: 'Guest House B', type: 'Shared room', capacity: 4, nightlyRate: 2800, available: true }, { id: 'room-c', name: 'Family suite', type: 'Suite', capacity: 3, nightlyRate: 7000, available: true }]
/** Return accommodation options. */
export function getRooms() { return rooms }
/** Create an accommodation request. */
export function requestAccommodation(user, requestData) { const request = { id: `stay-${Date.now()}`, userId: user?.id || user?.username, guest: user?.fullName || user?.username, status: 'pending', createdAt: new Date().toISOString(), ...requestData }; const requests = getItem(REQUESTS_KEY, []); setItem(REQUESTS_KEY, [request, ...requests]); return request }
/** Return accommodation requests for a user or all requests for admins. */
export function getAccommodationRequests(user) { const requests = getItem(REQUESTS_KEY, []); return user?.role === 'admin' ? requests : requests.filter((request) => request.userId === (user?.id || user?.username)) }
/** Update an accommodation request status. */
export function updateAccommodationStatus(id, status) { const requests = getItem(REQUESTS_KEY, []); const updated = requests.map((request) => request.id === id ? { ...request, status } : request); setItem(REQUESTS_KEY, updated); return updated.find((request) => request.id === id) }
