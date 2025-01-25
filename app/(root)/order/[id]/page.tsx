import { getOrderById } from '@/actions/order-actions';
import { auth } from '@/auth';
import { ShippingAddressSchema } from '@/schemas/shipping-address-schema';
import { PaymentResult } from '@/types/type';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Stripe from 'stripe';
import OrderDetailsTable from './order-details-table';

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Order Details',
};

const OrderDetailPage = async ({ params }: OrderDetailPageProps) => {
  const { id } = await params;

  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

  let client_secret = null;

  // Check if is not paid and using stripe
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'USD',
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddressSchema,
        paymentResult: order.paymentResult as unknown as PaymentResult,
      }}
      stripeClientSecret={client_secret}
      orderItems={order.orderitems}
      address={order.shippingAddress}
      paypalClientId={process.env.PAYPAL_CLIENT_ID!}
      isAdmin={session?.user.role === 'ADMIN' || false}
    />
  );
};

export default OrderDetailPage;
