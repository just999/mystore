'use client';

import { getReviews } from '@/actions/review-action';
import Rating from '@/components/shared/product/rating';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { formatDateTime } from '@/lib/utils';
import { InsertReviewSchema } from '@/schemas/review-schema';
import { Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReviewForm from './review-form';

type ReviewListProps = {
  userId: string;
  productId: string;
  productSlug: string;
};

const ReviewList = ({ userId, productId, productSlug }: ReviewListProps) => {
  const [reviews, setReviews] = useState<InsertReviewSchema[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      const res = await getReviews({ productId });
      setReviews(res.data);
    };

    loadReviews();
  }, [productId]);

  const reload = async () => {
    const res = await getReviews({ productId });

    setReviews([...res.data]);
  };
  return (
    <div className='space-y-4'>
      {reviews.length === 0 && <div>No reviews yet</div>}
      {userId ? (
        <ReviewForm
          userId={userId}
          productId={productId}
          onReviewSubmitted={reload}
        />
      ) : (
        <div className='flex items-center gap-2'>
          Please{' '}
          <Link
            className='text-blue-600 underline'
            href={`/login?callbackUrl=/product/${productSlug}`}
          >
            sign-in
          </Link>
          <span>to write a review</span>
        </div>
      )}

      <div className='flex flex-col gap-3'>
        {reviews.map((rev) => (
          <Card key={rev.id}>
            <CardHeader>
              <div className='flex-between'>
                <CardTitle>{rev.title}</CardTitle>
              </div>
              <CardDescription>{rev.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex space-x-4 text-sm text-muted-foreground'>
                <Rating value={rev.rating} />
                <div className='flex items-center'>
                  <User className='mr-1 h-3 w-3' />
                  {rev.user ? rev.user.name : 'User'}
                </div>
                <div className='flex items-center'>
                  <Calendar className='mr-1 h-3 w-3' />
                  {formatDateTime(rev.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
