import { z } from "zod";
import { titleSchema, contentTypeSchema, requiredNumber, urlSchema, longDescriptionSchema } from "./common";

// Base lesson fields
const baseLessonFields = {
  title: titleSchema,
  section_id: requiredNumber("Section"),
  duration_minutes: z
    .number()
    .min(1, "Duration must be at least 1 minute")
    .max(999, "Duration cannot exceed 999 minutes"),
  order_index: z
    .number()
    .min(1, "Order index must be at least 1"),
};

// Discriminated union for lesson content
const videoLessonSchema = z.object({
  ...baseLessonFields,
  content_type: z.literal("VIDEO"),
  content_url: urlSchema,
  content_text: z.string().optional(),
});

const articleLessonSchema = z.object({
  ...baseLessonFields,
  content_type: z.literal("ARTICLE"),
  content_text: longDescriptionSchema,
  content_url: z.string().optional(),
});

// Create Lesson Schema using discriminated union
export const createLessonSchema = z.discriminatedUnion('content_type', [
  videoLessonSchema,
  articleLessonSchema,
]);

// Update Lesson Schema
export const updateLessonSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters")
    .optional(),
  content_type: contentTypeSchema.optional(),
  duration_minutes: z
    .number()
    .min(1, "Duration must be at least 1 minute")
    .max(999, "Duration cannot exceed 999 minutes")
    .optional(),
  order_index: z
    .number()
    .min(1, "Order index must be at least 1")
    .optional(),
  content_url: z.string().optional(),
  content_text: z.string().optional(),
  is_active: z.boolean().optional(),
}).refine((data) => {
  // If content_type is provided, validate content accordingly
  if (data.content_type === "VIDEO" && data.content_url !== undefined) {
    return !!data.content_url && data.content_url.trim() !== "";
  }
  if (data.content_type === "ARTICLE" && data.content_text !== undefined) {
    return !!data.content_text && data.content_text.trim() !== "";
  }
  return true;
}, {
  message: "Content is required based on lesson type",
  path: ["content_url", "content_text"],
});

// Lesson Filter Schema
export const lessonFilterSchema = z.object({
  search: z.string().optional(),
  section_id: z.number().optional(),
  course_id: z.number().optional(),
  content_type: contentTypeSchema.optional(),
  is_active: z.boolean().optional(),
  sort_by: z.enum(["title", "order_index", "duration_minutes", "created_at"]).optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Lesson Progress Schema
export const lessonProgressSchema = z.object({
  lesson_id: z.number().min(1, "Lesson ID is required"),
  progress_percentage: z
    .number()
    .min(0, "Progress cannot be negative")
    .max(100, "Progress cannot exceed 100%"),
  time_spent_minutes: z
    .number()
    .min(0, "Time spent cannot be negative")
    .optional(),
  is_completed: z.boolean().optional(),
});

// Lesson Note Schema
export const lessonNoteSchema = z.object({
  lesson_id: z.number().min(1, "Lesson ID is required"),
  note: z
    .string()
    .min(1, "Note is required")
    .min(10, "Note must be at least 10 characters")
    .max(1000, "Note must not exceed 1000 characters"),
  timestamp_seconds: z
    .number()
    .min(0, "Timestamp cannot be negative")
    .optional(),
});

// Video URL Validation Schema (for YouTube URLs)
export const videoUrlSchema = z
  .string()
  .min(1, "Video URL is required")
  .refine((url) => {
    // Accept direct YouTube ID (11 characters) or full YouTube URLs
    const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/;
    const youtubeUrlRegex = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[a-zA-Z0-9_-]{11}/;

    return youtubeIdRegex.test(url) || youtubeUrlRegex.test(url);
  }, {
    message: "Please enter a valid YouTube video ID or URL",
  });

// Type exports
export type CreateLessonFormData = z.infer<typeof createLessonSchema>;
export type UpdateLessonFormData = z.infer<typeof updateLessonSchema>;
export type LessonFilterData = z.infer<typeof lessonFilterSchema>;
export type LessonProgressData = z.infer<typeof lessonProgressSchema>;
export type LessonNoteData = z.infer<typeof lessonNoteSchema>;
export type LessonContentType = z.infer<typeof contentTypeSchema>;