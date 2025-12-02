import { z } from "zod";
import { createImageSchema, requiredString } from "./common";

export const subjectSchema = z.object({
	name: requiredString("Subject name")
		.min(3, "Subject name must be at least 3 characters")
		.max(100, "Subject name must be less than 100 characters"),
	description: z
		.string()
		.max(500, "Description must be less than 500 characters")
		.nullable()
		.optional(),
	topic_id: requiredString("Please select a topic"),
	image: createImageSchema(false, 2), // optional image, max 2MB
});

export type SubjectFormData = z.infer<typeof subjectSchema> & {
	id?: number;
};