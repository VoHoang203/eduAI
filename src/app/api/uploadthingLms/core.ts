import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { validateRequest } from '@/auth';
import { UploadThingError } from 'uploadthing/server';
const f = createUploadthing();

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError('Unauthorized');

      return {};
    })
    .onUploadComplete(() => {}),
  courseAttachment: f({
    text: { maxFileSize: '64MB', maxFileCount: 1 },
    image: { maxFileSize: '64MB', maxFileCount: 1 },
    video: { maxFileSize: '64MB', maxFileCount: 1 },
    audio: { maxFileSize: '64MB', maxFileCount: 1 },
    'application/pdf': { maxFileSize: '64MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError('Unauthorized');

      return {};
    })
    .onUploadComplete(() => {}),
  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: '512GB' } })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError('Unauthorized');

      return {};
    })
    .onUploadComplete(({ file }) => {
  console.log('Upload complete:', file.url);
}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;