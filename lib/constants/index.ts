export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Pro Store';
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'E-Commerce with Nextjs 15';
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 12;

export const loginDefaultValues = {
  email: 'admin@admin.com',
  password: '111111',
};
export const registerDefaultValues = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
};

export const shippingAddressDefaultValues = {
  fullName: '',
  streetAddress: '',
  city: '',
  postalCode: '',
  country: '',
  lat: '',
  lng: '',
};

export const PAYMENT_METHODS = [
  'PayPal',
  'Stripe',
  'CashOnDelivery',
  'None',
] as const;

export type PaymentMethodType = (typeof PAYMENT_METHODS)[number];

export const AVAILABLE_PAYMENT_METHODS: PaymentMethodType[] = process.env
  .PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(', ').filter(
      (method): method is PaymentMethodType =>
        PAYMENT_METHODS.includes(method as PaymentMethodType)
    )
  : Array.from(PAYMENT_METHODS);

export const DEFAULT_PAYMENT_METHOD =
  (process.env.DEFAULT_PAYMENT_METHOD as PaymentMethodType) || 'PayPal';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const productDefaultValues = {
  name: '',
  slug: '',
  category: '',
  images: [],
  brand: '',
  description: '',
  price: '',
  stock: '',
  rating: '',
  numReviews: '',
  isFeatured: false,
  banner: null,
};

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split('. ')
  : ['ADMIN', 'USER'];
