import { z } from 'zod';

// Step 1: Course Information
export const courseInfoSchema = z.object({
  name: z.string().min(3, 'Course name must be at least 3 characters').max(100, 'Course name must be less than 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(500, 'Description must be less than 500 characters'),
  subject: z.string().min(1, 'Please select a subject'),
});

export type CourseInfoData = z.infer<typeof courseInfoSchema>;

// Step 2: Course Details
export const courseDetailsSchema = z.object({
  keyPoint1: z.string().min(5, 'Key Point 1 must be at least 5 characters'),
  keyPoint2: z.string().min(5, 'Key Point 2 must be at least 5 characters').optional().or(z.literal('')),
  keyPoint3: z.string().min(5, 'Key Point 3 must be at least 5 characters').optional().or(z.literal('')),
  keyPoint4: z.string().min(5, 'Key Point 4 must be at least 5 characters').optional().or(z.literal('')),
  targetAudience1: z.string().min(5, 'Target Audience 1 must be at least 5 characters'),
  targetAudience2: z.string().min(5, 'Target Audience 2 must be at least 5 characters').optional().or(z.literal('')),
  targetAudience3: z.string().min(5, 'Target Audience 3 must be at least 5 characters').optional().or(z.literal('')),
  targetAudience4: z.string().min(5, 'Target Audience 4 must be at least 5 characters').optional().or(z.literal('')),
  tools: z.string().min(3, 'Please enter at least one tool or technology'),
  level: z.string().min(1, 'Please select a level').optional().or(z.literal('')),
  duration: z.string().min(1, 'Please enter course duration').optional().or(z.literal('')),
  requirements: z.array(z.string()).optional(),
});

// Step 3: Course Price
export const coursePriceSchema = z.object({
  price: z.number().min(0, 'Price must be a positive number').max(999999999, 'Price is too high'),
  availability: z.enum(['published', 'draft']),
});