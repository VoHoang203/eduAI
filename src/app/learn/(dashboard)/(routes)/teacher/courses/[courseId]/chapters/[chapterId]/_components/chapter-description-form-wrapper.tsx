'use client';

import { Chapter } from '@/generated/prisma';
import { ChapterDescriptionForm } from './chapter-description-form';
interface Props {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}
const ChapterDescriptionFormWrapper = ({ initialData, courseId, chapterId }: Props) => {
  return <ChapterDescriptionForm
      initialData={initialData}
      courseId={courseId}
      chapterId={chapterId}
    />;
};

export default ChapterDescriptionFormWrapper;