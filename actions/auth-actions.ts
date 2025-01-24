'use server';

import { auth, signIn, signOut } from '@/auth';
import { loginSchema, registerSchema } from '@/schemas/auth-schema';

import { cache } from 'react';

export const getUserId = cache(async () => {
  const session = await auth();

  return session?.user?.id ? (session.user.id as string) : undefined;
});

import { db } from '@/lib/db';
import { formatError } from '@/lib/utils';
import { ShippingAddress, User } from '@prisma/client';
import { hashSync } from 'bcrypt-ts-edge';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { ErrorResponse } from './cart-actions';

export async function login(prevState: unknown, formData: FormData) {
  try {
    const userId = await getUserId();

    if (userId) {
      return {
        error: true,
        message: 'You are already logged in',
      };
    }

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const validated = loginSchema.parse(data);

    const res = await signIn('credentials', {
      ...validated,
      redirect: false,
    });

    if (!res) {
      return {
        error: true,
        message: 'Authentication failed',
      };
    }

    if (res.error) {
      return {
        error: true,
        message: res.error,
      };
    }

    // Return success status instead of redirecting
    revalidatePath('/login');
    return {
      error: false,
      message: 'Login successful',
      redirect: '/', // Include the redirect path in the response
    };
  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof AuthError) {
      return {
        error: true,
        message: 'Authentication failed: ' + error.message,
      };
    }

    if (error instanceof Error) {
      return {
        error: true,
        message: error.message,
      };
    }
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      error: true,
      message: 'An unexpected error occurred',
    };
  }
}
// USER SIGNOUT
export const logout = async () => {
  await signOut();
};

export async function register(prevState: unknown, formData: FormData) {
  try {
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      passwordConfirm: formData.get('passwordConfirm'),
    };
    const user = registerSchema.parse(data);

    const plainPassword = user.password;

    user.password = hashSync(user.password, 12);

    await db.user.create({
      data: {
        name: user.name,
        email: user.email,
        hashedPassword: user.password,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
      redirect: false,
    });

    return {
      error: false,
      message: 'Successfully create new User',
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    // Log unexpected errors
    // console.error('Unexpected error:', error);

    return {
      error: true,
      message: formatError(error),
    };
  }
}

type UserExtended = User & {
  shippingAddress: ShippingAddress | unknown;
};

export const getUserById = async (
  id: string
): Promise<UserExtended | ErrorResponse | undefined> => {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        shippingAddress: true,
      },
    });

    if (!user) {
      return {
        error: true,
        message: 'user not found',
      };
    }
    return user as UserExtended;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to get user: ${err.message}`);
    }

    return {
      error: true,
      message: 'something went wrong',
    };
  }
};

export async function fetchUserById(userId: string) {
  const user = await db.user.findFirst({
    where: { id: userId },
    include: {
      shippingAddress: true,
    },
  });

  if (!user) throw new Error('User not found');

  return user;
}

export const getAuthUser = cache(async () => {
  const userId = await getUserId();
  if (!userId) {
    return {
      error: true,
      message: 'Unauthenticated',
    };
  }

  return await db.user.findUnique({
    where: { id: userId },
    include: {
      shippingAddress: true,
    },
  });
});
