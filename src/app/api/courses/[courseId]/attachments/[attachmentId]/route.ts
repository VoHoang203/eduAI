import { prisma } from '@/db/prisma';
import { validateRequest } from '@/auth';

import { NextResponse } from 'next/server';

/* 
	These params will came from a delete req from attachment-form.tsx
*/
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } },
) {
  try {
    const { user } = await validateRequest();
    const { courseId, attachmentId} = await params;

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
        id: courseId,
        userId: user.id,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const attachment = await prisma.attachment.delete({
      where: {
        courseId: courseId,
        id: attachmentId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log('ATTACHMENT_ID', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
