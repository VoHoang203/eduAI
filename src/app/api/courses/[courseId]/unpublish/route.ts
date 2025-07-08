import { validateRequest } from '@/auth';
import { prisma } from '@/db/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
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
			Before unpublishing the course, make sure that it exist in
			the database
		*/
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: user.id,
      },
    });

    if (!course) {
      return new NextResponse('Not found', { status: 404 });
    }

    /* 
			Finally, you can unpublish the course by setting its isPublished
			property to false
		*/
    const unpublishedCourse = await prisma.course.update({
      where: {
        id: courseId,
        userId: user.id,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.log('[COURSE_ID_UNPUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
