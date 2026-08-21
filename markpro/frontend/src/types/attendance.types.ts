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
  status: 'PRESENT' | 'LATE';
  photoURL?: string;
  note?: string;
  createdAt: string;
}

export interface CheckInData {
  latitude: number;
  longitude: number;
  photoURL?: string;
  note?: string;
}

export interface CheckOutData {
  latitude: number;
  longitude: number;
  note?: string;
}