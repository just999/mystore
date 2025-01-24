'use server';

import { auth } from '@/auth';
import { PaymentMethodType } from '@/lib/constants';
import { db } from '@/lib/db';
import { formatError } from '@/lib/utils';
import {
  paymentMethodSchema,
  PaymentMethodSchema,
} from '@/schemas/payment-methods-schema';

export async function updateUserPaymentMethod(formData: PaymentMethodSchema) {
  try {
    const session = await auth();
    const curUser = await db.user.findFirst({
      where: { id: session?.user.id },
      include: {
        shippingAddress: true,
      },
    });

    if (!curUser) throw new Error('User not found');

    const paymentMethod = paymentMethodSchema.parse(formData);
    if (!paymentMethod) {
      return {
        error: true,
        message: 'Something went wrong',
      };
    }
    const { type } = paymentMethod;

    await db.user.update({
      where: { id: curUser.id },
      data: { paymentMethod: type as PaymentMethodType },
    });

    return {
      error: false,
      message: 'Payment Method Successfully updated',
    };
  } catch (err) {
    return {
      error: true,
      message: formatError(err),
    };
  }
}
