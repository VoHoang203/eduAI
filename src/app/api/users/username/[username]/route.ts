import { validateRequest } from '@/auth';
import { prisma } from '@/db/prisma';
import { getUserDataSelect } from '@/lib/types';

export async function GET(
  req: Request,
   { params }: { params: { username: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    const {username} = await params;
        if (!loggedInUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
      select: getUserDataSelect(loggedInUser.id),
    });

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
