import { formatNumberWithDecimal } from '@/lib/utils';
import { z } from 'zod';

export const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    { message: 'Price must have exactly 2 decimal place' }
  );

// SCHEMA FOR INSERTING PRODUCTS
export const insertProductSchema = z.object({
  name: z.string().min(3, {
    message: 'Name must be at least 2 characters',
  }),
  slug: z.string().min(3, {
    message: 'Slug must be at least 2 characters',
  }),
  category: z.string().min(3, {
    message: 'Category must be at least 2 characters',
  }),
  brand: z.string().min(3, {
    message: 'Brand must be at least 2 characters',
  }),
  description: z.string().min(3, {
    message: 'Description must be at least 2 characters',
  }),
  stock: z.string(),
  images: z.array(z.string()).min(1, {
    message: 'Image count at least 1 ',
  }),
  isFeatured: z.boolean(),
  banner: z.string().nullable().optional(),
  price: currency,
});

export type InsertProductSchema = z.infer<typeof insertProductSchema>;

export type ProductSchema = z.infer<typeof insertProductSchema> & {
  id: string;
  createdAt: Date;
  rating: string;
  numReviews: string;
};

//*SCHEMA FOR UPDATING PRODUCTS */
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, {
    message: 'Id is required',
  }),
});

export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
