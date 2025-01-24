import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters',
  }),
  email: z.string().min(3, {
    message: 'Email must be at least 3 characters',
  }),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
