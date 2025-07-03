'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';



import { Button } from '@/components/ui/button';
import { SearchInput } from './search-input';

/*
    The SearchInput component will only appear if the
    user is in the /search path 
*/
const NavbarRoutes = () => {

  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith('/teacher');
   const isCoursePage = pathname?.includes("/courses");
  const isPlayerPage = pathname?.includes('/chapter');
  const isSearchPage = pathname === '/search';

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        
         {(
          <Link href="/learn/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher mode
            </Button>
          </Link>
        )}
        
      </div>
    </>
  );
};

export default NavbarRoutes;
