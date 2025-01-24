import { fetchMyCart } from '@/actions/cart-actions';
import CartTable from './cart-table';

export const metadata = {
  title: 'Shopping Cart',
};

const CartPage = async () => {
  const cart = await fetchMyCart();
  // if (cart && 'error' in cart) {
  //   return <div className='p-4 text-red-500'>{cart.message}</div>;
  // }

  if (!cart) {
    return <div className='p-4'>Your cart is empty</div>;
  }

  return (
    <>
      <CartTable cart={cart} cartItems={cart.items} />
    </>
  );
};

export default CartPage;
