import { IconBadge } from '@/components/icon-badge';
import { prisma } from '@/db/prisma';
import { redirect } from 'next/navigation';

import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from 'lucide-react';

// import { IconBadge } from '@/components/icon-badge';
// import { Banner } from '@/components/banner';

import { TitleForm } from './_components/title-form';
import { DescriptionForm } from './_components/description-form';
import { ImageForm } from './_components/image-form';
import { CategoryForm } from './_components/category-form';
import { ChaptersForm } from './_components/chapters-form';
import { PriceForm } from './_components/price-form';
import { AttachmentForm } from './_components/attachment-form';
import { Actions } from './_components/actions';
import { Banner } from '@/components/banner';
import { validateRequest } from '@/auth';

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { user } = await validateRequest();
  const { courseId } = await params;
  if (!user) {
    return redirect('/');
  }

  /*
        The course and attachment table have one to many relationship where
        a course can have many attachments. Since, we need to a way for user 
        to show, add, edit and delete an attachment we need to include all the
        attachments of a specific course we are editing. Also, add the userId
        into the where clause since we only want this course to be modified by
        the user that created it
    */
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
      userId:user.id,
    },
    include: {
      chapters: {
        orderBy: {
          position: 'asc',
        },
      },
      attachments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  if (!course) {
    return redirect('/');
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={courseId}
            isPublished={course.isPublished}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div className="">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={CircleDollarSign} />
                  <h2 className="text-xl">Sell your course</h2>
                </div>
                <PriceForm initialData={course} courseId={course.id} />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={File} />
                  <h2 className="text-xl">Resources & Attachments</h2>
                </div>
                <AttachmentForm initialData={course} courseId={course.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  // return (
  //     <>
  //         {!course.isPublished && (
  //             <Banner label="This course is unpublished. It will not be visible to the students." />
  //         )}
  //         <div className="p-6">
  //             <div className="flex items-center justify-between">
  //                 <div className="flex flex-col gap-y-2">
  //                     <h1 className="text-2xl font-medium">Course setup</h1>
  //                     <span className="text-sm text-slate-700">
  //                         Complete all fields {completionText}
  //                     </span>
  //                 </div>
  //                 <Actions
  //                     disabled={!isComplete}
  //                     courseId={courseId}
  //                     isPublished={course.isPublished}
  //                 />
  //             </div>
  //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
  //                 <div>
  //                     <div className="flex items-center gap-x-2">
  //                         <IconBadge icon={LayoutDashboard} />
  //                         <h2 className="text-xl">Customize your course</h2>
  //                     </div>
  //                     <TitleForm initialData={course} courseId={course.id} />
  //                     <DescriptionForm
  //                         initialData={course}
  //                         courseId={course.id}
  //                     />
  //                     <ImageForm initialData={course} courseId={course.id} />
  //                     <CategoryForm
  //                         initialData={course}
  //                         courseId={course.id}
  //                         options={categories.map((category) => ({
  //                             label: category.name,
  //                             value: category.id,
  //                         }))}
  //                     />
  //                 </div>
  //                 <div className="space-y-6">
  //                     <div>
  //                         <div className="flex items-center gap-x-2">
  //                             <IconBadge icon={ListChecks} />
  //                             <h2 className="text-xl">Course chapters</h2>
  //                         </div>
  //                         <ChaptersForm
  //                             initialData={course}
  //                             courseId={course.id}
  //                         />
  //                     </div>
  //                     <div>
  //                         <div className="flex items-center gap-x-2">
  //                             <IconBadge icon={CircleDollarSign} />
  //                             <h2 className="text-xl">Sell your course</h2>
  //                         </div>
  //                         <PriceForm
  //                             initialData={course}
  //                             courseId={course.id}
  //                         />
  //                     </div>
  //                     <div>
  //                         <div className="flex items-center gap-x-2">
  //                             <IconBadge icon={File} />
  //                             <h2 className="text-xl">
  //                                 Resources & Attachments
  //                             </h2>
  //                         </div>
  //                         <AttachmentForm
  //                             initialData={course}
  //                             courseId={course.id}
  //                         />
  //                     </div>
  //                 </div>
  //             </div>
  //         </div>
  //     </>
  // );
};

export default CourseIdPage;
/* 
        The course can only be published when all the requiredFields are truthy.
        The chapters field must have at least one published chapter. The 
        attachments are not a required field
    */
