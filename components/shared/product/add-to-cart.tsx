'use client';

import {
  addItemToCart,
  CartResponse,
  ErrorResponse,
  removeItemFromCart,
} from '@/actions/cart-actions';
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { CartSchema } from '@/schemas/cart-schema';
import { Loader, Minus, Plus, PlusSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

type AddToCartProps = {
  item: CartSchema;
  cart?: CartResponse | ErrorResponse;
  cartItems?: CartSchema[] | undefined;
};

const AddToCart = ({ item, cart, cartItems }: AddToCartProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const [isAddingPending, startAddTransition] = useTransition();
  const [isRemovingPending, startRemoveTransition] = useTransition();

  const handleAddToCart = async () => {
    if (!item) return;

    startAddTransition(async () => {
      const res = await addItemToCart(item);

      if (res?.error) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
        return;
      }

      toast({
        description: res.message,
        action: (
          <ToastAction
            className='bg-primary text-white hover:bg-gray-800 dark:bg-stone-600'
            altText='Go Cart'
            onClick={() => router.push('/cart')}
          >
            Go to cart
          </ToastAction>
        ),
      });
    });
  };

  const handleRemoveItemFromCart = async () => {
    startRemoveTransition(async () => {
      const res = await removeItemFromCart(item.productId, 'decrease');

      toast({
        variant: res.error ? 'destructive' : 'default',
        description: res.message,
      });
      return;
    });
  };
  const existingItem =
    cartItems && cartItems.find((x) => x.productId === item.productId);

  return existingItem ? (
    <div>
      <Button
        type='button'
        variant='outline'
        onClick={handleRemoveItemFromCart}
        disabled={isRemovingPending || isAddingPending}
      >
        {isRemovingPending ? (
          <Loader className='h-4 w-4 animate-spin' />
        ) : (
          <Minus className='h-4 w-4' />
        )}
      </Button>
      <span className='px-2'>{existingItem.qty}</span>
      <Button
        type='button'
        variant='outline'
        onClick={handleAddToCart}
        disabled={isRemovingPending || isAddingPending}
      >
        {isAddingPending ? (
          <Loader className='h-4 w-4 animate-spin' />
        ) : (
          <Plus className='h-4 w-4' />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className='w-full text-xs'
      type='button'
      onClick={handleAddToCart}
      size='sm'
      disabled={isAddingPending}
    >
      {isAddingPending ? (
        <Loader className='h-4 w-4 animate-spin' />
      ) : (
        <span className='flex items-center justify-center gap-2'>
          <PlusSquare className='h-4 w-4' /> Add
        </span>
      )}
    </Button>
  );
};

export default AddToCart;
