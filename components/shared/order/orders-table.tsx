'use client';

import { DataTable } from '@/components/data-table';
import { OrderWithRelations } from '@/types/type';
import { OrdersColumns } from './order-columns';

type OrdersTableProps = {
  orders: OrderWithRelations[];
  totalPages?: number;
  page?: number | string;
};

const OrdersTable = ({ orders, totalPages, page }: OrdersTableProps) => {
  return (
    <DataTable
      columns={OrdersColumns}
      data={orders}
      totalPages={totalPages}
      page={page}
    />
  );
};

export default OrdersTable;
