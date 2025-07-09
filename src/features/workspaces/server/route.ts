import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "../schema";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono()
    .post(
        "/",
        zValidator("form", createWorkspaceSchema),
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");
            const storage = c.get("storage");

            const { name, image } = c.req.valid("form");

           //let uploadedImageUrl: string | undefined;
            let uploadedFileId: string | undefined; // Change to store file ID


            if(image instanceof File){
                const file = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image,
                );

                {/*const arrayBuffer = await storage.getFilePreview(
                    IMAGES_BUCKET_ID,
                    file.$id,
                );*/}

                //uploadedImageUrl = `data:image/png;base64,${Buffer.from(IMAGES_BUCKET_ID).toString("base64")}`;
                uploadedFileId  = file.$id; // Store the file ID

            }

            const workspace = await databases.createDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                ID.unique(),
                {
                    name,
                    userId: user.$id,
                    imageUrl: uploadedFileId,
                }
            );

            return c.json({ data: workspace });
        }
    );

export default app;