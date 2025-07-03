import { validateRequest } from "@/auth";
import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { user } = await validateRequest();
        const { courseId } = params;

        /* 
            This req body will came from a patch req from different components 
            under /teacher/courses/[courseId]/_components
              - title-form.tsx
              - description-form.tsx
              - image-form.tsx
              - category-form.tsx
              - price-form.tsx
        */
        const values = await req.json();

        /* 
			Check if there's a logged in user (authentication)
		*/
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await prisma.course.update({
            where: {
                id: courseId,
                userId:user.id,
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

/* 
    This endpoint will be called on the onDelete function found in 
    teachers/courses/[courseId]/_components/actions.tsx
*/