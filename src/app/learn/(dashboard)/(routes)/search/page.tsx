import { prisma } from '@/db/prisma';
import { Categories } from './_components/categories';
import { SearchInput } from '@/components/search-input';
import { redirect } from 'next/navigation';
import { CoursesList } from '@/components/courses-list';

import { getCourses } from '@/actions/get-courses';
import { validateRequest } from '@/auth';

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}
/*
    Everything in the url including the params can be access as props in Add commentMore actions
    a server component. Here, we are getting the searchParams
*/
const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { user } = await validateRequest();
  const { title, categoryId } = await searchParams;
  if (!user) {
    return redirect('/');
  }
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  const courses = await getCourses({
    userId:user.id,
    title,
    categoryId,
  });

  return (
    <>
      <div className="py-6 hidden md:mb-0 md:block">
        <SearchInput />
      </div>
      <div className="p-6  space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};
export default SearchPage;
