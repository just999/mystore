import { auth } from '@/auth';
import UserButton from './shared/header/user-button';

type UserButtonWrapperProps = unknown;

const UserButtonWrapper = async () => {
  const session = await auth();
  return <UserButton session={session} />;
};

export default UserButtonWrapper;
