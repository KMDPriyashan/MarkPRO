import { create } from 'zustand';

interface Attendance {
  id: string;
  userId: string;
  userName: string;
  type: 'CHECK_IN' | 'CHECK_OUT';
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'PRESENT' | 'LATE';
}

interface AttendanceState {
  todayAttendance: Attendance | null;
  history: Attendance[];
  isLoading: boolean;
  error: string | null;

  setTodayAttendance: (attendance: Attendance | null) => void;
  setHistory: (history: Attendance[]) => void;
  addAttendance: (attendance: Attendance) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  todayAttendance: null,
  history: [],
  isLoading: false,
  error: null,

  setTodayAttendance: (todayAttendance) => set({ todayAttendance }),

  setHistory: (history) => set({ history }),

  addAttendance: (attendance) =>
    set((state) => ({
      history: [attendance, ...state.history],
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));