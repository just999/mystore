import { auth } from '@/auth';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 4,
    },
  })
    .middleware(async ({ files }) => {
      const session = await auth();
      if (!session) throw new UploadThingError('Unauthorized');
      return { userId: session?.user?.id, fileCount: files.length };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
