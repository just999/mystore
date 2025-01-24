import { z } from 'zod';
import { updateProfileSchema } from './profile-schema';

export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, {
    message: 'ID is required',
  }),
  role: z.string().min(1, {
    message: 'ROLE is required',
  }),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
