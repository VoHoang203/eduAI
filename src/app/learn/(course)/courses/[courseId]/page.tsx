import { prisma } from '@/db/prisma';
import { redirect } from 'next/navigation';

const CourseIdPage = async ({
  params,
  searchParams,
}: {
  params: { courseId: string };
  searchParams: { [key: string]: string | undefined };
}) => {
  const { courseId } = await params;
  const { success, userId } = await searchParams;
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
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
  // Nếu có success=1 và userId, tiến hành tạo purchase
  if (success === '1' && userId) {
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!existingPurchase) {
      await prisma.purchase.create({
        data: {
          userId,
          courseId,
        },
      });
    }
  }
  return redirect(
    `/learn/courses/${course.id}/chapters/${course.chapters[0].id}`,
  );
};

export default CourseIdPage;
