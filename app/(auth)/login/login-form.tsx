'use client';

import { login } from '@/actions/auth-actions';
import { Input, PasswordInput } from '@/components/input';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { loginDefaultValues } from '@/lib/constants';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

type LoginFormProps = unknown;

const LoginForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, action] = useActionState(login, {
    error: true,
    message: '',
  });
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  useEffect(() => {
    if (!data.error && callbackUrl) {
      router.push(callbackUrl);
    }
  }, [callbackUrl, data.error, router]);

  const LoginButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className='w-full' variant='happy'>
        {pending ? 'Logging In...' : 'Login'}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type='hidden' name='callbackUrl' defaultValue={callbackUrl} />
      <div className='space-y-6'>
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            type='email'
            suffix={
              <Mail size={18} className='absolute right-2 text-zinc-400' />
            }
            required
            autoComplete='email'
            defaultValue={loginDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor='email'>Password</Label>
          <PasswordInput
            id='password'
            name='password'
            required
            autoComplete='password'
            defaultValue={loginDefaultValues.password}
          />
        </div>
        <div>
          <LoginButton />
        </div>
        {data && data.error && (
          <div className='text-center text-destructive'>{data.message}</div>
        )}
        <div className='text-center text-sm text-muted-foreground'>
          Don&apos;t have an account? &nbsp;
          <Link
            href='/register'
            target='_self'
            className='link text-blue-600 underline dark:text-sky-700'
          >
            Register
          </Link>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
