'use server';

import { validateRequest } from '@/auth';
import { prisma } from '@/db/prisma';
import { createPostSchema } from '@/lib/validation';
import { getPostDataInclude } from "@/lib/types";

export async function submitPost(input: {
  content: string;
  mediaIds: string[];
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error('Unauthorized');

  const { content, mediaIds } = createPostSchema.parse(input);


  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    include: getPostDataInclude(user.id),
  });
  return newPost;
}
