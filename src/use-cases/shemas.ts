import { z } from "zod";

export const quantitySchema = z.number().int().min(1);
export const idSchema = z.number().int().positive();

export const itemSchema = z.object({
  name: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z\s]+$/, { message: "item name must only contain letters" }),
  quantity: quantitySchema,
});
