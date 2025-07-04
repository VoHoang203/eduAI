"use client";

import { Layout, Compass, List, BarChart } from "lucide-react";
import { usePathname } from "next/navigation";

import SidebarItem from "./sidebar-item";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/learn",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/learn/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/learn/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/learn/teacher/analytics",
  },
];

const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
