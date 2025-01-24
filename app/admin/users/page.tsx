import { getAllUsers } from '@/actions/user-actions';
import { Button } from '@/components/ui';

import { Metadata } from 'next';
import Link from 'next/link';
import UsersTable from './users-table';

export const metadata: Metadata = {
  title: 'Admin users',
};

type AdminUsersPageProps = {
  searchParams: Promise<{ page: string; query: string }>;
};

const AdminUsersPage = async ({ searchParams }: AdminUsersPageProps) => {
  const { page = '1', query: searchText } = await searchParams;
  const users = await getAllUsers({ page: Number(page), query: searchText });
  console.log('🚀 ~ AdminUsersPage ~ users:', users);
  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-3'>
        <h1 className='h2-bold'>Users</h1>
        {searchText && (
          <div className='flex w-full items-center gap-4'>
            <span>
              Filtered by <i>&quot;{searchText}&quot;</i>
            </span>
            <Link href='/admin/users'>
              <Button variant='outline' size='sm'>
                Remove Filter
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className='overflow-x-auto'>
        <UsersTable
          users={users.data}
          page={+page}
          totalPages={users.totalPages}
        />
      </div>
    </div>
  );
};

export default AdminUsersPage;
