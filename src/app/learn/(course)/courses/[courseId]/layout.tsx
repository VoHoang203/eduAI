import { prisma } from '@/db/prisma';
import { redirect } from 'next/navigation';

import { getProgress } from '@/actions/get-progress';

import { CourseSidebar } from './_components/course-sidebar';
import { CourseNavbar } from './_components/course-navbar';
import { validateRequest } from '@/auth';

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { user } = await validateRequest();
  const { courseId } = await params;
  if (!user) {
    return redirect('/');
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId: user.id,
            },
          },
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  });

  if (!course) {
    return redirect('/');
  }

  const progressCount = await getProgress(user.id, course.id);

  return (
    <div className="h-full flex-wrap top-16">
      <div className="h-[80px] md:pl-80 fixed inset-y-12 w-full">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-12">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default CourseLayout;
