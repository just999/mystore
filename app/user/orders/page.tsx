import { getMyOrders } from '@/actions/order-actions';
import OrdersTable from '@/components/shared/order/orders-table';
import { Metadata } from 'next';

type OrdersPageProps = {
  searchParams: Promise<{ page: string }>;
};

export const metadata: Metadata = {
  title: 'My Order',
};

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const { page } = await searchParams;
  const orders = await getMyOrders({
    page: Number(page) || 1,
  });
  return (
    <div className='space-y-2'>
      <h2 className='h2-bold'>
        <div className='overflow-x-auto'>
          <OrdersTable
            orders={orders.data}
            totalPages={orders.totalPages}
            page={page}
          />
        </div>
      </h2>
    </div>
  );
};

export default OrdersPage;
