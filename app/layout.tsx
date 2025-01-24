import type { Metadata } from 'next';

import '@/assets/styles/globals.css';
import { auth } from '@/auth';
import { Toaster } from '@/components/ui/toaster';
import { Theme } from '@/hooks/use-dark-mode';
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from '@/lib/constants';
import { ThemeProvider } from '@/lib/contexts/theme-context';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { cookies } from 'next/headers';
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: `%s | Pro Store`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const cookieStore = await cookies();
  const theme = (cookieStore.get('theme')?.value ?? 'light') as Theme;
  return (
    <html lang='en' className={theme}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
      >
        <SessionProvider session={session}>
          <ThemeProvider defaultTheme={theme}>
            {children} <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
