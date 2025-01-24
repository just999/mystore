'use client';

import { updateUser } from '@/actions/user-actions';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { useToast } from '@/hooks/use-toast';
import { useZodForm } from '@/hooks/use-zod-form';
import { USER_ROLES } from '@/lib/constants';
import { updateUserSchema, UpdateUserSchema } from '@/schemas/user-schema';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';

type UpdateUserFormProps = {
  user: UpdateUserSchema;
};

const UpdateUserForm = ({ user }: UpdateUserFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useZodForm({
    schema: updateUserSchema,
    mode: 'onTouched',
    defaultValues: user,
  });

  const onSubmit = async (data: UpdateUserSchema) => {
    try {
      const res = await updateUser({
        ...data,
        id: user.id,
      });

      if (res.error) {
        return toast({
          variant: 'destructive',
          description: res.message,
        });
      }

      toast({
        description: res.message,
      });

      form.reset();
      router.push('/admin/users');
    } catch (error) {
      toast({
        variant: 'destructive',
        description: (error as Error).message,
      });
    }
  };
  return (
    <Form {...form}>
      <form method='POST' onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled={true} placeholder='Enter email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a role' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex-between'>
          <Button
            type='submit'
            className='mt-4 w-full'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? <Loader /> : 'Update User'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateUserForm;
