import { prisma } from '@/db/prisma';
import { validateRequest } from '@/auth';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } },
) {
  try {
    /* 
			Check if there's a logged in user (authentication)
		*/
    const { user } = await validateRequest();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    /* 
			Check if the user trying to unpublish a chapter of a course
            is the owner of the course (authorization)
		*/
    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId:user.id,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    /* 
			We did not perform a check if the chapter the user is trying to
			delete exist but you are welcome to do so. Here, we are directly
			going to update the chapter's isPublished property to false
		*/
    const unpublishedChapter = await prisma.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: false,
      },
    });

    /* 
			Since we only allow a course to be publishable if at least one
            of its chapters was published. We need to perform a check.  
            By unpublishing a chapter, it's possible that a course will no  
            longer have at least one chapter where isPublished set to true. 
            In this case we want to make the course's isPublished set 
            back to false. Here, we are checking how many chapters are in a
            certain course where isPublished is true. If `publishedChaptersInCourse`
            length value is 0 we are going to update the course's isPublished
            value to false
		*/
    const publishedChaptersInCourse = await prisma.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await prisma.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.log('[CHAPTER_UNPUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
