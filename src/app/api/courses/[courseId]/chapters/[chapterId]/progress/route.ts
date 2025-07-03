import { validateRequest } from '@/auth';
import { prisma } from '@/db/prisma';
import { NextResponse } from 'next/server';

/*
	This API route will be called in the onEnd function of video-player.tsx
	automatically after the chapter's video has finished. This route will also
	be called on the onClick function of course-progress-button.tsx if the user
	wants to mark this chapter as complete manually, the user can also mark
	the chapter as not completed
*/
export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { user } = await validateRequest();

    /*
			isCompleted here can be either true or false. The isCompleted
			property of a UserProgress can be false because on the 
			course-progress-button.tsx we also have a "Not completed" button
			which will make the isCompleted value here to false 
		*/
    const { isCompleted } = await req.json();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    /*
			The upsert() method means create or update
		*/
    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId:user.id,
          chapterId: params.chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId:user.id,
        chapterId: params.chapterId,
        isCompleted,
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log('[CHAPTER_ID_PROGRESS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
