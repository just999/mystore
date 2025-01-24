import { z } from 'zod';
import { currency } from './product-schema';

export const cartSchema = z.object({
  productId: z.string().min(1, {
    message: 'product is required',
  }),
  name: z.string().min(1, {
    message: 'name is required',
  }),
  slug: z.string().min(1, {
    message: 'slug is required',
  }),
  qty: z.string().min(1, {
    message: 'qty is required',
  }),
  image: z.string().min(1, {
    message: 'image is required',
  }),
  price: currency,
});

export type CartSchema = z.infer<typeof cartSchema>;

export const insertCartSchema = z.object({
  items: z.array(cartSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, {
    message: 'session cart id is required',
  }),
  userId: z.string().optional().nullable(),
});

export type InsertCartSchema = z.infer<typeof insertCartSchema>;
