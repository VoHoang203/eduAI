import { validateRequest } from '@/auth';
import { prisma } from '@/db/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { user } = await validateRequest();
    const { courseId } = await params;
 
    const { title } = await req.json();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: user.id,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const lastChapter = await prisma.chapter.findFirst({
      where: {
        courseId: courseId,
      },
      orderBy: {
        position: 'desc',
      },
    });


    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

   
    const chapter = await prisma.chapter.create({
      data: {
        title,
        courseId: courseId,
        position: newPosition,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log('[CHAPTERS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
