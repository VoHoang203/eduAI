import { redirect } from "next/navigation";

import { CheckCircle, Clock } from "lucide-react";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";

import { InfoCard } from "./_components/info-card";
import { CoursesList } from "@/components/courses-list";
import { validateRequest } from "@/auth";

export default async function Dashboard() {
    const { user } = await validateRequest();

    if (!user) {
        return redirect("/");
    }

    const { completedCourses, coursesInProgress } = await getDashboardCourses(
        user.id
    );

    return (
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard
                    icon={Clock}
                    label="In Progress"
                    numberOfItems={coursesInProgress.length}
                />
                <InfoCard
                    icon={CheckCircle}
                    label="Completed"
                    numberOfItems={completedCourses.length}
                    variant="success"
                />
            </div>
            <CoursesList items={[...coursesInProgress, ...completedCourses]} />
        </div>
    );
}