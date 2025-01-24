import { db } from '@/lib/db';
import { ShippingAddress } from '@prisma/client';
import { cache } from 'react';
import { ErrorResponse } from './cart-actions';

export const getShippingAddressByUserId = cache(
  async (id: string): Promise<ShippingAddress | ErrorResponse> => {
    try {
      const user = await db.user.findUnique({
        where: { id },
      });

      if (!user) {
        return {
          error: true,
          message: 'Unauthenticated',
        };
      }

      const shippingAddress = await db.shippingAddress.findFirst({
        where: {
          userId: id,
        },
      });
      if (!shippingAddress) {
        return {
          error: true,
          message: 'shipping address not found',
        };
      }
      return shippingAddress;
    } catch (err) {
      return {
        error: true,
        message: 'Something went wrong',
      };
    }
  }
);
