import { formatCurrency, formatDateTime } from '@/lib/utils';
import { LatestSalesProps } from '@/types/type';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const recentSalesColumns: ColumnDef<LatestSalesProps>[] = [
  {
    accessorKey: 'user',
    header: 'Buyer',
    cell: ({ row }) => <div>{row.original.user.name || 'Deleted User'}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => (
      <div>{formatDateTime(row.original.createdAt).dateOnly}</div>
    ),
  },
  {
    accessorKey: 'totalPrice',
    header: 'Total Price',
    cell: ({ row }) => <div>{formatCurrency(row.original.totalPrice)}</div>,
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => (
      <Link href={`/order/${row.original.id}`}>
        <span className='px-2'>Details</span>
      </Link>
    ),
  },
];
