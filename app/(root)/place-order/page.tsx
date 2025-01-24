import { fetchUserById } from '@/actions/auth-actions';
import { fetchMyCart } from '@/actions/cart-actions';
import { auth } from '@/auth';
import { DataTable } from '@/components/data-table';
import CheckoutStep from '@/components/shared/checkout-step';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { ShippingAddressSchema } from '@/schemas/shipping-address-schema';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { orderColumns } from './order-columns';
import PlaceOrderForm from './place-order-form';

type PlaceOrderPageProps = unknown;

export const metadata: Metadata = {
  title: 'Place Order',
};
const PlaceOrderPage = async () => {
  const cart = await fetchMyCart();
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    throw new Error('No user found');
  }
  const user = await fetchUserById(userId);
  if (!cart || cart.items.length === 0) {
    redirect('/cart');
  }
  if (!user.shippingAddress) redirect('/shipping-address');
  if (!user.paymentMethod) redirect('/payment-method');
  const userAddress = user.shippingAddress[0] as ShippingAddressSchema;

  // const shippingAddress = (await getShippingAddressByUserId(
  //   userId
  // )) as ShippingAddress;

  // if (cart && 'error' in cart) {
  //   redirect('/cart');
  // }

  // if (!shippingAddress) redirect('/shipping-address');
  // if ('error' in user) {
  //   throw new Error('Failed to fetch user data');
  // }

  // if (!user.paymentMethod) {
  //   redirect('/payment-method');
  // }

  return (
    <>
      <CheckoutStep current={3} />
      <h1 className='py-4 text-2xl'>Place Order</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='space-y-4 overflow-x-auto md:col-span-2'>
          <Card>
            <CardContent className='gap-4 p-4'>
              <h2 className='pb-4 text-xl'>Shipping Address</h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city}{' '}
                {userAddress.postalCode}, {userAddress.city}
              </p>
              <div className='mt-3'>
                <Link href='/shipping-address'>
                  <Button variant='outline'>Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='gap-4 p-4'>
              <h2 className='pb-4 text-xl'>payment method</h2>
              <p>{user.paymentMethod}</p>

              <div className='mt-3'>
                <Link href='/payment-method'>
                  <Button variant='outline'>Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='gap-4 p-4'>
              <h2 className='pb-4 text-xl'>Order Items</h2>
              <DataTable columns={orderColumns} data={cart?.items || []} />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className='space-y-2 text-xs'>
              <div className='flex justify-between'>
                <div>Items</div>
                <div>{formatCurrency(Number(cart?.itemsPrice))}</div>
              </div>
              <div className='flex justify-between'>
                <div>Tax</div>
                <div>{formatCurrency(Number(cart?.taxPrice))}</div>
              </div>
              <div className='flex justify-between'>
                <div>Shipping</div>
                <div>{formatCurrency(Number(cart?.shippingPrice))}</div>
              </div>
              <Separator />
              <div className='flex justify-between'>
                <div>Total</div>
                <div>{formatCurrency(Number(cart?.totalPrice))}</div>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
