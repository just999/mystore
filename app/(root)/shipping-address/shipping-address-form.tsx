'use client';

import { ErrorResponse } from '@/actions/cart-actions';
import { updateShippingAddress } from '@/actions/user-actions';
import { Input } from '@/components/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useZodForm } from '@/hooks/use-zod-form';
import { shippingAddressDefaultValues } from '@/lib/constants';
import {
  ShippingAddressSchema,
  shippingAddressSchema,
} from '@/schemas/shipping-address-schema';
import { ShippingAddress } from '@prisma/client';
import { ArrowRight, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useState, useTransition } from 'react';
import { SubmitHandler } from 'react-hook-form';

type ShippingAddressFormProps = {
  address: ShippingAddress[] | ErrorResponse;
};

const ShippingAddressForm = ({ address }: ShippingAddressFormProps) => {
  const [userAddress, setUserAddress] = useState(
    'error' in address ? shippingAddressDefaultValues : address[0]
  );
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const form = useZodForm({
    schema: shippingAddressSchema,
    mode: 'onTouched',
    defaultValues: userAddress || shippingAddressDefaultValues,
  });

  if ('error' in address) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: address.message,
    });
    return null;
  }

  const onSubmit: SubmitHandler<ShippingAddressSchema> = async (data) => {
    startTransition(async () => {
      const res = await updateShippingAddress(data);

      if (res.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: res.message,
        });
        return;
      }

      toast({
        title: 'Success',
        description: res.message,
      });
      router.push('/payment-method');
    });
  };

  return (
    <>
      <div className='mx-auto max-w-md space-y-4'>
        <h1 className='h2-bold mt-4'>Shipping Address</h1>
        <p className='text-sm text-muted-foreground'>
          Please enter an address to ship to
        </p>
        <Form {...form}>
          <form
            method='post'
            className='space-y-4'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='flex flex-col gap-5 md:flex-row'>
              <FormField
                control={form.control}
                name='fullName'
                render={(
                  { field }
                  // : {
                  //   field: ControllerRenderProps<
                  //     z.infer<typeof shippingAddressSchema>,
                  //     'fullName'
                  //   >;
                  // }
                ) => (
                  <FormItem className='w-full'>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder='Full name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col gap-5 md:flex-row'>
              <FormField
                control={form.control}
                name='streetAddress'
                render={(
                  { field }
                  // : {
                  //   field: ControllerRenderProps<
                  //     ShippingAddressSchema,
                  //     'streetAddress'
                  //   >;
                  // }
                ) => (
                  <FormItem className='w-full'>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder='Address' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col gap-5 md:flex-row'>
              <FormField
                control={form.control}
                name='city'
                render={(
                  { field }
                  // : {
                  //   field: ControllerRenderProps<ShippingAddressSchema, 'city'>;
                  // }
                ) => (
                  <FormItem className='w-full'>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder='city' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col gap-5 md:flex-row'>
              <FormField
                control={form.control}
                name='postalCode'
                render={(
                  { field }
                  // : {
                  //   field: ControllerRenderProps<
                  //     ShippingAddressSchema,
                  //     'postalCode'
                  //   >;
                  // }
                ) => (
                  <FormItem className='w-full'>
                    <FormLabel>PostalCode</FormLabel>
                    <FormControl>
                      <Input placeholder='postalCode' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col gap-5 md:flex-row'>
              <FormField
                control={form.control}
                name='country'
                render={(
                  { field }
                  // : {
                  //   field: ControllerRenderProps<
                  //     ShippingAddressSchema,
                  //     'country'
                  //   >;
                  // }
                ) => (
                  <FormItem className='w-full'>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder='country' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex gap-2'>
              <Button type='submit' disabled={isPending}>
                {isPending ? (
                  <Loader className='h-4 w-4 animate-spin' />
                ) : (
                  <span className='flex items-center justify-center gap-2'>
                    <ArrowRight className='h-4 w-4' />
                  </span>
                )}{' '}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ShippingAddressForm;
