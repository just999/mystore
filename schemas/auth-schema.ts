import { z } from 'zod';

// *REGISTER SCHEMA

export const registerSchema = z
  .object({
    name: z.string().min(3, {
      message: 'Name must be 3 characters long',
    }),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, {
      message: 'Must be 6 digits characters',
    }),
    passwordConfirm: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['passwordConfirm'],
        message: 'Password Not Matched',
      });
    }
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

// *LOGIN SCHEMA
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, {
    message: 'Must be 6 digits characters',
  }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
