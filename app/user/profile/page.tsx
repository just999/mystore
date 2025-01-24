import { auth } from '@/auth';
import { Metadata } from 'next';
import ProfileForm from './profile-form';

const metadata: Metadata = {
  title: 'Profile',
};

type ProfilePageProps = unknown;

const ProfilePage = async () => {
  const session = await auth();
  return (
    <div className='mx-auto max-w-md space-y-4'>
      <h2 className='h2-bold'>Profile</h2>
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;
