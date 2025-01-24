import { z } from 'zod';

export const shippingAddressSchema = z.object({
  fullName: z.string().min(1, {
    message: 'FullName must be at least 3 characters',
  }),
  streetAddress: z.string().min(1, {
    message: 'StreetAddress must be at least 3 characters',
  }),
  city: z.string().min(1, {
    message: 'City must be at least 3 characters',
  }),
  postalCode: z.string().min(1, {
    message: 'PostalCode must be at least 3 characters',
  }),
  country: z.string().min(1, {
    message: 'Country must be at least 3 characters',
  }),
  lat: z.string(),
  lng: z.string(),
});

export type ShippingAddressSchema = z.infer<typeof shippingAddressSchema>;
