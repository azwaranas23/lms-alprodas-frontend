import { z } from "zod";

// Create Section Schema - only form fields
export const createSectionSchema = z.object({
  title: z
    .string()
    .min(1, "Section title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  order_index: z
    .number()
    .min(1, "Order must be at least 1")
    .max(999, "Order cannot exceed 999"),
  course_id: z
    .number()
    .min(1, "Course is required"),
});

// Update Section Schema - only editable form fields
export const updateSectionSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  order_index: z
    .number()
    .min(1, "Order must be at least 1")
    .max(999, "Order cannot exceed 999")
    .optional(),
});

// Type exports
export type CreateSectionFormData = z.infer<typeof createSectionSchema>;
export type UpdateSectionFormData = z.infer<typeof updateSectionSchema>;