import { getCurrentUser } from "@/features/auth/queries";

import { redirect } from "next/navigation";
import { WorkspaceIdSettingsClient } from "./client";


const WorkspaceIdSettingsPage = async () => {

    const currentUser = await getCurrentUser();
    if(!currentUser) redirect("/sign-in");

    return (
        <WorkspaceIdSettingsClient />
    )
};

export default WorkspaceIdSettingsPage;