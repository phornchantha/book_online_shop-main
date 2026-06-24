import { z } from "zod";

export const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  price: z.number().positive("Price must be positive"),
  stock: z
    .number()
    .int("Stock must be a whole number")
    .nonnegative("Stock cannot be negative"),
  categoryId: z.string().min(1, "Category is required"),
  sellerId: z.string().min(1, "Seller is required"),
  description: z.string().min(1, "Description is required"),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;
