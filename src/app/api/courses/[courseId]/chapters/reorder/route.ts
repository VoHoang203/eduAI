import { validateRequest } from '@/auth';
import { prisma } from '@/db/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { user } = await validateRequest();
        const { courseId } = await params;

    /* 
			Check if there's a logged in user (authentication)
		*/
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    /* 
			This req body will came from a put req from chapters-form.tsx
		*/
    const { list } = await req.json();

    /* 
			Check if the user attempting to reorder the chapters of  
			the course is the owner of the course (authorization)
		*/
    const courseOwner = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: user.id,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    /* 
			The type of list is an array of objects: 
				{ id: string; position: number }[]
			Here, we are looping through the list and updating each chapter's
			position based on their id
		*/
    for (const item of list) {
      await prisma.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.log('[REORDER]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
