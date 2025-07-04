import { prisma } from "@/db/prisma";
import type { Attachment, Chapter } from "@/generated/prisma";

interface GetChapterProps {
    userId: string;
    courseId: string;
    chapterId: string;
}

export const getChapter = async ({
    userId,
    courseId,
    chapterId,
}: GetChapterProps) => {
    try {
        /*
			The purchase will be an object if the logged in user
			has purchased the course. Otherwise, it will be null
		*/
        const purchase = await prisma.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        const course = await prisma.course.findUnique({
            where: {
                isPublished: true,
                id: courseId,
            },
            select: {
                price: true,
            },
        });

        const chapter = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true,
            },
        });

        if (!chapter || !course) {
            throw new Error("Chapter or course not found");
        }

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        if (purchase) {
            attachments = await prisma.attachment.findMany({
                where: {
                    courseId: courseId,
                },
            });
        }

        if (chapter.isFree || purchase) {
            muxData = await prisma.muxData.findUnique({
                where: {
                    chapterId: chapterId,
                },
            });

            nextChapter = await prisma.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position,
                    },
                },
                orderBy: {
                    position: "asc",
                },
            });
        }

        const userProgress = await prisma.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                },
            },
        });

        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase,
        };
    } catch (error) {
        console.log("[GET_CHAPTER]", error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null,
        };
    }
};