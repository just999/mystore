'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { convertToPlainObject, formatError, round2 } from '@/lib/utils';
import { cartSchema, CartSchema } from '@/schemas/cart-schema';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getUserId } from './auth-actions';

const calcPrice = (items: CartSchema[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * +item.qty, 0)
    ),
    shippingPrice = round2(
      Number(itemsPrice) > 100 || Number(itemsPrice) === 0 ? 0 : 10
    ),
    taxPrice = round2(0.15 * Number(itemsPrice)),
    totalPrice = round2(+itemsPrice + +taxPrice + +shippingPrice);

  return {
    itemsPrice: Number(itemsPrice).toFixed(2),
    shippingPrice: Number(shippingPrice).toFixed(2),
    taxPrice: Number(taxPrice).toFixed(2),
    totalPrice: Number(totalPrice).toFixed(2),
  };
};

export type CartResponse = {
  items: CartSchema[];
  itemsPrice: string;
  totalPrice: string;
  shippingPrice: string;
  taxPrice: string;
  sessionCartId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
};

export type ErrorResponse = {
  error: boolean;
  message: string;
};

export async function sumItemToCart(formData: CartSchema) {
  try {
    const sessionCartId = (await cookies()).get('sessionCardId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    const session = await auth();
    const userId = session?.user.id ? (session.user.id as string) : undefined;

    const cart = await fetchMyCart();

    const item = cartSchema.parse(formData);

    const product = await db.product.findFirst({
      where: { id: item.productId },
    });

    console.log({
      'Session Cart ID': sessionCartId,
      'User ID': userId,
      'Item Requested': item,
    });

    return {};
  } catch (err) {}
}

export async function addItemToCart(formData: CartSchema) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) {
      return {
        error: true,
        message: 'session cart not found',
      };
    }

    const userId = await getUserId();
    const cartResult = await getMyCart();

    if (cartResult && 'error' in cartResult) {
      return cartResult;
    }

    const item = cartSchema.parse(formData);

    const product = await db.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) {
      return {
        error: true,
        message: 'product not found',
      };
    }

    if (!cartResult) {
      // const newCart = insertCartSchema.parse({
      //   userId,
      //   items: [item],
      //   sessionCartId,
      //   ...calcPrice([item]),
      // });
      const newCart = await db.cart.create({
        data: {
          userId,
          sessionCartId,
          itemsPrice: '0',
          totalPrice: '0',
          shippingPrice: '0',
          taxPrice: '0',
          items: {
            create: {
              productId: item.productId,
              name: item.name,
              slug: item.slug,
              qty: item.qty,
              image: item.image,
              price: item.price,
            },
          },
        },
        include: {
          items: true,
        },
      });

      const prices = calcPrice([item]);
      await db.cart.update({
        where: { id: newCart.id },
        data: prices,
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        error: false,
        message: `${product.name} Successfully added to your cart`,
      };
    } else {
      const existingItem = await db.cartItem.findFirst({
        where: {
          cartId: cartResult.id,
          productId: item.productId,
        },
      });

      if (existingItem) {
        if (+product.stock < +existingItem.qty + 1) {
          throw new Error('Not enough stock');
        }

        await db.cartItem.update({
          where: { id: existingItem.id },
          data: {
            qty: (+existingItem.qty + 1).toString(),
          },
        });
      } else {
        await db.cartItem.create({
          data: {
            cartId: cartResult.id,
            productId: item.productId,
            name: item.name,
            slug: item.slug,
            qty: item.qty,
            image: item.image,
            price: item.price,
          },
        });
      }

      const updatedItems = await db.cartItem.findMany({
        where: {
          cartId: cartResult.id,
        },
      });

      await db.cart.update({
        where: { id: cartResult.id },
        data: calcPrice(updatedItems),
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        error: false,
        message: existingItem
          ? `${product.name} quantity updated from ${existingItem.qty} to ${+existingItem.qty + 1}`
          : `${product.name} Successfully added to your cart`,
      };

      // const items = [...cartResult.items];
      // const existingItemIndex = items.findIndex(
      //   (x) => x.productId === item.productId
      // );

      // if (existingItemIndex !== -1) {
      //   const existingItem = items[existingItemIndex];
      //   if (+product.stock < +existingItem.qty + 1) {
      //     throw new Error('Not enough stock');
      //   }

      //   // Create a new item with updated quantity
      //   items[existingItemIndex] = {
      //     ...existingItem,
      //     qty: (+existingItem.qty + 1).toString(),
      //   };

      //   // Update the cart with new items array and recalculated prices
      //   await db.cart.update({
      //     where: { id: cartResult.id },
      //     data: {
      //       items,
      //       ...calcPrice(items),
      //     },
      //   });

      //   revalidatePath(`/product/${product.slug}`);

      //   return {
      //     error: false,
      //     message: `${product.name} ${existingItem ? `from ${+existingItem.qty} updated to become ${+existingItem.qty + 1}` : 'added to'} to your cart`,
      //   };
      // } else {
      //   // Add new item to cart
      //   items.push(item);

      //   await db.cart.update({
      //     where: { id: cartResult.id },
      //     data: {
      //       items,
      //       ...calcPrice(items),
      //     },
      //   });

      //   revalidatePath(`/product/${product.slug}`);

      //   return {
      //     error: false,
      //     message: `${product.name} Successfully added to your cart`,
      //   };
      // }
    }
  } catch (err) {
    console.error('error adding item to cart', err);
    return {
      error: true,
      message: formatError(err),
    };
  }
}

export async function getMyCart(): Promise<
  CartResponse | ErrorResponse | undefined
> {
  try {
    const cookieStore = await cookies();
    const sessionCartId = cookieStore.get('sessionCartId')?.value;
    if (!sessionCartId) {
      return {
        error: true,
        message: 'session cart not found',
      };
    }

    const userId = await getUserId();

    const cart = await db.cart.findFirst({
      where: {
        OR: [{ userId }, { sessionCartId }],
      },
      // select: {
      //   id: true,
      //   userId: true,
      //   sessionCartId: true,
      //   items: true,
      //   itemsPrice: true,
      //   totalPrice: true,
      //   shippingPrice: true,
      //   taxPrice: true,
      //   createdAt: true,
      //   updatedAt: true,
      // },

      include: {
        items: true,
      },
    });

    if (!cart) {
      return undefined;
    }

    // Ensure items is properly typed and all fields are strings
    const parsedCart: CartResponse = {
      ...cart,
      items: (cart.items as CartSchema[]).map((item) => ({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        qty: item.qty.toString(),
        image: item.image,
        price: item.price.toString(),
      })),
      itemsPrice: cart.itemsPrice.toString(),
      totalPrice: cart.totalPrice.toString(),
      shippingPrice: cart.shippingPrice.toString(),
      taxPrice: cart.taxPrice.toString(),
    };
    return parsedCart;
  } catch (err) {
    console.error('Error fetching cart:', err);
    return {
      error: true,
      message: 'Error fetching user cart',
    };
  }
}

export async function removeItemFromCart(
  productId: string,
  action: 'increase' | 'decrease'
) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) {
      return {
        error: true,
        message: 'session cart not found',
      };
    }

    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return {
        error: true,
        message: 'No product found',
      };
    }

    const cart = await getMyCart();
    if (cart && 'error' in cart) {
      return {
        error: true,
        message: 'cart not found',
      };
    }

    if (!cart) {
      throw new Error('No cart found');
    }

    const existingItem = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (!existingItem) {
      return {
        error: true,
        message: 'Item not found in cart',
      };
    }

    if (action === 'decrease' && +existingItem.qty === 1) {
      await db.cartItem.delete({
        where: { id: existingItem.id },
      });
    } else {
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: {
          qty: (action === 'increase'
            ? Number(existingItem.qty) + 1
            : Number(existingItem.qty) - 1
          ).toString(),
        },
      });
    }

    const updatedItems = await db.cartItem.findMany({
      where: { cartId: cart.id },
    });

    await db.cart.update({
      where: { id: cart.id },
      data: {
        itemsPrice: String(
          round2(
            updatedItems.reduce(
              (acc, item) => acc + Number(item.price) * +item.qty,
              0
            )
          )
        ),
        shippingPrice: String(
          round2(
            updatedItems.reduce(
              (acc, item) => acc + Number(item.price) * +item.qty,
              0
            ) > 100
              ? 0
              : 10
          )
        ),
        taxPrice: String(
          round2(
            0.15 *
              updatedItems.reduce(
                (acc, item) => acc + Number(item.price) * +item.qty,
                0
              )
          )
        ),
        totalPrice: String(
          round2(
            updatedItems.reduce(
              (acc, item) => acc + Number(item.price) * +item.qty,
              0
            ) +
              (updatedItems.reduce(
                (acc, item) => acc + Number(item.price) * +item.qty,
                0
              ) > 100
                ? 0
                : 10) +
              0.15 *
                updatedItems.reduce(
                  (acc, item) => acc + Number(item.price) * +item.qty,
                  0
                )
          )
        ),
      },
    });

    revalidatePath(`/product/${product.slug}`);
    revalidatePath('/cart');

    return {
      error: false,
      message:
        action === 'decrease' && +existingItem.qty === 1
          ? `${product.name} was removed from cart`
          : `${product.name} quantity was updated in cart`,
    };

    // const items = [...cart.items];
    // const existingItemIndex = items.findIndex((x) => x.productId === productId);

    // if (existingItemIndex === -1) {
    //   return {
    //     error: true,
    //     message: 'Item not found in cart',
    //   };
    // }

    // // const existingItem = items[existingItemIndex];

    // if (action === 'decrease' && +existingItem.qty === 1) {
    //   const updatedItems = items.filter((x) => x.productId !== productId);

    //   await db.cart.update({
    //     where: { id: cart.id },
    //     data: {
    //       items: updatedItems,
    //       ...calcPrice(updatedItems),
    //     },
    //   });
    // } else {
    //   items[existingItemIndex] = {
    //     ...existingItem,
    //     qty: (action === 'increase'
    //       ? Number(existingItem.qty) + 1
    //       : Number(existingItem.qty) - 1
    //     ).toString(),
    //   };

    //   await db.cart.update({
    //     where: { id: cart.id },
    //     data: {
    //       items,
    //       ...calcPrice(items),
    //     },
    //   });
    // }

    // // items[existingItemIndex] = {
    // //   ...existingItem,
    // //   qty: (action === 'increase'
    // //     ? Number(existingItem.qty) + 1
    // //     : Number(existingItem.qty) - 1
    // //   ).toString(),
    // // };

    // revalidatePath(`/product/${product.slug}`);
    // revalidatePath(`/cart`);

    // return {
    //   error: false,
    //   message:
    //     action === 'decrease' && +existingItem.qty === 1
    //       ? `${product.name} was removed from cart`
    //       : `${product.name} quantity  was updated to cart`,
    // };
  } catch (err) {
    return {
      error: true,
      message: formatError(err),
    };
  }
}

export async function fetchMyCart() {
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Cart session not found');

  const session = await auth();
  const userId = session?.user.id ? (session.user.id as string) : undefined;

  const cart = await db.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    include: {
      items: true,
    },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartSchema[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
