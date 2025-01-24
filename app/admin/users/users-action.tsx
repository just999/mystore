'use client';

import { deleteUser } from '@/actions/user-actions';
import DeleteDialog from '@/components/shared/delete-dialog';
import { Button } from '@/components/ui';
import { User } from '@prisma/client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

type UsersActionProps = {
  data: User;
};

const UsersAction = ({ data }: UsersActionProps) => {
  const { data: session } = useSession();
  const userRole = session?.user.role;
  return (
    <div className='flex items-center'>
      <Button asChild variant='outline' size='sm'>
        <Link href={`/admin/users/${data.id}`}>Details</Link>
      </Button>
      {userRole && userRole === 'ADMIN' && (
        <DeleteDialog id={data.id} action={deleteUser} />
      )}
    </div>
  );
};

export default UsersAction;
