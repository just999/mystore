import { clsx, type ClassValue } from 'clsx';
import qs from 'query-string';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//* */ CONVERT PRISMA OBJECT INTO REGULAR JS OBJECT
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

//* */ FORMAT NUMBER WITH DECIMAL PLACES
export function formatNumberWithDecimal(num: number) {
  const [int, decimal] = num.toString().split('.');

  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

// *FORMAT ERRORS
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === 'ZodError') {
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.error[field].message
    );

    return fieldErrors.join('. ');
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    const field = error.meta?.target
      ? error.meta.target.split('_')[1]
      : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message);
  }
}

// // *ERROR FORMATTER UTILITY BY CLOUDE.AI
// type KnownError = ZodError | PrismaClientKnownRequestError | Error;
// export function errorFormatter(error: KnownError): string {
//   // Handle Zod validation errors
//   if (error instanceof ZodError) {
//     return error.errors.map((err) => err.message).join('. ');
//   }

//   // Handle Prisma unique constraint errors
//   if (error instanceof PrismaClientKnownRequestError) {
//     if (error.code === 'P2002') {
//       const target = error.meta?.target as string[];
//       const field = target?.[0] || 'Field';
//       return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
//     }
//     return 'Database error occurred';
//   }

//   // Handle standard Error objects
//   if (error instanceof Error) {
//     return error.message;
//   }

//   // Fallback for unknown error types
//   return 'An unexpected error occurred';
// }

// // Usage example with type safety
// export function handleApiError(error: unknown): {
//   error: boolean;
//   message: string;
// } {
//   // First type check the error
//   if (
//     error instanceof ZodError ||
//     error instanceof PrismaClientKnownRequestError ||
//     error instanceof Error
//   ) {
//     return {
//       error: true,
//       message: errorFormatter(error),
//     };
//   }

//   // Handle truly unknown errors
//   return {
//     error: true,
//     message: 'An unexpected error occurred',
//   };
// }

//*ROUND NUMBER TO TWO DIGIT DECIMAL */
export function round2(value: number | string) {
  if (typeof value === 'number') {
    // return Math.round((value + Number.EPSILON) * 100) / 100;
    return value.toFixed(2);
  } else if (typeof value === 'string') {
    // return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
    return Number(value).toFixed(2);
  } else {
    return {
      error: true,
      message: 'Value is not number or string',
    };
  }
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
});

//*FORMAT CURRENCY */
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return currencyFormatter.format(amount);
  } else if (typeof amount === 'string') {
    return currencyFormatter.format(Number(amount));
  } else {
    return 'NaN';
  }
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

//* */ FORMAT DATE & TIME
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

//*FORM PAGINATION LINK */
export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params);
  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    { skipNull: true }
  );
}

//*FORMAT MONTH FROM STRING 2025-01 TO 2025-Jan */
export function formatMonth(monthString: string) {
  const monthNumber = parseInt(monthString.split('-')[1]);
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${monthString.split('-')[0]}-${monthNames[monthNumber - 1]}`;
}
