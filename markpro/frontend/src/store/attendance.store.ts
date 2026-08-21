import { create } from 'zustand';
import { Attendance } from '../types/attendance.types';

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
  clearError: () => void;
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
      todayAttendance: attendance.type === 'CHECK_IN' ? attendance : state.todayAttendance,
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));