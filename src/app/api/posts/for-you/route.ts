import { validateRequest } from '@/auth';
import { prisma } from '@/db/prisma';
import { getPostDataInclude, PostsPage } from '@/lib/types';
import { NextResponse, NextRequest } from 'next/server';
export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get('cursor') || undefined;

    const pageSize = 10;
    const { user } = await validateRequest();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const posts = await prisma.post.findMany({
       include: getPostDataInclude(user.id),
      orderBy: { createdAt: 'desc' },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });
    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
