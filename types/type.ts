import { ShippingAddressSchema } from '@/schemas/shipping-address-schema';
import { PaymentMethod, Product } from '@prisma/client';

export type ProductProps = {
  id?: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  images: string[];
  price: number;
  brand: string;
  rating: string | null;
  numReviews: string | null;
  stock: string;
  isFeatured: boolean;
  banner: string | null;
};

export type ExtendedProductProps = {
  data: Product[];
  totalPages: number;
};

export type FormStateError = {
  error: boolean;
  message: string;
};

// Define the shape of payment result
export interface PaymentResult {
  id: string;
  paymentId: string;
  status: string;
  email_address: string;
  pricePaid: string;
}

// Type guard to check if a value is a PaymentResult
export function isPaymentResult(value: unknown): value is PaymentResult {
  if (!value || typeof value !== 'object') return false;

  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.status === 'string' &&
    typeof v.email_address === 'string' &&
    typeof v.pricePaid === 'string'
  );
}

export const defaultPaymentResult: PaymentResult = {
  id: '',
  paymentId: '',
  status: 'pending',
  email_address: '',
  pricePaid: '',
};
// Define the exact shape of our order items
interface OrderItem {
  id: string;
  name: string;
  slug: string;
  price: string;
  createdAt: Date;
  orderId: string;
  productId: string;
  qty: string;
  image: string;
  updated: Date;
}

// Define the exact shape of our user
interface OrderUser {
  name: string;
  email: string;
}

// Create a type that includes all relations
export type OrderWithRelations = {
  id: string;
  createdAt: Date;
  updated: Date;
  userId: string;
  shippingAddressId: string;
  shippingAddress?: ShippingAddressSchema;
  paymentMethod: PaymentMethod;
  paymentResult: PaymentResult;
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
  totalPrice: string;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: OrderUser;
};

export interface MongoAggregationResult {
  ok: number;
  cursor: {
    firstBatch: Array<{ _id: null; totalSales: number }>;
    id: string;
    ns: string;
  };
}

export interface MonthlySalesResult {
  _id: string;
  totalSales: number;
}

export type SalesDataType = {
  month: string;
  totalSales: number;
};

export type LatestSalesProps = {
  id: string;
  createdAt: Date;
  totalPrice: string;
  user: {
    name: string;
  };
};

export type OrderSummaryResult = {
  ordersCount: number;
  productsCount: number;
  usersCount: number;
  totalSales: string;
  latestSales: Array<{
    id: string;
    createdAt: Date;
    totalPrice: string;
    user: {
      name: string;
    };
  }>;
  salesData: SalesDataType[];
};

export type OrderProps = {
  limit?: number;
  page: number;
};

export interface UploadResponse {
  url: string;
}
