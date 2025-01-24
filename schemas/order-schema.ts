import { PAYMENT_METHODS } from '@/lib/constants';

import { OrderItem } from '@prisma/client';
import { z } from 'zod';
import { PaymentResultSchema } from './payment-methods-schema';
import { currency } from './product-schema';

export const insertOrderSchema = z.object({
  userId: z.string().min(1, {
    message: 'User id is required',
  }),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.enum(PAYMENT_METHODS),
  shippingAddressId: z.string(),
});

export type InsertOrderSchema = z.infer<typeof insertOrderSchema>;

export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.string(),
});

export type InsertOrderItemSchema = z.infer<typeof insertOrderItemSchema>;

export type OrderSchema = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string };
  paymentResult: PaymentResultSchema;
};
