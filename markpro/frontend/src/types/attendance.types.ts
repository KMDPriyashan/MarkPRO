export interface Attendance {
  id: string;
  userId: string;
  userName: string;
  type: 'CHECK_IN' | 'CHECK_OUT';
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  latitude?: number;
  longitude?: number;
  checkOutLatitude?: number;
  checkOutLongitude?: number;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'HOLIDAY' | 'LEAVE';
  deviceFingerprint?: string;
  faceMatch?: boolean;
  photoURL?: string;
  ipAddress?: string;
  overtime?: number;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CheckInData {
  latitude: number;
  longitude: number;
  photoURL?: string;
  note?: string;
  deviceFingerprint?: string;
}

export interface CheckOutData {
  latitude: number;
  longitude: number;
  note?: string;
  deviceFingerprint?: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  type: 'ANNUAL' | 'SICK' | 'CASUAL' | 'UNPAID' | 'MATERNITY' | 'PATERNITY';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  approvedBy?: string;
  approvedAt?: string;
  files?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateLeaveData {
  type: 'ANNUAL' | 'SICK' | 'CASUAL' | 'UNPAID';
  startDate: string;
  endDate: string;
  reason: string;
  files?: string[];
}