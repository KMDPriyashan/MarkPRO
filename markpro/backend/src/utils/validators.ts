import { z } from 'zod';

// User validation schemas
export const userSchema = {
  // Register schema
  register: z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      name: z.string().min(2, 'Name must be at least 2 characters'),
      role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']).optional(),
      department: z.string().optional(),
      phone: z.string().optional(),
    }),
  }),

  // Login schema
  login: z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
    }),
  }),

  // Update user schema
  updateUser: z.object({
    body: z.object({
      name: z.string().min(2).optional(),
      department: z.string().optional(),
      phone: z.string().optional(),
      role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']).optional(),
    }),
  }),
};

// Attendance validation schemas
export const attendanceSchema = {
  // Check-in schema
  checkIn: z.object({
    body: z.object({
      latitude: z.number().min(-90).max(90, 'Invalid latitude'),
      longitude: z.number().min(-180).max(180, 'Invalid longitude'),
      photoURL: z.string().url('Invalid photo URL').optional(),
      note: z.string().optional(),
    }),
  }),

  // Check-out schema
  checkOut: z.object({
    body: z.object({
      latitude: z.number().min(-90).max(90, 'Invalid latitude'),
      longitude: z.number().min(-180).max(180, 'Invalid longitude'),
      note: z.string().optional(),
    }),
  }),
};

// Leave validation schemas
export const leaveSchema = {
  // Create leave request
  create: z.object({
    body: z.object({
      type: z.enum(['ANNUAL', 'SICK', 'CASUAL', 'UNPAID']),
      startDate: z.string().datetime('Invalid start date'),
      endDate: z.string().datetime('Invalid end date'),
      reason: z.string().min(10, 'Reason must be at least 10 characters'),
    }),
  }),

  // Approve leave
  approve: z.object({
    body: z.object({
      status: z.enum(['APPROVED', 'REJECTED']),
      reason: z.string().optional(),
    }),
  }),
};

// Admin validation schemas
export const adminSchema = {
  // Update user role
  updateRole: z.object({
    body: z.object({
      uid: z.string().min(1, 'User ID is required'),
      role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']),
    }),
  }),
};

// Validate data with schema
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors.map((e) => e.message).join(', '));
    }
    throw error;
  }
};