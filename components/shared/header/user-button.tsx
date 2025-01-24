'use client';

import { logout } from '@/actions/auth-actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { HistoryIcon, Shield, User2Icon, UserRoundPen } from 'lucide-react';
import { Session } from 'next-auth';
import Link from 'next/link';

type UserButtonProps = {
  session: Session | null;
};

const UserButton = ({ session }: UserButtonProps) => {
  const isMobile = useIsMobile();

  if (!session) {
    return (
      <Button asChild size='sm'>
        <Link href='/login' className='text-xs'>
          <User2Icon /> Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? 'U';

  if (isMobile) {
    return (
      <form action={logout} className='w-full'>
        <Button className='w-full justify-start gap-2' variant='ghost'>
          <span className='text-sm'>Signed in as {session.user?.name}</span>
        </Button>
        <Button className='mt-2 w-full justify-start' variant='secondary'>
          Sign out
        </Button>
      </form>
    );
  }

  return (
    <div className='flex items-center gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex items-center'>
            <Button
              variant='ghost'
              className='relative ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 dark:bg-stone-600'
            >
              {firstInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-36 dark:bg-stone-800'
          align='start'
          forceMount
        >
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <div className='text-xs font-medium leading-none'>
                {session.user?.name}
              </div>
              <div className='text-[8px] leading-none text-muted-foreground'>
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>
          <Separator />
          {session.user.role === 'ADMIN' && (
            <DropdownMenuItem>
              <Link
                href='/admin/overview'
                className='flex w-full items-center gap-2 text-xs dark:hover:opacity-70'
              >
                <Shield /> Admin
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <Link
              href='/user/profile'
              className='flex w-full items-center gap-2 text-xs dark:hover:opacity-70'
            >
              <UserRoundPen /> User Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href='/user/orders'
              className='flex w-full items-center gap-2 text-xs dark:hover:opacity-70'
            >
              <HistoryIcon /> order History
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className='mb-1 p-0'>
            <form action={logout} className='w-full'>
              <Button
                className='h-4 w-full justify-start px-2 py-4 dark:bg-stone-700 dark:hover:bg-stone-700/70'
                size='sm'
                variant='secondary'
              >
                <span className='mx-auto text-[10px]'>Sign out</span>
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
