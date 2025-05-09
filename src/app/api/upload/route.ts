import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/lib/uploadthingRouter";

const handler = createRouteHandler({ router: ourFileRouter });

export const POST = handler.POST;
export const GET = handler.GET;