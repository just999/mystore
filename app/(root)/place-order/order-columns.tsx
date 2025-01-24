'use client';

import { formatCurrency } from '@/lib/utils';
import { CartSchema } from '@/schemas/cart-schema';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';

export const orderColumns: ColumnDef<CartSchema>[] = [
  {
    accessorKey: 'name',
    header: 'Item',
    cell: ({ row }) => (
      <Link
        href={`/product/${row.original.slug}`}
        className='flex items-center'
      >
        <Image
          src={row.original.image}
          alt='image'
          width={50}
          height={50}
          className='rounded-md'
        />
        <span className='px-2'>{row.original.name}</span>
      </Link>
    ),
  },
  {
    accessorKey: 'qty',
    header: 'Quantity',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => <div>{formatCurrency(row.original.price)}</div>,
  },
];
