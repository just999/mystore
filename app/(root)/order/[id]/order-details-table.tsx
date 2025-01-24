'use client';

import {
  approvePayPalOrder,
  createPayPalOrder,
  deliveredOrder,
  updateOrderToPaidCOD,
} from '@/actions/order-actions';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { OrderWithRelations } from '@/types/type';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { OrderItem, ShippingAddress } from '@prisma/client';
import { Loader } from 'lucide-react';
import { useTransition } from 'react';
import { orderDetailColumns } from './order-detail-columns';

// export interface OrderWithDetails extends Order {
//   shippingAddress: ShippingAddress;
//   items: OrderItem[];
// }

type OrderDetailsTableProps = {
  order: OrderWithRelations;
  address: ShippingAddress;
  orderItems: OrderItem[];
  paypalClientId: string;
  isAdmin: boolean;
};

const OrderDetailsTable = ({
  order,
  orderItems,
  address,
  paypalClientId,
  isAdmin,
}: OrderDetailsTableProps) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const {
    id,
    shippingAddressId,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();

    let status = '';
    if (isPending) {
      status = 'Loading PayPal...';
    } else if (isRejected) {
      status = 'Error Loading PayPal';
    }
    return status;
  };

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);

    if (res.error) {
      toast({
        variant: 'destructive',
        description: res.message,
      });
    }
    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);

    toast({
      variant: !res.error ? 'default' : 'destructive',
      description: res.message,
    });
  };

  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    return (
      <Button
        type='button'
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidCOD(order.id);
            toast({
              variant: !res.error ? 'default' : 'destructive',
              description: res.message,
            });
          })
        }
      >
        {isPending ? <Loader className='animate-spin' /> : 'mark as paid'}
      </Button>
    );
  };
  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    return (
      <Button
        type='button'
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliveredOrder(order.id);
            toast({
              variant: !res.error ? 'default' : 'destructive',
              description: res.message,
            });
          })
        }
      >
        {isPending ? <Loader className='animate-spin' /> : 'mark as delivered'}
      </Button>
    );
  };

  return (
    <>
      <h1 className='py-4 text-2xl'>Order {formatId(order.id)} </h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='col-span-2 space-y-4 overflow-x-auto'>
          <Card>
            <CardContent className='gap-4 p-4'>
              <h2 className='pb-4 text-xl'>Payment Methods</h2>
              <p className='mb-2'>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant='secondary'>
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant='destructive'>Not Paid</Badge>
              )}
            </CardContent>
          </Card>
          <Card className='my-2'>
            <CardContent className='gap-4 p-4'>
              <h2 className='pb-4 text-xl'>Shipping Address</h2>
              {address && (
                <>
                  <p>{address.fullName}</p>
                  <p className='mb-2'>
                    {address.streetAddress}, {address.city} {address.postalCode}
                    , {address.country}
                  </p>
                </>
              )}
              {isDelivered ? (
                <Badge variant='secondary'>
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant='destructive'>Not Delivered</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className='gap-4 p-4'>
              <h2 className='pb-4 text-xl'>Order Items</h2>
              <DataTable columns={orderDetailColumns} data={orderItems} />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className='space-y-2 py-2 text-xs'>
              <div className='flex justify-between'>
                <div>Items</div>
                <div>{formatCurrency(Number(itemsPrice))}</div>
              </div>
              <div className='flex justify-between'>
                <div>Tax</div>
                <div>{formatCurrency(Number(taxPrice))}</div>
              </div>
              <div className='flex justify-between'>
                <div>Shipping</div>
                <div>{formatCurrency(Number(shippingPrice))}</div>
              </div>
              <Separator />
              <div className='flex justify-between'>
                <div>Total</div>
                <div>{formatCurrency(Number(totalPrice))}</div>
              </div>
              {/* <PlaceOrderForm /> */}

              {!isPaid && paymentMethod === 'PayPal' && (
                <div>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState />

                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
                <MarkAsPaidButton />
              )}
              {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
