import { getItem, setItem } from '../utils/storage'

const MENU_KEY = 'foodCourtMenu'
const ORDERS_KEY = 'foodCourtOrders'
const defaultMenu = [
  { id: 'rice', name: 'Chicken rice bowl', category: 'Meals', price: 850, available: true },
  { id: 'kottu', name: 'Vegetable kottu', category: 'Meals', price: 700, available: true },
  { id: 'tea', name: 'Ceylon tea', category: 'Drinks', price: 220, available: true },
  { id: 'juice', name: 'Fresh fruit juice', category: 'Drinks', price: 450, available: true },
]

/** Return the QR food court menu. */
export function getMenu() { return getItem(MENU_KEY, defaultMenu) }
/** Create a food order and persist it. */
export function createFoodOrder(user, items) { const order = { id: `order-${Date.now()}`, userId: user?.id || user?.username, customer: user?.fullName || user?.username, items, total: items.reduce((sum, item) => sum + item.price * item.quantity, 0), status: 'received', createdAt: new Date().toISOString() }; const orders = getItem(ORDERS_KEY, []); setItem(ORDERS_KEY, [order, ...orders]); return order }
/** Return food orders for a user or all orders for administrators. */
export function getFoodOrders(user) { const orders = getItem(ORDERS_KEY, []); return user?.role === 'admin' ? orders : orders.filter((order) => order.userId === (user?.id || user?.username)) }
/** Update a food order status. */
export function updateFoodOrderStatus(orderId, status) { const orders = getItem(ORDERS_KEY, []); const updated = orders.map((order) => order.id === orderId ? { ...order, status } : order); setItem(ORDERS_KEY, updated); return updated.find((order) => order.id === orderId) }
