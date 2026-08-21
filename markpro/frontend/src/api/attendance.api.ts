import { apiClient } from './axios.config';
import { Attendance, CheckInData, CheckOutData } from '../types/attendance.types';
import { ApiResponse, PaginatedResponse } from '../types/api.types';

export const attendanceApi = {
  // Check-in
  checkIn: async (data: CheckInData): Promise<ApiResponse<Attendance>> => {
    try {
      const response = await apiClient.post('/attendance/check-in', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Check-in failed',
      };
    }
  },

  // Check-out
  checkOut: async (data: CheckOutData): Promise<ApiResponse<Attendance>> => {
    try {
      const response = await apiClient.post('/attendance/check-out', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Check-out failed',
      };
    }
  },

  // Get today's attendance
  getTodayAttendance: async (): Promise<ApiResponse<Attendance | null>> => {
    try {
      const response = await apiClient.get('/attendance/today');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get today\'s attendance',
      };
    }
  },

  // Get attendance history
  getHistory: async (
    page: number = 1,
    limit: number = 10,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<PaginatedResponse<Attendance>>> => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await apiClient.get(`/attendance/history?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get attendance history',
      };
    }
  },

  // Get attendance statistics
  getStats: async (month?: string): Promise<ApiResponse<any>> => {
    try {
      const params = new URLSearchParams();
      if (month) params.append('month', month);

      const response = await apiClient.get(`/attendance/stats?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get statistics',
      };
    }
  },

  // Get monthly report
  getMonthlyReport: async (year: number, month: number): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.get(`/attendance/report/${year}/${month}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get monthly report',
      };
    }
  },

  // Request leave
  requestLeave: async (data: {
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/attendance/leave', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to request leave',
      };
    }
  },

  // Get leave requests
  getLeaveRequests: async (): Promise<ApiResponse<any[]>> => {
    try {
      const response = await apiClient.get('/attendance/leave');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get leave requests',
      };
    }
  },

  // Approve leave (Admin/Manager)
  approveLeave: async (
    leaveId: string,
    status: 'APPROVED' | 'REJECTED',
    reason?: string
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.put(`/attendance/leave/${leaveId}`, {
        status,
        reason,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to process leave request',
      };
    }
  },
};