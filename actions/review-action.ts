'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { formatError } from '@/lib/utils';
import { insertReviewSchema, ReviewSchema } from '@/schemas/review-schema';

// *Create & Update Review
export async function createUpdateReview(data: ReviewSchema) {
  try {
    const session = await auth();
    if (!session) throw new Error('User is not authenticated');

    // !Validate and store review data and userId
    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user.id,
    });

    // !Get the product being reviewed
    const product = await db.product.findFirst({
      where: { id: review.productId },
    });

    if (!product) throw new Error('Product not found');

    // !Check if user has already reviewed this product
    const existingReview = await db.review.findFirst({
      where: {
        productId: review.productId,
        userId: review.userId,
      },
    });

    // !If review exists, update it, otherwise create a new one
    await db.$transaction(async (tx) => {
      if (existingReview) {
        // Update the review
        await tx.review.update({
          where: { id: existingReview.id },
          data: {
            description: review.description,
            title: review.title,
            rating: review.rating,
          },
        });
      } else {
        // !Create a new review
        await tx.review.create({ data: review });
      }

      // !Get the average rating
      const averageRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: { productId: review.productId },
      });

      // !Get the number of reviews
      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });

      // !Update rating and  number of reviews
      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews: numReviews.toString(),
        },
      });
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      error: false,
      message: 'Review updated successfully',
    };
  } catch (error) {
    return {
      error: true,
      message: formatError(error),
    };
  }
}

// *Get all reviews
export async function getReviews({ productId }: { productId: string }) {
  const data = await db.review.findMany({
    where: {
      productId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  });

  return { data };
}

// *Get a review written by the current user
export async function getReviewByProductId({
  productId,
}: {
  productId: string;
}) {
  const session = await auth();

  if (!session) throw new Error('User is not authenticated');

  return await db.review.findFirst({
    where: {
      productId,
      userId: session?.user?.id,
    },
  });
}
