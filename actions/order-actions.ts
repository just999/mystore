'use server';

import { auth } from '@/auth';
import { PAGE_SIZE } from '@/lib/constants';
import { db } from '@/lib/db';
import { paypal } from '@/lib/paypal';
import { formatError, formatMonth } from '@/lib/utils';
import { CartSchema } from '@/schemas/cart-schema';
import { insertOrderSchema } from '@/schemas/order-schema';
import { PaymentResultSchema } from '@/schemas/payment-methods-schema';
import {
  defaultPaymentResult,
  isPaymentResult,
  OrderWithRelations,
  PaymentResult,
  SalesDataType,
} from '@/types/type';
import { Prisma } from '@prisma/client';
import { MongoClient } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { fetchUserById } from './auth-actions';
import { fetchMyCart } from './cart-actions';

interface OrderErrorResponse {
  error: boolean;
  message: string;
  redirectTo?: string;
}
const mongoUrl = process.env.DATABASE_URL!;
const client = new MongoClient(mongoUrl);

export async function createOrder(): Promise<OrderErrorResponse> {
  // Get MongoDB client from Prisma
  const session = await client.startSession();
  try {
    const authSession = await auth();
    if (!authSession) throw new Error('User is not authenticated');

    const cart = await fetchMyCart();
    const userId = authSession.user.id;

    if (!userId) throw new Error('User is not authenticated');

    const user = await fetchUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        error: true,
        message: 'Your cart is empty',
        redirectTo: './cart',
      };
    }

    if (!user.shippingAddress) {
      return {
        error: true,
        message: 'No shipping address',
        redirectTo: '/shipping-address',
      };
    }

    if (!user.paymentMethod) {
      return {
        error: true,
        message: 'no payment method',
        redirectTo: '/payment-method',
      };
    }

    const shippingAddress = await db.shippingAddress.findFirst({
      where: {
        userId,
      },
    });

    // Create order object
    const orderData = insertOrderSchema.parse({
      userId: user.id,
      shippingAddressId: shippingAddress?.id,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    let orderId = '';

    await session.withTransaction(
      async () => {
        // Create order
        const order = await db.order.create({
          data: orderData,
          select: { id: true },
        });
        orderId = order.id;

        // Create order items
        const orderItemPromises = cart.items.map((item: CartSchema) =>
          db.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              name: item.name,
              slug: item.slug,
              qty: item.qty,
              image: item.image,
              price: item.price.toString(),
            },
          })
        );

        await Promise.all(orderItemPromises);

        await db.cart.update({
          where: { id: cart.id },
          data: {
            items: {},
            totalPrice: '0',
            taxPrice: '0',
            shippingPrice: '0',
            itemsPrice: '0',
          },
        });
      },
      {
        // MongoDB transaction options
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' },
      }
    );

    if (!orderId) throw new Error('Order not created');

    return {
      error: false,
      message: 'Order created',
      redirectTo: `/order/${orderId}`,
    };
  } catch (err) {
    if (isRedirectError(err)) throw err;

    return {
      error: true,
      message: err instanceof Error ? err.message : 'An error occurred',
    };
  } finally {
    await session.endSession();
  }
}

export async function getOrderById(orderId: string) {
  const data = await db.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      shippingAddress: true,
      orderitems: true,
      paymentResult: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return data;
}

//*CREATE PAYPAL ORDER */
export async function createPayPalOrder(orderId: string) {
  try {
    const order = await db.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        paymentResult: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order) {
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));
      // await db.order.update({
      //   where: {
      //     id: orderId,
      //   },
      //   data: {
      //     paymentResult: {
      //       paymentId: paypalOrder.id,
      //       email_address: '',
      //       status: '',
      //       pricePaid: '',
      //     },
      //   },
      // });
      await db.paymentResult.create({
        data: {
          paymentId: paypalOrder.id,
          orderId,
          pricePaid: order.totalPrice,
        },
      });

      return {
        error: false,
        message: 'Item order Successfully updated',
        data: paypalOrder.id,
      };
    } else {
      throw new Error('Order not found');
    }
  } catch (err) {
    return {
      success: false,
      message: formatError(err),
    };
  }
}

//* */ APPROVE PAYPAL ORDER AND UPDATE
export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    const order = await db.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        orderitems: true,
        paymentResult: true,
      },
    });

    const paymentRes = await db.paymentResult.findFirst({
      where: {
        orderId,
      },
    });
    if (!paymentRes) {
      return {
        error: true,
        message: 'no payment result found',
      };
    }

    if (!order) throw new Error('Order not found');
    if (order.isPaid) throw new Error('Order is already paid');

    // Validate stock availability before processing payment
    for (const item of order.orderitems) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || +product.stock < +item.qty) {
        throw new Error(
          `Insufficient stock for product ${item.productId}. ` +
            `Available: ${product?.stock}, Required: ${item.qty}`
        );
      }
    }

    const captureData = await paypal.capturePayment(data.orderID);
    if (
      !captureData ||
      captureData.id !== paymentRes.paymentId ||
      captureData.status !== 'COMPLETED'
    ) {
      throw new Error('Error in PayPal payment');
    }

    await updateOrderToPaid({
      orderId,
      paymentResult: {
        paymentId: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      error: false,
      message: 'Your payment is Approved',
    };
  } catch (err) {
    return {
      error: true,
      message: formatError(err),
    };
  }
}

//*UPDATE ORDER TO PAID */

// async function updateOrderToPaid({
//   orderId,
//   paymentResult,
// }: {
//   orderId: string;
//   paymentResult?: PaymentResultSchema;
// }) {
//   const order = await db.order.findFirst({
//     where: {
//       id: orderId,
//     },
//     include: {
//       orderitems: true,
//     },
//   });

//   if (!order) throw new Error('Order not found');

//   if (order.isPaid) throw new Error('Order is already paid');

//   await db.$transaction(async (tx) => {
//     for (const item of order.orderitems) {
//       await tx.product.update({
//         where: { id: item.productId },
//         data: { stock: { increment: -item.qty } },
//         // data: { stock: { increment: -item.qty } },
//       });
//     }

//     await tx.order.update({
//       where: { id: orderId },
//       data: {
//         isPaid: true,
//         paidAt: new Date(),
//         paymentResult,
//       },
//     });
//   });

//   const updatedOrder = await db.order.findFirst({
//     where: { id: orderId },
//     include: {
//       orderitems: true,
//       user: {
//         select: {
//           name: true,
//           email: true,
//         },
//       },
//     },
//   });

//   if (!updatedOrder) throw new Error('Order not found');
// }

//*UPDATE ORDER TO PAID BY CLAUDE */
export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResultSchema;
}) {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const session = await client.startSession();

    try {
      return await session.withTransaction(async () => {
        // Get and verify order within transaction
        const order = await db.order.findFirst({
          where: {
            AND: [{ id: orderId }, { isPaid: false }],
          },
          include: {
            orderitems: true,
            paymentResult: true,
          },
        });

        if (!order) {
          throw new Error('Order not found or already paid');
        }

        // Verify and update all product stocks
        for (const item of order.orderitems) {
          const product = await db.product.findUnique({
            where: { id: item.productId },
          });

          if (!product || +product.stock < +item.qty) {
            throw new Error(
              `Insufficient stock for product ${item.productId}. ` +
                `Available: ${product?.stock}, Required: ${item.qty}`
            );
          }

          const newStock = +product.stock - Number(item.qty);

          await db.product.update({
            where: { id: item.productId },
            data: {
              stock: newStock.toString(),
            },
          });
        }

        // Update order status
        const updatedOrder = await db.order.update({
          where: {
            id: orderId,
            isPaid: false,
          },
          data: {
            isPaid: true,
            paidAt: new Date(),
            paymentResult: paymentResult
              ? {
                  create: {
                    paymentId: paymentResult.paymentId,
                    status: paymentResult.status,
                    email_address: paymentResult.email_address,
                    pricePaid: paymentResult.pricePaid,
                  },
                }
              : undefined,
          },
          include: {
            orderitems: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        });

        return updatedOrder;
      });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error('Error in updateOrderToPaid:', error);
    throw error;
  } finally {
    await client.close();
  }
}

//*GET USER"S ORDERS */
export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}): Promise<{ data: OrderWithRelations[]; totalPages: number }> {
  const session = await auth();
  if (!session) throw new Error('User is not authorized');

  const rawData = await db.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      orderitems: true,
      paymentResult: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },

    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const data: OrderWithRelations[] = rawData.map((order) => {
    let paymentResult: PaymentResult;

    try {
      const rawPaymentResult = order.paymentResult;
      paymentResult = isPaymentResult(rawPaymentResult)
        ? rawPaymentResult
        : defaultPaymentResult;
    } catch {
      paymentResult = defaultPaymentResult;
    }

    return {
      ...order,
      paymentResult,
      orderitems: order.orderitems.map((item) => ({
        ...item,
        qty: item.qty.toString(),
        price: item.price.toString(),
      })),
    };
  });

  const dataCount = await db.order.count({
    where: { userId: session.user.id },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

//*GET SALES DATA AND ORDER SUMMARY */
export async function getOrderSummary() {
  const [ordersCount, productsCount, usersCount] = await Promise.all([
    db.order.count(),
    db.product.count(),
    db.user.count(),
  ]);

  const totalSalesAgg = (await db.order.aggregateRaw({
    pipeline: [
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: { $toDouble: '$totalPrice' },
          },
        },
      },
    ],
  })) as unknown as Array<{ _id: null; totalSales: number }>;

  const totalSales = totalSalesAgg[0]?.totalSales ?? 0;

  //*GET MONTHLY SALES */

  const monthlySalesAgg = (await db.order.aggregateRaw({
    pipeline: [
      {
        $group: {
          _id: {
            // $dateToString: {
            //   format: '%Y-%m',
            //   date: '$createdAt',
            // },
            $concat: [
              { $substr: ['$createdAt', 0, 4] },
              '-',
              { $substr: ['$createdAt', 5, 2] },
            ],
          },
          totalSales: {
            $sum: {
              $toDouble: '$totalPrice',
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ],
  })) as unknown as Array<{ _id: string; totalSales: number }>;

  //*TRANSFORM THE MONTHLY SALES DATA */
  const salesData: SalesDataType[] = monthlySalesAgg.map((entry) => ({
    month: formatMonth(entry._id),
    totalSales: entry.totalSales,
  }));

  //*GET LATEST SALES */
  const latestSales = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales: Number(totalSales).toFixed(2),
    latestSales,
    salesData,
  };
}

//*GET ALL ORDERS */
export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}): Promise<{ data: OrderWithRelations[]; totalPages: number }> {
  const queryFilter: Prisma.OrderWhereInput =
    query && query !== 'all'
      ? {
          user: {
            name: {
              contains: query,
              mode: 'insensitive',
            } as Prisma.StringFilter,
          },
        }
      : {};

  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  const rawData = await db.order.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      orderitems: true,
      paymentResult: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const dataCount = await db.order.count();

  const data: OrderWithRelations[] = rawData.map((order) => {
    let paymentResult: PaymentResult;

    try {
      const rawPaymentResult = order.paymentResult;
      paymentResult = isPaymentResult(rawPaymentResult)
        ? rawPaymentResult
        : defaultPaymentResult;
    } catch {
      paymentResult = defaultPaymentResult;
    }

    return {
      ...order,
      paymentResult,
      orderitems: order.orderitems.map((item) => ({
        ...item,
        qty: item.qty.toString(),
        price: item.price.toString(),
      })),
    };
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

//*DELETE AN ORDER ADMIN */
export async function deleteOrderByAdmin(id: string) {
  try {
    await db.order.delete({
      where: {
        id,
      },
    });

    revalidatePath('/admin/orders');

    return {
      error: false,
      message: 'Order successfully deleted',
    };
  } catch (error) {
    return {
      error: true,
      message: formatError(error),
    };
  }
}

//*UPDATE COD ORDER TO PAID */
export async function updateOrderToPaidCOD(orderId: string) {
  try {
    await updateOrderToPaid({ orderId });

    revalidatePath(`/order/${orderId}`);

    return {
      error: false,
      message: 'order marked as paid',
    };
  } catch (error) {
    return {
      error: true,
      message: formatError(error),
    };
  }
}
//*UPDATE COD ORDER TO DELIVERED */
export async function deliveredOrder(orderId: string) {
  try {
    const order = await db.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return {
        error: true,
        message: 'order not found',
      };
    }
    if (!order.isPaid) {
      return {
        error: true,
        message: 'order is not paid',
      };
    }

    await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      error: false,
      message: 'order has been marked delivered',
    };
  } catch (error) {
    return {
      error: true,
      message: formatError(error),
    };
  }
}
