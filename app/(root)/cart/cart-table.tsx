'use client';

import { CartResponse, ErrorResponse } from '@/actions/cart-actions';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { CartSchema } from '@/schemas/cart-schema';
import { ArrowRight, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { cartColumns } from './cart-columns';

type CartTableProps = {
  cart?: CartResponse | ErrorResponse;
  cartItems?: CartSchema[];
};

const CartTable = ({ cart, cartItems }: CartTableProps) => {
  console.log('🚀 ~ CartTable ~ cartItems:', cartItems);
  console.log('🚀 ~ CartTable ~ cart:', cart);
  const router = useRouter();

  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const isCartResponse = (
    cart: CartResponse | ErrorResponse | undefined
  ): cart is CartResponse => {
    return cart !== undefined && !('error' in cart);
  };
  return (
    <>
      <h1 className='h2-bold py-4'>Shopping Cart</h1>

      {!isCartResponse(cart) || cart.items.length === 0 ? (
        <div>
          Cart is empty. <Link href='/'>Go Shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <DataTable columns={cartColumns} data={cart.items || []} />
          </div>
          <Card>
            <CardContent className='gap-4 p-4'>
              <div className='pb-3 text-xl'>
                Subtotal ({cart.items.reduce((a, c) => a + +c.qty, 0)})
                <span className='font-bold'>
                  {formatCurrency(+cart.itemsPrice)}
                </span>
              </div>
              <Button
                className='w-full'
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push('/shipping-address'))
                }
              >
                {isPending ? (
                  <Loader className='h-4 w-4 animate-spin' />
                ) : (
                  <ArrowRight className='h-4 w-4' />
                )}{' '}
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
