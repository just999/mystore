import { fetchUserById } from '@/actions/auth-actions';
import { auth } from '@/auth';
import CheckoutStep from '@/components/shared/checkout-step';
import { Metadata } from 'next';
import PaymentMethodForm from './payment-method-form';

type PaymentMethodPageProps = unknown;

export const metadata: Metadata = {
  title: 'Select Payment Methods',
};

const PaymentMethodPage = async () => {
  const session = await auth();

  const userId = session?.user.id;
  if (!userId) throw new Error('User not found');

  const user = await fetchUserById(userId);

  return (
    <>
      <CheckoutStep current={2} />
      <PaymentMethodForm paymentMethod={user.paymentMethod} />
    </>
  );
};

export default PaymentMethodPage;
