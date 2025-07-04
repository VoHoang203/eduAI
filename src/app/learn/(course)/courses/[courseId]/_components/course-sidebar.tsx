import { prisma } from '@/db/prisma';
import { redirect } from 'next/navigation';
import type { Chapter, Course, UserProgress } from '@/generated/prisma';

import { CourseProgress } from '@/components/course-progress';
import { CourseSidebarItem } from './course-sidebar-item';
import { validateRequest } from '@/auth';

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { user } = await validateRequest();

  if (!user) {
    return redirect('/');
  }

  /*
        In our schema.prisma we created a composite unique constraint
        @@unique([userId, courseId]), you can use userId_courseId to
        query the result (compound identifier or composite key)
    */
  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId:user.id,
        courseId: course.id,
      },
    },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};
