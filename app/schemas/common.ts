import { z } from 'zod';

/**
 * Common reusable schema fragments for validation
 */

// File validation schemas
export const imageFileSchema = z.instanceof(File)
  .refine((file) => file.size <= 2097152, 'File size must be less than 2MB')
  .refine((file) => file.type.startsWith('image/'), 'Please select a valid image file');

export const documentFileSchema = z.instanceof(File)
  .refine((file) => file.size <= 5242880, 'File size must be less than 5MB') // 5MB
  .refine((file) => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type),
    'Please select a valid document file (PDF, DOC, DOCX)');

export const videoFileSchema = z.instanceof(File)
  .refine((file) => file.size <= 104857600, 'Video file size must be less than 100MB') // 100MB
  .refine((file) => file.type.startsWith('video/'), 'Please select a valid video file');

// Common field schemas
export const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const passwordSchema = z.string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');

export const strongPasswordSchema = passwordSchema
  .regex(/(?=.*[!@#$%^&*])/, 'Password must contain at least one special character (!@#$%^&*)');

export const phoneSchema = z.string()
  .min(1, 'Phone number is required')
  .regex(/^[\+]?[0-9\-\(\)\s]+$/, 'Please enter a valid phone number');

export const urlSchema = z.string()
  .min(1, 'URL is required')
  .url('Please enter a valid URL');

// Text content schemas
export const titleSchema = z.string()
  .min(1, 'Title is required')
  .max(100, 'Title must be less than 100 characters');

export const shortDescriptionSchema = z.string()
  .min(1, 'Description is required')
  .max(200, 'Description must be less than 200 characters');

export const longDescriptionSchema = z.string()
  .min(1, 'Description is required')
  .max(1000, 'Description must be less than 1000 characters');

export const slugSchema = z.string()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and hyphens');

// ID schemas
export const idSchema = z.number()
  .int('ID must be an integer')
  .positive('ID must be positive');

export const optionalIdSchema = z.number()
  .int('ID must be an integer')
  .positive('ID must be positive')
  .optional();

// Date schemas
export const dateStringSchema = z.string()
  .min(1, 'Date is required')
  .datetime('Please enter a valid date');

export const futureDateSchema = z.string()
  .min(1, 'Date is required')
  .datetime('Please enter a valid date')
  .refine((date) => new Date(date) > new Date(), 'Date must be in the future');

// Pagination schemas
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

// Status schemas
export const statusSchema = z.enum(['active', 'inactive']);

export const courseStatusSchema = z.enum(['draft', 'published', 'archived']);

export const lessonStatusSchema = z.enum(['draft', 'published']);

// Content type schemas
export const contentTypeSchema = z.enum(['VIDEO', 'ARTICLE']);

// Common form field helpers
export const requiredString = (fieldName: string) => z.string()
  .min(1, `${fieldName} is required`);

export const optionalString = z.string().optional();

export const requiredNumber = (fieldName: string) => z.number({
  message: `${fieldName} is required and must be a number`
});

export const optionalNumber = z.number().optional();

// File size helpers
export const createFileSizeValidator = (maxSizeInMB: number) =>
  (file: File) => file.size <= maxSizeInMB * 1024 * 1024;

export const createFileTypeValidator = (allowedTypes: string[]) =>
  (file: File) => allowedTypes.some(type => file.type.startsWith(type));

// Conditional schema builders
export const createImageSchema = (required: boolean = true, maxSizeInMB: number = 2) => {
  const baseSchema = z.instanceof(File)
    .refine(createFileSizeValidator(maxSizeInMB), `File size must be less than ${maxSizeInMB}MB`)
    .refine(createFileTypeValidator(['image/']), 'Please select a valid image file');

  return required ? baseSchema : baseSchema.optional();
};

// API Response wrapper schemas
export const successResponseSchema = <T>(dataSchema: z.ZodSchema<T>) => z.object({
  message: z.string(),
  data: dataSchema,
});

export const errorResponseSchema = z.object({
  message: z.string(),
  errors: z.record(z.string(), z.string()).optional(),
});

export const paginatedResponseSchema = <T>(itemSchema: z.ZodSchema<T>) => z.object({
  message: z.string(),
  data: z.object({
    items: z.array(itemSchema),
    meta: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      total_pages: z.number(),
      has_next: z.boolean(),
      has_prev: z.boolean(),
    }),
  }),
});