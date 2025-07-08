import { prisma } from '@/db/prisma';
import { validateRequest } from '@/auth';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } },
) {
  const {courseId, chapterId} = await params;
  try {
    /* 
			Check if there's a logged in user (authentication)
		*/
    const { user } = await validateRequest();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    /* 
			Check if the user trying to publish a chapter of a course
            is the owner of the course (authorization)
		*/
    const courseOwner = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId:user.id,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    /* 
			Check if the chapter exist and the chapter's muxData have
			values, if not it's a bad request (400) as we only allow 
			a chapter to be published it it has all the required fields
		*/
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    const muxData = await prisma.muxData.findUnique({
      where: {
        chapterId: chapterId,
      },
    });

    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    ) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    /* 
			At this point, the chapter is publishable, update the 
			chapter's isPublished property to true
		*/
    const publishedChapter = await prisma.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log('[CHAPTER_PUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
