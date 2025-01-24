import { formatCurrency, formatId } from '@/lib/utils';
import { Product } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import ProductAction from './product-action';

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'index',
    header: 'No.',
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: 'id',
    header: 'Id',
    cell: ({ row }) => <div>{formatId(row.original.id)}</div>,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'price',
    header: () => <div className='text-right'>Price</div>,
    cell: ({ row }) => (
      <div className='text-right'>{formatCurrency(row.original.price)}</div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
  },
  {
    id: 'action',
    header: 'action',
    cell: ({ row }) => <ProductAction data={row.original} />,
  },
];
