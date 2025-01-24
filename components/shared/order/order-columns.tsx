import { formatCurrency, formatDateTime } from '@/lib/utils';
import { OrderSchema } from '@/schemas/order-schema';
import { ColumnDef } from '@tanstack/react-table';
import OrdersAction from './orders-action';

export const OrdersColumns: ColumnDef<OrderSchema>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => (
      <div>{formatDateTime(row.original.createdAt).dateTime}</div>
    ),
  },
  {
    accessorKey: 'totalPrice',
    header: 'Total',
    cell: ({ row }) => <div>{formatCurrency(row.original.totalPrice)}</div>,
  },
  {
    accessorKey: 'isPaid',
    header: 'Paid',
    cell: ({ row }) => (
      <div>
        {row.original.isPaid && row.original.paidAt
          ? formatDateTime(row.original.paidAt).dateTime
          : 'Not Paid'}
      </div>
    ),
  },
  {
    accessorKey: 'isDelivered',
    header: 'Delivered',
    cell: ({ row }) => (
      <div>
        {row.original.isDelivered && row.original.deliveredAt
          ? formatDateTime(row.original.deliveredAt).dateTime
          : 'Not Delivered'}
      </div>
    ),
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => <OrdersAction data={row.original} />,
  },
];
