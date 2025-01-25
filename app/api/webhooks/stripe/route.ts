import { updateOrderToPaid } from '@/actions/order-actions';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const event = await Stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get('stripe-signature') as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
    if (event.type === 'charge.succeeded') {
      const { object } = event.data;

      await updateOrderToPaid({
        orderId: object.metadata.orderId,
        paymentResult: {
          paymentId: object.id,
          status: 'COMPLETED',
          email_address: object.billing_details.email!,
          pricePaid: (object.amount / 100).toFixed(2),
        },
      });
      return NextResponse.json({
        message: 'updateOrderToPaid was successful',
      });
    }
    return NextResponse.json({
      message: 'event is not charge.succeeded',
    });
  } catch (err) {
    console.log('⚠︎ Webhook signature verification failed.', err);
    return NextResponse.json({
      message: 'something went wrong',
    });
  }
}
