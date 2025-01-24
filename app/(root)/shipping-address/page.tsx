import { fetchUserById } from '@/actions/auth-actions';
import {
  CartResponse,
  ErrorResponse,
  fetchMyCart,
} from '@/actions/cart-actions';
import { auth } from '@/auth';
import CheckoutStep from '@/components/shared/checkout-step';
import { shippingAddressDefaultValues } from '@/lib/constants';
import { Cart } from '@prisma/client';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ShippingAddressForm from './shipping-address-form';

type ShippingAddressPageProps = unknown;

export const metadata: Metadata = {
  title: 'Shipping Address',
};

const ShippingAddressPage = async () => {
  const cart = await fetchMyCart();

  const isCart = (response: Cart | ErrorResponse): response is CartResponse => {
    return 'items' in response;
  };

  if (!cart || !isCart(cart) || cart.items.length === 0) redirect('/cart');

  const session = await auth();

  const userId = session?.user.id;

  if (!userId) throw new Error('Unauthenticated');

  const user = await fetchUserById(userId);
  // const shippingAddress = (await getShippingAddressByUserId(userId)) || {};
  // if (!shippingAddress || Object.keys(shippingAddress).length === 0) {
  //   return (
  //     <>
  //       <CheckoutStep current={1} />
  //       <ShippingAddressForm address={shippingAddressDefaultValues} />
  //     </>
  //   );
  // }

  return (
    <>
      <CheckoutStep current={1} />
      <ShippingAddressForm
        address={user.shippingAddress || shippingAddressDefaultValues}
      />
    </>
  );
};

export default ShippingAddressPage;
