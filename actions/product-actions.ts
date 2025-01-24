'use server';

import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '@/lib/constants';
import { db } from '@/lib/db';
import { convertToPlainObject, formatError } from '@/lib/utils';
import {
  InsertProductSchema,
  insertProductSchema,
  updateProductSchema,
  UpdateProductSchema,
} from '@/schemas/product-schema';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';

export const getLatestProducts = cache(async () => {
  return await db.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });
});

// *GET SINGLE PRODUCT BY SLUG
export const getProductBySlug = cache(async (slug: string) => {
  return await db.product.findFirst({
    where: { slug: slug },
  });
});

// *GET SINGLE PRODUCT BY ID
export const getProductById = cache(async (id: string) => {
  const data = await db.product.findFirst({
    where: { id },
  });
  return convertToPlainObject(data);
});

//*GET ALL PRODUCTS */
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price: string;
  rating?: string;
  sort?: string;
}) {
  console.log('🚀 ~ rating:', rating);
  console.log('🚀 ~ price:', price);

  const queryFilter: Prisma.ProductWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};

  const categoryFilter = category && category !== 'all' ? { category } : {};

  const parsePriceRange = (priceParam: string) => {
    if (priceParam === 'all') return { min: 0, max: Number.MAX_SAFE_INTEGER };

    const [min, max] = priceParam.split('-').map(Number);

    if (isNaN(min) || isNaN(max)) {
      return { min: 0, max: Number.MAX_SAFE_INTEGER };
    }
    return { min, max };
  };

  //* */ Price filter

  const { min, max } = parsePriceRange(price);

  const priceFilter: Prisma.ProductWhereInput =
    price !== 'all'
      ? {
          price: {
            gte: min,
            lte: max,
          } as Prisma.FloatFilter,
        }
      : {};
  console.log('🚀 ~ priceFilter:', priceFilter);

  const ratingFilter: Prisma.ProductWhereInput =
    rating !== 'all'
      ? {
          rating: {
            gte: Number(rating),
          } as Prisma.FloatFilter,
        }
      : {};

  const data = await db.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    orderBy:
      sort === 'lowest'
        ? { price: 'asc' }
        : sort === 'highest'
          ? { price: 'desc' }
          : sort === 'rating'
            ? { rating: 'desc' }
            : { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await db.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

//*DELETE A PRODUCT */
export async function deleteProduct(id: string) {
  try {
    const existingProduct = await db.product.findFirst({
      where: { id },
    });

    if (!existingProduct) {
      return {
        error: true,
        message: 'Product not found',
      };
    }

    await db.product.delete({ where: { id } });

    revalidatePath('/admin/products');

    return {
      error: false,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    return {
      error: true,
      message: formatError(error),
    };
  }
}

//*CREATE A PRODUCT */
export async function createProduct(data: InsertProductSchema) {
  try {
    const product = insertProductSchema.parse(data);

    await db.product.create({
      data: { ...product, price: Number(product.price) },
    });

    revalidatePath('/admin/products');

    return {
      error: false,
      message: 'Product created successfully',
    };
  } catch (error) {
    return {
      error: true,
      message: formatError(error),
    };
  }
}
//*UPDATE A PRODUCT */
export async function updateProduct(data: UpdateProductSchema) {
  try {
    const product = updateProductSchema.parse(data);

    const existingProduct = await db.product.findFirst({
      where: { id: product.id },
    });
    if (!existingProduct) {
      return {
        error: true,
        message: 'No product found',
      };
    }

    const { id, ...rest } = product;
    await db.product.update({
      where: { id: product.id },
      data: { ...rest, price: Number(rest.price) },
    });

    revalidatePath('/admin/products');

    return {
      error: false,
      message: 'Product created successfully',
    };
  } catch (error) {
    return {
      error: true,
      message: formatError(error),
    };
  }
}

//*GET ALL CATEGORY PRODUCTS */
export async function getAllCategories() {
  const data = await db.product.groupBy({
    by: ['category'],
    _count: true,
  });

  return data;
}

//*GET FEATURED PRODUCTS */
export async function getFeaturedProducts() {
  const data = await db.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });
  return convertToPlainObject(data);
}
