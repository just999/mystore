'use client';

import { deleteOrderByAdmin } from '@/actions/order-actions';
import DeleteDialog from '@/components/shared/delete-dialog';
import { Button } from '@/components/ui/button';
import { OrderSchema } from '@/schemas/order-schema';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

type OrdersActionProps = {
  data: OrderSchema;
};

const OrdersAction = ({ data }: OrdersActionProps) => {
  const { data: session } = useSession();
  const userRole = session?.user.role;
  return (
    <div className='flex items-center'>
      <Button asChild variant='outline' size='sm'>
        <Link href={`/order/${data.id}`}>Details</Link>
      </Button>
      {userRole && userRole === 'ADMIN' && (
        <DeleteDialog id={data.id} action={deleteOrderByAdmin} />
      )}
    </div>
  );
};

export default OrdersAction;
