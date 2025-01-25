'use client';

import {
  createUpdateReview,
  getReviewByProductId,
} from '@/actions/review-action';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  Textarea,
} from '@/components/ui';
import { useToast } from '@/hooks/use-toast';
import { useZodForm } from '@/hooks/use-zod-form';
import { reviewFormDefaultValues } from '@/lib/constants';
import { insertReviewSchema, ReviewSchema } from '@/schemas/review-schema';
import { Loader, StarIcon } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

type ReviewFormProps = {
  userId: string;
  productId: string;
  onReviewSubmitted: () => void;
};

const ReviewForm = ({
  userId,
  productId,
  onReviewSubmitted,
}: ReviewFormProps) => {
  console.log('🚀 ~ productId:', productId);
  console.log('🚀 ~ userId:', userId);

  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useZodForm({
    schema: insertReviewSchema,
    mode: 'onTouched',
    defaultValues: reviewFormDefaultValues,
  });

  const handleOpenForm = async () => {
    form.setValue('productId', productId);
    form.setValue('userId', userId);

    const review = await getReviewByProductId({ productId });

    if (review) {
      form.setValue('title', review.title);
      form.setValue('description', review.description);
      form.setValue('rating', Number(review.rating));
    }

    setOpen(true);
  };

  const onSubmit: SubmitHandler<ReviewSchema> = async (values) => {
    const res = await createUpdateReview({
      ...values,
      productId,
    });

    if (res.error)
      return toast({
        variant: 'destructive',
        description: res.message,
      });

    setOpen(false);

    onReviewSubmitted();
    toast({
      description: res.message,
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant='default' onClick={handleOpenForm}>
        Write a review
      </Button>

      <DialogContent className='sm:max-w-[425px]'>
        <Form {...form}>
          <form method='post' onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share Your Thought with other customers
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>title</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter title' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>description</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Enter description' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='rating'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>rating</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a rating' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>
                            <span className='flex items-center gap-2'>
                              {' '}
                              {i + 1}{' '}
                              <StarIcon size={16} className='inline h-4 w-4' />
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type='submit'
                size='lg'
                className='w-full'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader className='animate-spin' />
                ) : (
                  'Submit'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
