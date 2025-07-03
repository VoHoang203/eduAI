import { validateRequest } from '@/auth';
import { redirect } from 'next/navigation';
import Navbar from '../(main)/NavBar'; // Điều chỉnh đúng path nếu cần
import SessionProvider from '../(main)/SessionProvider';

export default async function LearnLayout({
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
        <div className="mx-auto flex w-full grow gap-5 p-5">{children}</div>
      </div>
    </SessionProvider>
  );
}