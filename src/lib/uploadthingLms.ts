import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthingLms/core';

export const UploadButton = generateUploadButton<OurFileRouter>({
  url: '/api/uploadthingLms',
});
export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: '/api/uploadthingLms',
});
export const {
  useUploadThing: useUploadThingLms,
  uploadFiles: uploadFilesLms,
} = generateReactHelpers<OurFileRouter>({
  url: '/api/uploadthingLms',
});
