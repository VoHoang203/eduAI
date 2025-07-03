'use client';

import MenuBar from './MenuBar';

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="mx-auto flex w-full grow gap-5 p-5">
      <MenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-70 text-primary" />
      
      <div className="flex-1">{children}</div>
      
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
      
    </div>
  );
}
