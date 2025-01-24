'use server';

import { auth } from '@/auth';
import { PAGE_SIZE } from '@/lib/constants';
import { db } from '@/lib/db';
import { formatError } from '@/lib/utils';
import { UpdateProfileSchema } from '@/schemas/profile-schema';
import { ShippingAddressSchema } from '@/schemas/shipping-address-schema';
import { UpdateUserSchema } from '@/schemas/user-schema';
import { Prisma, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getAuthUser } from './auth-actions';

export async function updateShippingAddress(formData: ShippingAddressSchema) {
  try {
    const user = await getAuthUser();

    if (!user || !('id' in user)) {
      throw new Error('Unauthenticated or invalid user data');
    }

    // First find if the user already has a shipping address
    const existingAddress = await db.shippingAddress.findFirst({
      where: { userId: user.id },
    });

    let updatedAddress;
    if (existingAddress) {
      // Update existing address
      updatedAddress = await db.shippingAddress.update({
        where: { id: existingAddress.id },
        data: {
          fullName: formData.fullName,
          streetAddress: formData.streetAddress,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          lat: formData.lat,
          lng: formData.lng,
        },
      });
    } else {
      // Create new address
      updatedAddress = await db.shippingAddress.create({
        data: {
          userId: user.id,
          fullName: formData.fullName,
          streetAddress: formData.streetAddress,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          lat: formData.lat,
          lng: formData.lng,
        },
      });
    }

    revalidatePath('/shipping');

    return {
      error: false,
      message: 'Successfully updated',
      data: updatedAddress,
    };
  } catch (err) {
    console.error('Error updating shipping address:', err);
    return {
      error: true,
      message: 'Something went wrong',
      err,
    };
  }
}

export async function updateUserProfile(formData: UpdateProfileSchema) {
  try {
    const session = await auth();

    const curUser = await db.user.findFirst({
      where: {
        id: session?.user.id,
      },
    });

    if (!curUser) {
      return {
        error: true,
        message: 'Unauthenticated',
      };
    }

    await db.user.update({
      where: {
        id: curUser.id,
      },
      data: {
        name: formData.name,
      },
    });

    return {
      error: false,
      message: 'profile updated successfully',
    };
  } catch (err) {
    return {
      error: true,
      message: formatError(err),
    };
  }
}

//*GET ALL USERS */
export async function getAllUsers({
  limit = PAGE_SIZE,
  page = 1,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};

  const skip = (Number(page) - 1) * limit;
  const data = await db.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip,
  });

  const dataCount = await db.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

//*DELETE USER BY ADMIN */
export async function deleteUser(id: string) {
  try {
    const session = await auth();
    const role = session?.user.role;

    if (role !== 'ADMIN') {
      return {
        error: true,
        message: 'Unauthorized',
      };
    }

    await db.user.delete({
      where: {
        id,
      },
    });

    revalidatePath('/admin/users');

    return {
      error: false,
      message: 'User successfully deleted',
    };
  } catch (error) {
    return {
      error: true,
      message: formatError(error),
    };
  }
}

//*UPDATE USER */
export async function updateUser(user: UpdateUserSchema) {
  try {
    const session = await auth();
    const role = session?.user.role;
    if (role !== 'ADMIN') {
      return {
        error: true,
        message: 'Unauthorized',
      };
    }

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        role: user.role as Role,
      },
    });

    revalidatePath('/admin/users');

    return {
      error: false,
      message: 'User  successfully',
    };
  } catch (error) {
    return {
      error: true,
      message: formatError(error),
    };
  }
}
