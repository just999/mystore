import { getOrderById } from '@/actions/order-actions';
import { auth } from '@/auth';
import { ShippingAddressSchema } from '@/schemas/shipping-address-schema';
import { PaymentResult } from '@/types/type';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
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

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddressSchema,
        paymentResult: order.paymentResult as unknown as PaymentResult,
      }}
      orderItems={order.orderitems}
      address={order.shippingAddress}
      paypalClientId={process.env.PAYPAL_CLIENT_ID!}
      isAdmin={session?.user.role === 'ADMIN' || false}
    />
  );
};

export default OrderDetailPage;
