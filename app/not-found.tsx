'use client';

import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { Undo2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type NotFoundPageProps = unknown;

const NotFound = () => {
  const router = useRouter();
  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <Image
        src='/images/log.svg'
        alt={`${APP_NAME} logo`}
        width={48}
        height={48}
        priority={true}
      />
      <div className='w-1/3 rounded-lg p-6 text-center shadow-md'>
        <h1 className='mb-4 text-3xl font-bold text-destructive'>Not Found</h1>
        <p className='underline'>Back to Previous Page...?</p>
        <Button
          variant='outline'
          className='ml-2 mt-4'
          onClick={() => router.back()}
          // onClick={() => (window.location.href = '/')}
        >
          <Undo2 /> Back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
