import { validateRequest } from '@/auth';
import { redirect } from 'next/navigation';
import Navbar from './NavBar';
import SessionProvider from './SessionProvider';
import MenuBar from './MenuBar';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();
  if (!session.user) redirect('/login');

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full grow gap-5 p-5">
          <MenuBar className='sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-70 text-primary' />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </SessionProvider>
  );
}
