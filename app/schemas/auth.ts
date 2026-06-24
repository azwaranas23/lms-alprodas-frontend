import { z } from "zod";
import { emailSchema } from "./common";
export { passwordSchema as registerPasswordSchema } from "./common";

// Simple password schema for login (only minimum length requirement)
export const loginPasswordSchema = z.string()
	.min(1, 'Password is required')
	.min(8, 'Password must be at least 8 characters');

export const loginSchema = z.object({
	email: emailSchema,
	password: loginPasswordSchema,
});



export type LoginFormData = z.infer<typeof loginSchema>;