import { PrismaAdapter } from '@auth/prisma-adapter';
import { Role } from '@prisma/client';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from './lib/db';

export const config = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(db) as unknown as Adapter,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials === null) return null;

        const user = await db.user.findFirst({
          where: { email: credentials.email as string },
        });

        if (user && user.hashedPassword) {
          const isMatch = compareSync(
            credentials.password as string,
            user.hashedPassword
          );

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role as Role,
          name: token.name,
        },
      };
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.role = user.role;
        token.name = user.name;
      }

      // Handle session update
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name;

        // Update the user in the database
        try {
          await db.user.update({
            where: { id: token.sub },
            data: { name: session.user.name },
          });
        } catch (error) {
          console.error('Failed to update user name:', error);
        }
      }

      // Handle initial NO_NAME case
      if (token.name === 'NO_NAME' && user?.email) {
        const newName = user.email.split('@')[0];
        token.name = newName;

        try {
          await db.user.update({
            where: { id: user.id },
            data: { name: newName },
          });

          if (trigger === 'signIn' || trigger === 'signUp') {
            const cookiesStore = await cookies();
            const sessionCartId = cookiesStore.get('sessionCardId')?.value;

            if (sessionCartId) {
              const sessionCart = await db.cart.findFirst({
                where: { sessionCartId },
              });

              if (sessionCart) {
                await db.cart.deleteMany({
                  where: { userId: user.id },
                });

                await db.cart.update({
                  where: { id: sessionCart.id },
                  data: { userId: user.id },
                });
              }
            }
          }
        } catch (error) {
          console.error('Failed to update user name:', error);
        }
      }

      return token;
    },
    authorized({ request, auth }) {
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      const { pathname } = request.nextUrl;

      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      if (!request.cookies.get('sessionCartId')) {
        const sessionCartId = crypto.randomUUID();
        const newRequestHeaders = new Headers(request.headers);
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        response.cookies.set('sessionCartId', sessionCartId);
        return response;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
