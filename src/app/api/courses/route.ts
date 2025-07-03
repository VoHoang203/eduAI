import { validateRequest } from '@/auth';
import { prisma } from '@/db/prisma';
import { NextResponse } from 'next/server';

// import { isTeacher } from "@/lib/teacher";

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest();
    const { title } = await req.json();

    /*
            Only a teacher can be the one that will be allowed to create a course
        */
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await prisma.course.create({
      data: {
        userId: user.id,
        title,
      },
    });

    /*
            This response will be sent back to the /teacher/create/page.tsx response variable
        */
    return NextResponse.json(course);
  } catch (error) {
    console.log('[COURSES]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
