'use client';

import { DataTable } from '@/components/data-table';
import { OrderWithRelations } from '@/types/type';
import { userOrdersColumns } from './user-orders-columns';

type UserOrdersTableProps = {
  orders: OrderWithRelations[];
  totalPages?: number;
  page?: number | string;
};

const UserOrdersTable = ({
  orders,
  totalPages,
  page,
}: UserOrdersTableProps) => {
  return (
    <DataTable
      columns={userOrdersColumns}
      data={orders}
      totalPages={totalPages}
      page={page}
    />
  );
};

export default UserOrdersTable;
