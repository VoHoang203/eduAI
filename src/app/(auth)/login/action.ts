'use server';

import { lucia } from '@/auth';
import { prisma } from '@/db/prisma';
import { loginSchema, LoginValues } from '@/lib/validation';
import { verify } from '@node-rs/argon2';
import { cookies } from 'next/headers';
import { redirect, unstable_rethrow } from 'next/navigation';

export async function login(
  credentials: LoginValues,
): Promise<{ error: string }> {
  try {
    const { username, password } = loginSchema.parse(credentials);

    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: 'User do not exist',
      };
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return {
        error: 'Incorrect username or password',
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect('/');
  } catch (error) {
    unstable_rethrow(error);
    console.error(error);
    return {
      error: 'Something went wrong. Please try again.',
    };
  }
}
