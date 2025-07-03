import { prisma } from "@/db/prisma";
import { validateRequest } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { user } = await validateRequest();

    /* 
			This req body will came from a post req from attachment-form.tsx
		*/
    const { url } = await req.json();

    /* 
			Check if there's a logged in user (authentication)
		*/
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    /* 
			Check if the user creating an attachment for a course is
			the owner of the course (authorization)
		*/
    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId: user.id,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const attachment = await prisma.attachment.create({
      data: {
        url,
        name: url.split('/').pop(),
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log('COURSE_ID_ATTACHMENTS', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
