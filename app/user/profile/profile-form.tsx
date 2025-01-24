'use client';

import { updateUserProfile } from '@/actions/user-actions';
import { Input } from '@/components/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useZodForm } from '@/hooks/use-zod-form';
import {
  UpdateProfileSchema,
  updateProfileSchema,
} from '@/schemas/profile-schema';
import { LoaderPinwheel } from 'lucide-react';
import { getSession, useSession } from 'next-auth/react';

type ProfileFormProps = unknown;

const ProfileForm = () => {
  const { data: session, update, status } = useSession();
  const { toast } = useToast();

  const form = useZodForm({
    schema: updateProfileSchema,
    mode: 'onTouched',
    defaultValues: {
      name: session?.user.name ?? '',
      email: session?.user.email ?? '',
    },
  });

  const onSubmit = async (data: UpdateProfileSchema) => {
    const res = await updateUserProfile(data);

    if (res.error) {
      return toast({
        variant: 'destructive',
        description: res.message,
      });
    }

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: data.name,
      },
    };

    await update(newSession);

    console.log('Updated session:', await getSession());

    toast({
      variant: 'default',
      description: res.message,
    });
  };

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-5'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex flex-col gap-5'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input
                    disabled
                    className='input-field'
                    placeholder='email'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input
                    className='input-field'
                    placeholder='name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type='submit'
          size='sm'
          className='button col-span-2 w-full'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <LoaderPinwheel className='animate-spin' />
          ) : (
            'update profile'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
