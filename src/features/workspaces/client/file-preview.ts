import { Client, Storage } from "appwrite";
import { IMAGES_BUCKET_ID } from "@/config";

interface GetFilePreviewProps {
    fileId: string;
}
export const GetFilePreview = ({ fileId }: GetFilePreviewProps) => {
    const client = new Client();

    const storage = new Storage(client);

        client 
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)


    const result = storage.getFilePreview(
        IMAGES_BUCKET_ID,           // bucket ID
        fileId,       // file ID
        );

    console.log(result);
    return result;
}
