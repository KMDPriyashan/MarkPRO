import { getItem, setItem } from '../utils/storage'

const MENU_KEY = 'foodCourtMenu'
const ORDERS_KEY = 'foodCourtOrders'

const defaultMenu = [
  { id: 'rice', name: 'Chicken rice bowl', category: 'Breakfast', mealPeriods: ['breakfast', 'lunch'], price: 850, available: true, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=640&q=80' },
  { id: 'kottu', name: 'Vegetable kottu', category: 'Lunch', mealPeriods: ['lunch'], price: 700, available: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=640&q=80' },
  { id: 'string-hoppers', name: 'String hoppers & curry', category: 'Breakfast', mealPeriods: ['breakfast', 'lunch'], price: 650, available: true, image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=640&q=80' },
  { id: 'egg-roti', name: 'Egg roti set', category: 'Breakfast', mealPeriods: ['breakfast'], price: 480, available: true, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=640&q=80' },
  { id: 'dhal-paratha', name: 'Dhal paratha', category: 'Breakfast', mealPeriods: ['breakfast'], price: 420, available: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=640&q=80' },
  { id: 'fish-rice', name: 'Sri Lankan fish rice', category: 'Lunch', mealPeriods: ['lunch'], price: 950, available: true, image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=640&q=80' },
  { id: 'chicken-curry', name: 'Chicken curry meal', category: 'Lunch', mealPeriods: ['lunch'], price: 900, available: true, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=640&q=80' },
  { id: 'veggie-rice', name: 'Vegetarian rice plate', category: 'Lunch', mealPeriods: ['lunch'], price: 620, available: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=640&q=80' },
  { id: 'tea', name: 'Ceylon tea', category: 'Short break', mealPeriods: ['short-break'], price: 220, available: true, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=640&q=80' },
  { id: 'juice', name: 'Fresh fruit juice', category: 'Short break', mealPeriods: ['short-break'], price: 450, available: true, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=640&q=80' },
  { id: 'sandwich', name: 'Grilled chicken sandwich', category: 'Short break', mealPeriods: ['short-break', 'lunch'], price: 580, available: true, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=640&q=80' },
  { id: 'samosa', name: 'Vegetable samosa', category: 'Short break', mealPeriods: ['short-break'], price: 180, available: true, image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=640&q=80' },
  { id: 'cutlet', name: 'Fish cutlet', category: 'Short break', mealPeriods: ['short-break'], price: 220, available: true, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=640&q=80' },
]

/** Return the canteen menu. */
export function getMenu() { return getItem(MENU_KEY, defaultMenu) }

/** Create a scheduled canteen preorder. */
export function createFoodOrder(user, items, checkout = {}) {
  const employeeId = checkout.employeeId || user?.employeeId || user?.id || user?.username
  const order = { id: `order-${Date.now()}`, userId: user?.id || user?.username, employeeId, customer: user?.fullName || user?.username, items, total: items.reduce((sum, item) => sum + item.price * item.quantity, 0), mealPeriod: checkout.mealPeriod || 'lunch', pickupTime: checkout.pickupTime, pickupMethod: checkout.pickupMethod || 'qr', confirmationCode: `AE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, status: 'received', createdAt: new Date().toISOString() }
  const orders = getItem(ORDERS_KEY, [])
  setItem(ORDERS_KEY, [order, ...(Array.isArray(orders) ? orders : [])])
  return order
}

/** Return orders for the current user or all orders for admins/canteen staff. */
export function getFoodOrders(user) { const orders = getItem(ORDERS_KEY, []); if (user?.role === 'admin' || user?.role === 'manager') return Array.isArray(orders) ? orders : []; return Array.isArray(orders) ? orders.filter((order) => order.userId === (user?.id || user?.username)) : [] }

/** Update a canteen order through its kitchen lifecycle. */
export function updateFoodOrderStatus(orderId, status) { const orders = getItem(ORDERS_KEY, []); const updated = (Array.isArray(orders) ? orders : []).map((order) => order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order); setItem(ORDERS_KEY, updated); return updated.find((order) => order.id === orderId) }
