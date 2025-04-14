import { createUploadthing, type FileRouter } from "uploadthing/next";
import { prisma } from "@/lib/db/prisma";

const f = createUploadthing();

export const ourFileRouter = {
  docUploader: f({ pdf: { maxFileSize: "4MB" }, text: { maxFileSize: "1MB" }, "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "4MB" } })
    .middleware(async () => {
      return { timestamp: Date.now() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Store file information in database
      const document = await prisma.document.create({
        data: {
          url: file.url,
          uploadedAt: new Date(metadata.timestamp)
        }
      });
      
      return { uploadedAt: metadata.timestamp, documentId: document.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;