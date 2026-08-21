export interface User {
  uid: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  department?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  faceData?: string;
  deviceFingerprint?: string;
  fcmToken?: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  department?: string;
  phone?: string;
}