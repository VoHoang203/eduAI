import { prisma } from "@/db/prisma";
import { redirect } from "next/navigation";

import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { validateRequest } from "@/auth";

const CoursesPage = async() => {
  const { user } = await validateRequest();

    if (!user) {
        return redirect("/");
    }
    const courses = await prisma.course.findMany({
        where: {
            userId:user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
  return (
    <div className="p-6">
       <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
