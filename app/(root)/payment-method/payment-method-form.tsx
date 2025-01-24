'use client';

import { updateUserPaymentMethod } from '@/actions/payment-actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useZodForm } from '@/hooks/use-zod-form';
import ClientOnlyWrapper from '@/lib/client-only-wrapper';
import {
  DEFAULT_PAYMENT_METHOD,
  PAYMENT_METHODS,
  PaymentMethodType,
} from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  PaymentMethodSchema,
  paymentMethodSchema,
} from '@/schemas/payment-methods-schema';
import { ArrowRight, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { BsCashCoin } from 'react-icons/bs';
import { MdMoneyOff } from 'react-icons/md';
import { PiStripeLogoFill } from 'react-icons/pi';
import { RiPaypalFill } from 'react-icons/ri';

type PaymentMethodFormProps = {
  paymentMethod: PaymentMethodType;
};

const PaymentMethodForm = ({ paymentMethod }: PaymentMethodFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const form = useZodForm({
    schema: paymentMethodSchema,
    mode: 'onTouched',
    defaultValues: {
      type: paymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const onSubmit = async (data: PaymentMethodSchema) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(data);
      if (res.error) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
        return;
      }

      router.push('/place-order');
    });
  };

  const getPaymentIcon = (paymentType: string) => {
    switch (paymentType) {
      case 'PayPal':
        return <RiPaypalFill className='h-4 w-4' />;
      case 'Stripe':
        return <PiStripeLogoFill className='h-4 w-4' />;
      case 'CashOnDelivery':
        return <BsCashCoin className='h-4 w-4' />;
      default:
        return <MdMoneyOff className='h-4 w-4' />;
    }
  };

  return (
    <>
      <div className='mx-auto max-w-md space-y-4'>
        <h1 className='h2-bold mt-4'>Payment Methods</h1>
        <p className='text-sm text-muted-foreground'>
          Please enter your payment
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
                name='type'
                render={({ field }) => (
                  <FormItem className='space-y-3'>
                    <FormControl>
                      <ClientOnlyWrapper>
                        <RadioGroup
                          onValueChange={field.onChange}
                          className='flex flex-col space-y-2'
                        >
                          {PAYMENT_METHODS.map((pay) => (
                            <FormItem
                              key={pay}
                              className={cn(
                                pay === 'None'
                                  ? 'hidden'
                                  : 'flex items-center space-x-3 space-y-0'
                              )}
                            >
                              <FormControl>
                                <RadioGroupItem
                                  value={pay}
                                  checked={field.value === pay}
                                  disabled={pay === 'None'}
                                />
                              </FormControl>
                              <FormLabel
                                className={cn(
                                  'flex items-center gap-2 font-normal'
                                )}
                              >
                                <span className='w-full text-right'>
                                  {getPaymentIcon(pay)}
                                </span>{' '}
                                {pay}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </ClientOnlyWrapper>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex gap-2'>
              <Button size='sm' type='submit' disabled={isPending}>
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

export default PaymentMethodForm;
