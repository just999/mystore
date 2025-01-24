import { fetchUserById } from '@/actions/auth-actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UpdateUserForm from './update-user-form';

export const metadata: Metadata = {
  title: 'Update user',
};

type AdminUsersDetailPageProps = {
  params: Promise<{ id: string }>;
};

const AdminUsersDetailPage = async ({ params }: AdminUsersDetailPageProps) => {
  const { id } = await params;

  const user = await fetchUserById(id);
  if (!user) return notFound();

  console.log('🚀 ~ AdminUsersDetailPage ~ user:', user);
  return (
    <div className='mx-auto max-w-lg space-y-8'>
      <h1 className='h2-bold'>Update User</h1>
      <UpdateUserForm user={user} />
    </div>
  );
};

export default AdminUsersDetailPage;
