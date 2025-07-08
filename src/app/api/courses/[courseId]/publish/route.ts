import { validateRequest } from "@/auth";
import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { user } = await validateRequest();
        const {courseId} =await params;
        /* 
			Check if there's a logged in user (authentication)
		*/
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        /* 
			Before publishing the course, make sure that it exist in
			the database and include all chapters and each of the
			chapter's muxData. If no such course exist, respond with
			404 Not Found
		*/
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
                userId:user.id,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    },
                },
            },
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        /* 
			Out of all chapters of the course, check if at least one of
			them has their isPublished property set to true. We do this
			because we only want a course to be published if at least
			one of its chapters is published
		*/
        const hasPublishedChapter = course.chapters.some(
            (chapter) => chapter.isPublished
        );

        /* 
			If at least one of the required fields is missing the course
			cannot be published. Respond with a 400 Bad Request
		*/
        if (
            !course.title ||
            !course.description ||
            !course.imageUrl ||
            !course.categoryId ||
            !hasPublishedChapter
        ) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        /* 
			Finally, the isPublished property of the course can now be set to true
		*/
        const publishedCourse = await prisma.course.update({
            where: {
                id: courseId,
                userId:user.id,
            },
            data: {
                isPublished: true,
            },
        });

        return NextResponse.json(publishedCourse);
    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}