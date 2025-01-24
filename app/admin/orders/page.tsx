import { getAllOrders } from '@/actions/order-actions';
import UserOrdersTable from '@/app/user/orders/user-orders-table';
import { auth } from '@/auth';
import { Button } from '@/components/ui';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin Orders ',
};

type AdminOrdersPageProps = {
  searchParams: Promise<{ page: string; query: string }>;
};

const AdminOrdersPage = async ({ searchParams }: AdminOrdersPageProps) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const searchText = params.query || '';

  const session = await auth();
  if (session?.user.role !== 'ADMIN') {
    redirect('/');
  }

  const orders = await getAllOrders({
    page: Number(page),
    query: searchText,
  });
  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-3'>
        <h1 className='h2-bold'>Orders</h1>
        {searchText && (
          <div className='flex w-full items-center gap-4'>
            <span>
              Filtered by <i>&quot;{searchText}&quot;</i>
            </span>
            <Link href='/admin/orders'>
              <Button variant='outline' size='sm'>
                Remove Filter
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className='overflow-x-auto'>
        <UserOrdersTable
          orders={orders.data}
          totalPages={orders.totalPages}
          page={page}
        />
      </div>
    </div>
  );
};

export default AdminOrdersPage;
