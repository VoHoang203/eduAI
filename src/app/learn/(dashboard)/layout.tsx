'use client';
import Sidebar from './_components/sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex w-full">
      <div className="hidden md:flex h-full w-56 flex-col">
        <Sidebar />
      </div>
      <main className="md:pl-6  w-full min-h-screen bg-primary-foreground ">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
