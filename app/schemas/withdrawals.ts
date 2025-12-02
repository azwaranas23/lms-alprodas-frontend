import { z } from "zod";

// Withdrawal Status Enum
const withdrawalStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "PROCESSING",
  "COMPLETED"
]);

// Bank Information Schema
export const bankInformationSchema = z.object({
  bank_name: z
    .string()
    .min(1, "Bank name is required")
    .min(2, "Bank name must be at least 2 characters"),
  account_number: z
    .string()
    .min(1, "Account number is required")
    .min(10, "Account number must be at least 10 digits")
    .max(20, "Account number cannot exceed 20 digits")
    .regex(/^\d+$/, "Account number must contain only numbers"),
  account_holder_name: z
    .string()
    .min(1, "Account holder name is required")
    .min(2, "Account holder name must be at least 2 characters")
    .max(100, "Account holder name cannot exceed 100 characters"),
});

// Withdrawal Amount Schema (for step validation)
export const withdrawalAmountSchema = z.object({
  amount: z
    .number()
    .min(100000, "Minimum withdrawal amount is Rp 100,000")
    .max(100000000, "Maximum withdrawal amount is Rp 100,000,000"),
});

// Withdrawal Details Schema
export const withdrawalDetailsSchema = z.object({
  amount: z
    .number()
    .min(50000, "Minimum withdrawal amount is Rp 50,000")
    .max(100000000, "Maximum withdrawal amount is Rp 100,000,000"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
});

// Account Verification Schema
export const accountVerificationSchema = z.object({
  identity_type: z.enum(["ktp", "passport", "driving_license"]),
  identity_number: z
    .string()
    .min(1, "Identity number is required")
    .min(16, "Identity number must be at least 16 characters")
    .max(20, "Identity number cannot exceed 20 characters"),
  identity_photo: z
    .instanceof(File, { message: "Identity photo is required" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Identity photo must be less than 5MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      { message: "Only JPEG, PNG, and WebP images are allowed" }
    ),
  selfie_photo: z
    .instanceof(File, { message: "Selfie photo is required" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Selfie photo must be less than 5MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      { message: "Only JPEG, PNG, and WebP images are allowed" }
    ),
});

// Complete Withdrawal Request Schema
export const createWithdrawalSchema = bankInformationSchema
  .merge(withdrawalDetailsSchema)
  .merge(accountVerificationSchema);

// Update Withdrawal Schema
export const updateWithdrawalSchema = z.object({
  amount: z
    .number()
    .min(50000, "Minimum withdrawal amount is Rp 50,000")
    .max(100000000, "Maximum withdrawal amount is Rp 100,000,000")
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  status: withdrawalStatusEnum.optional(),
  bank_name: z.string().min(2).optional(),
  account_number: z
    .string()
    .min(10)
    .max(20)
    .regex(/^\d+$/)
    .optional(),
  account_holder_name: z.string().min(2).max(100).optional(),
  admin_notes: z.string().max(1000).optional(),
});

// Withdrawal Filter Schema
export const withdrawalFilterSchema = z.object({
  search: z.string().optional(),
  status: withdrawalStatusEnum.optional(),
  mentor_id: z.number().optional(),
  amount_min: z.number().min(0).optional(),
  amount_max: z.number().min(0).optional(),
  date_from: z.string().optional(), // ISO date string
  date_to: z.string().optional(), // ISO date string
  sort_by: z.enum(["amount", "created_at", "updated_at", "status"]).optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Withdrawal Action Schemas
export const approveWithdrawalSchema = z.object({
  withdrawal_id: z.number().min(1, "Withdrawal ID is required"),
  admin_notes: z.string().max(1000).optional(),
});

export const rejectWithdrawalSchema = z.object({
  withdrawal_id: z.number().min(1, "Withdrawal ID is required"),
  rejection_reason: z
    .string()
    .min(1, "Rejection reason is required")
    .min(10, "Rejection reason must be at least 10 characters")
    .max(500, "Rejection reason cannot exceed 500 characters"),
  admin_notes: z.string().max(1000).optional(),
});

export const completeWithdrawalSchema = z.object({
  withdrawal_id: z.number().min(1, "Withdrawal ID is required"),
  proof_of_transfer: z
    .instanceof(File, { message: "Proof of transfer is required" })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "Proof file must be less than 10MB",
    })
    .refine(
      (file) => [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf"
      ].includes(file.type),
      { message: "Only JPEG, PNG, WebP, and PDF files are allowed" }
    ),
  admin_notes: z.string().max(1000).optional(),
});

// Withdrawal Statistics Schema
export const withdrawalStatsSchema = z.object({
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  mentor_id: z.number().optional(),
});

// Type exports
export type WithdrawalFormData = z.infer<typeof createWithdrawalSchema>;
export type BankInformationData = z.infer<typeof bankInformationSchema>;
export type WithdrawalDetailsData = z.infer<typeof withdrawalDetailsSchema>;
export type AccountVerificationData = z.infer<typeof accountVerificationSchema>;
export type UpdateWithdrawalData = z.infer<typeof updateWithdrawalSchema>;
export type WithdrawalFilterData = z.infer<typeof withdrawalFilterSchema>;
export type ApproveWithdrawalData = z.infer<typeof approveWithdrawalSchema>;
export type RejectWithdrawalData = z.infer<typeof rejectWithdrawalSchema>;
export type CompleteWithdrawalData = z.infer<typeof completeWithdrawalSchema>;
export type WithdrawalStatsData = z.infer<typeof withdrawalStatsSchema>;
export type WithdrawalStatus = z.infer<typeof withdrawalStatusEnum>;