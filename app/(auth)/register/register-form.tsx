'use client';

import { register } from '@/actions/auth-actions';
import { Input, PasswordInput } from '@/components/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { registerDefaultValues } from '@/lib/constants';

import { Mail, User2Icon } from 'lucide-react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

const RegisterForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [data, action] = useActionState(register, {
    error: true,
    message: '',
  });
  useEffect(() => {
    if (!data.error && callbackUrl) {
      router.push(callbackUrl);
    }
  }, [callbackUrl, data.error, router]);

  const RegisterButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className='w-full' variant='happy'>
        {pending ? 'Logging In...' : 'Register'}
      </Button>
    );
  };
  return (
    <form action={action} className='text-xs'>
      <input type='hidden' name='callbackUrl' defaultValue={callbackUrl} />
      <div className='space-y-6'>
        <div>
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            name='name'
            type='text'
            suffix={
              <User2Icon size={18} className='absolute right-2 text-zinc-400' />
            }
            required
            autoComplete='name'
            defaultValue={registerDefaultValues.name}
          />
        </div>
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
            defaultValue={registerDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor='email'>Password</Label>
          <PasswordInput
            id='password'
            name='password'
            required
            autoComplete='password'
            defaultValue={registerDefaultValues.password}
          />
        </div>
        <div>
          <Label htmlFor='email'>Password Confirm</Label>
          <PasswordInput
            id='passwordConfirm'
            name='passwordConfirm'
            required
            autoComplete='password'
            defaultValue={registerDefaultValues.passwordConfirm}
          />
        </div>
        <div>
          <RegisterButton />
        </div>
        {data && data.error && (
          <div className='text-center text-destructive'>{data.message}</div>
        )}
        <div className='text-center text-sm text-muted-foreground'>
          Don&apos;t have an account? &nbsp;
          <Link
            href='/login'
            target='_self'
            className='link text-blue-600 underline dark:text-sky-700'
          >
            Login
          </Link>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
