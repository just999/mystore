import { getOrderSummary } from '@/actions/order-actions';
import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { OrderSummaryResult } from '@/types/type';
import { BadgeDollarSign, BarcodeIcon, CreditCard, User2 } from 'lucide-react';
import { Metadata } from 'next';
import Charts from './charts';
import RecentSalesTable from './recent-sales-table';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

type AdminOverviewPageProps = unknown;

const AdminOverviewPage = async () => {
  const session = await auth();

  if (session?.user.role !== 'ADMIN') {
    throw new Error('Not Authorized');
  }

  const summary: OrderSummaryResult = await getOrderSummary();

  return (
    <div className='space-y-2'>
      <h1 className='h2-bold'>Dashboard</h1>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <BadgeDollarSign />
          </CardHeader>

          <CardContent>
            <div>{formatCurrency(summary.totalSales).toString() || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Sales</CardTitle>
            <CreditCard />
          </CardHeader>

          <CardContent>{formatNumber(summary.ordersCount)}</CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Customers</CardTitle>
            <User2 />
          </CardHeader>

          <CardContent>{formatNumber(summary.usersCount)}</CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Products</CardTitle>
            <BarcodeIcon />
          </CardHeader>

          <CardContent>{formatNumber(summary.productsCount)}</CardContent>
        </Card>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts data={{ salesData: summary.salesData }} />
          </CardContent>
        </Card>
        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSalesTable latestSales={summary.latestSales} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
