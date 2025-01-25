import { getOrderById } from '@/actions/order-actions';
import { Button } from '@/components/ui';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Stripe from 'stripe';

type StripeSuccessPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_intent: string }>;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const StripeSuccessPage = async ({
  params,
  searchParams,
}: StripeSuccessPageProps) => {
  const { id } = await params;
  const { payment_intent: paymentIntentId } = await searchParams;

  const order = await getOrderById(id);
  if (!order) notFound();

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (
    paymentIntent.metadata.orderId === null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  ) {
    return notFound();
  }

  const isSuccess = paymentIntent.status === 'succeeded';

  if (!isSuccess) return redirect(`/order/${id}`);
  return (
    <div className='mx-auto w-full max-w-4xl space-y-8'>
      <div className='flex flex-col items-center gap-6'>
        <h1 className='h1-bold'>Thanks for your purchase</h1>
        <div>We are processing your order.</div>
        <Button asChild>
          <Link href={`/order/${id}`}>View Order</Link>
        </Button>
      </div>
    </div>
  );
};

export default StripeSuccessPage;
