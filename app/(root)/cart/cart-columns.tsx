'use client';

import { removeItemFromCart } from '@/actions/cart-actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CartSchema } from '@/schemas/cart-schema';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Loader, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTransition } from 'react';

type QuantityControlProps = {
  row: Row<CartSchema>;
};

type CartAction = 'increase' | 'decrease';

const QuantityControl = ({ row }: QuantityControlProps) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleQuantityChange = (action: CartAction) => {
    startTransition(async () => {
      const res = await removeItemFromCart(row.original.productId, action);

      if (res.error) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      }
    });
  };

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='outline'
        size='sm'
        disabled={isPending}
        onClick={() => handleQuantityChange('decrease')}
      >
        {isPending ? (
          <Loader className='h-4 w-4' />
        ) : (
          <span className='flex items-center justify-center gap-2'>
            <Minus className='h-4 w-4' />
          </span>
        )}
      </Button>

      <span className='w-8 text-center'>{row.original.qty}</span>

      <Button
        variant='outline'
        size='sm'
        disabled={isPending}
        onClick={() => handleQuantityChange('increase')}
      >
        {isPending ? (
          <Loader className='h-4 w-4 animate-spin' />
        ) : (
          <span className='flex items-center justify-center gap-2'>
            <Plus className='h-4 w-4' />
          </span>
        )}
      </Button>
    </div>
  );
};

export const cartColumns: ColumnDef<CartSchema>[] = [
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
          alt={row.original.name}
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
    cell: ({ row }) => <QuantityControl row={row} />,
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => (
      <div>${(+row.original.price * +row.original.qty).toFixed(2)}</div>
    ),
  },
];
