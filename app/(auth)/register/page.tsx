import { auth } from '@/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import RegisterForm from './register-form';

type SignUpPageProps = {
  searchParams: Promise<{ callbackUrl: string }>;
};

export const metadata: Metadata = {
  title: 'Sign Up',
};

const SignUpPage = async ({ searchParams }: SignUpPageProps) => {
  const { callbackUrl } = await searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || '/');
  }
  return (
    <div className='mx-auto flex h-screen w-full max-w-md flex-col justify-center'>
      <Card className='shadow-lg'>
        <CardHeader className='flex gap-4'>
          <div className='flex items-center justify-center gap-2'>
            <Link href='/' className='flex-center'>
              <Image
                priority={true}
                src='/images/log.svg'
                alt='logo'
                width={28}
                height={28}
                className='rounded-full opacity-60'
              />
            </Link>
            <CardTitle className='text-center'>Registration</CardTitle>
          </div>
          <CardDescription className='text-center text-stone-400'>
            Enter your Info to Register
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
