import { z } from 'zod';
import { successResponseSchema, paginatedResponseSchema } from './common';

// User schema
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['manager', 'mentor', 'student']),
  avatar: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Topic schema
export const topicSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  subjects_count: z.number().optional(),
  courses_count: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Subject schema
export const subjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  topic_id: z.number(),
  topic: topicSchema.optional(),
  courses_count: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Course schema
export const courseSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  price: z.number(),
  discount_percentage: z.number().nullable().optional(),
  final_price: z.number().optional(),
  image_url: z.string().nullable().optional(),
  preview_image_url: z.string().nullable().optional(),
  sample_image_url: z.string().nullable().optional(),
  certificate_image_url: z.string().nullable().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  is_published: z.boolean(),
  is_most_joined: z.boolean().optional(),
  subject_id: z.number(),
  subject: subjectSchema.optional(),
  mentor_id: z.number(),
  mentor: userSchema.optional(),
  sections_count: z.number().optional(),
  lessons_count: z.number().optional(),
  students_count: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Section schema
export const sectionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  course_id: z.number(),
  course: courseSchema.optional(),
  lessons_count: z.number().optional(),
  order: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Lesson schema
export const lessonSchema = z.object({
  id: z.number(),
  title: z.string(),
  content_type: z.enum(['VIDEO', 'ARTICLE']),
  content_url: z.string().nullable().optional(),
  content_text: z.string().nullable().optional(),
  content_duration: z.number().nullable().optional(),
  section_id: z.number(),
  section: sectionSchema.optional(),
  order: z.number().optional(),
  is_published: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Transaction schema
export const transactionSchema = z.object({
  id: z.number(),
  amount: z.number(),
  type: z.enum(['course_purchase', 'withdrawal', 'commission']),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled']),
  description: z.string().nullable().optional(),
  course_id: z.number().nullable().optional(),
  course: courseSchema.optional(),
  user_id: z.number(),
  user: userSchema.optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Withdrawal schema
export const withdrawalSchema = z.object({
  id: z.number(),
  amount: z.number(),
  status: z.enum(['pending', 'approved', 'rejected', 'completed']),
  bank_name: z.string(),
  bank_account_number: z.string(),
  account_holder_name: z.string(),
  notes: z.string().nullable().optional(),
  admin_notes: z.string().nullable().optional(),
  mentor_id: z.number(),
  mentor: userSchema.optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Dashboard stats schema
export const dashboardStatsSchema = z.object({
  total_users: z.number(),
  total_courses: z.number(),
  total_revenue: z.number(),
  total_transactions: z.number(),
  recent_users: z.array(userSchema),
  recent_courses: z.array(courseSchema),
  recent_transactions: z.array(transactionSchema),
});

// API Response schemas
export const loginResponseSchema = successResponseSchema(z.object({
  access_token: z.string(),
  user: userSchema,
}));

export const userResponseSchema = successResponseSchema(userSchema);
export const usersResponseSchema = paginatedResponseSchema(userSchema);

export const topicResponseSchema = successResponseSchema(topicSchema);
export const topicsResponseSchema = paginatedResponseSchema(topicSchema);

export const subjectResponseSchema = successResponseSchema(subjectSchema);
export const subjectsResponseSchema = paginatedResponseSchema(subjectSchema);

export const courseResponseSchema = successResponseSchema(courseSchema);
export const coursesResponseSchema = paginatedResponseSchema(courseSchema);

export const sectionResponseSchema = successResponseSchema(sectionSchema);
export const sectionsResponseSchema = paginatedResponseSchema(sectionSchema);

export const lessonResponseSchema = successResponseSchema(lessonSchema);
export const lessonsResponseSchema = paginatedResponseSchema(lessonSchema);

export const transactionResponseSchema = successResponseSchema(transactionSchema);
export const transactionsResponseSchema = paginatedResponseSchema(transactionSchema);

export const withdrawalResponseSchema = successResponseSchema(withdrawalSchema);
export const withdrawalsResponseSchema = paginatedResponseSchema(withdrawalSchema);

export const dashboardStatsResponseSchema = successResponseSchema(dashboardStatsSchema);

// Balance response schema
export const balanceResponseSchema = successResponseSchema(z.object({
  balance: z.number(),
  pending_withdrawals: z.number(),
  available_balance: z.number(),
}));

// Generic success response
export const genericSuccessResponseSchema = successResponseSchema(z.object({
  success: z.boolean().default(true),
}));