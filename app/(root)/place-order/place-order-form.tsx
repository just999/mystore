'use client';

import { createOrder } from '@/actions/order-actions';
import { Button } from '@/components/ui/button';
import { Check, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';

type PlaceOrderFormProps = unknown;

const PlaceOrderForm = () => {
  const router = useRouter();

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button type='submit' disabled={pending} className='w-full'>
        {pending ? (
          <Loader className='h-4 w-4 animate-spin' />
        ) : (
          <Check className='h-4 w-4' />
        )}{' '}
        Order
      </Button>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await createOrder();
    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
