'use client';

import { OrderItem } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';

export const orderDetailColumns: ColumnDef<OrderItem>[] = [
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
  },
];
