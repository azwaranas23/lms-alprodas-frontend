import { z } from "zod";
import { createImageSchema, requiredString } from "./common";

export const topicSchema = z.object({
	name: requiredString("Topic name")
		.min(3, "Topic name must be at least 3 characters")
		.max(100, "Topic name must be less than 100 characters"),
	description: z.string().nullable().optional(),
	image: createImageSchema(false, 2), // optional image, max 2MB
});

export type TopicFormData = z.infer<typeof topicSchema> & {
	id?: number;
};
