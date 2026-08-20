// Calculate distance between two coordinates
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Check if coordinates are inside geo-fence
export const isInsideGeoFence = (
  latitude: number,
  longitude: number,
  fenceLat: number = parseFloat(process.env.GEO_FENCE_LAT || '7.8731'),
  fenceLng: number = parseFloat(process.env.GEO_FENCE_LNG || '80.7718'),
  radius: number = parseFloat(process.env.GEO_FENCE_RADIUS || '100')
): boolean => {
  const distance = calculateDistance(latitude, longitude, fenceLat, fenceLng);
  return distance <= radius;
};

// Determine attendance status based on check-in time
export const determineStatus = (checkInTime: Date): 'PRESENT' | 'LATE' => {
  const hour = checkInTime.getHours();
  const minute = checkInTime.getMinutes();

  // 9:00 AM is start time (configurable)
  if (hour > 9 || (hour === 9 && minute > 0)) {
    return 'LATE';
  }
  return 'PRESENT';
};

// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Generate random string
export const generateRandomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password
export const isValidPassword = (password: string): boolean => {
  // At least 6 characters
  return password.length >= 6;
};

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

// Truncate text
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get time difference in minutes
export const getTimeDifferenceInMinutes = (start: Date, end: Date): number => {
  return (end.getTime() - start.getTime()) / (1000 * 60);
};

// Get time difference in hours
export const getTimeDifferenceInHours = (start: Date, end: Date): number => {
  return getTimeDifferenceInMinutes(start, end) / 60;
};

// Calculate overtime
export const calculateOvertime = (checkInTime: Date, checkOutTime: Date): number => {
  const hoursWorked = getTimeDifferenceInHours(checkInTime, checkOutTime);
  const standardHours = 8;
  return hoursWorked > standardHours ? hoursWorked - standardHours : 0;
};

// Get current time in Sri Lanka (UTC+5:30)
export const getSLTime = (): Date => {
  const now = new Date();
  const offset = 5.5 * 60 * 60 * 1000;
  return new Date(now.getTime() + offset);
};

// Check if user is admin
export const isAdmin = (role: string): boolean => {
  return ['SUPER_ADMIN', 'ADMIN'].includes(role);
};

// Check if user is manager
export const isManager = (role: string): boolean => {
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(role);
};