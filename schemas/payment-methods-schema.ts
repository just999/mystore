import { PAYMENT_METHODS } from '@/lib/constants';
import { z } from 'zod';

export const paymentMethodSchema = z
  .object({
    type: z.enum(PAYMENT_METHODS, {
      required_error: 'Payment methods is required',
    }),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ['type'],
    message: 'Invalid payment method',
  });

export type PaymentMethodSchema = z.infer<typeof paymentMethodSchema>;

// Schema for the PayPal paymentResult
export const paymentResultSchema = z.object({
  paymentId: z.string(),
  status: z.string().optional(),
  email_address: z.string(),
  pricePaid: z.string(),
});

export type PaymentResultSchema = z.infer<typeof paymentResultSchema>;
