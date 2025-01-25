import { z } from 'zod';

export const insertReviewSchema = z.object({
  title: z.string().min(3, {
    message: 'Title must be at least 3 characters',
  }),
  description: z.string().min(3, {
    message: 'Description must be at least 3 characters',
  }),
  productId: z.string().min(3, {
    message: 'ProductId must be at least 3 characters',
  }),
  userId: z.string().min(3, {
    message: 'UserId must be at least 3 characters',
  }),
  rating: z.coerce
    .number()
    .int()
    .min(1, {
      message: 'Rating min 1',
    })
    .max(5, {
      message: 'Max rating is 5',
    }),
});

export type ReviewSchema = z.infer<typeof insertReviewSchema>;

export type InsertReviewSchema = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: Date;
  user?: { name: string };
};
