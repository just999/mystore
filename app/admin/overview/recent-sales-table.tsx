'use client';

import { DataTable } from '@/components/data-table';
import { LatestSalesProps } from '@/types/type';
import { recentSalesColumns } from './recent-sales-columns';

type RecentSalesTableProps = {
  latestSales: LatestSalesProps[];
};

const RecentSalesTable = ({ latestSales }: RecentSalesTableProps) => {
  return <DataTable data={latestSales} columns={recentSalesColumns} />;
};

export default RecentSalesTable;
