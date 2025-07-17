import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { WorkspaceIdJoinClient } from "./client";


const WorkspaceIdJoinPage = async () => {
    const currentUser = await getCurrentUser();
    if(!currentUser) redirect("/sign-in");

    return (
        <WorkspaceIdJoinClient />
    )
};

export default WorkspaceIdJoinPage;