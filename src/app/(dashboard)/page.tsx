import { getCurrentUser } from "@/features/auth/actions";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { redirect } from "next/navigation";

export default async function Home() {
  const currentUser = await getCurrentUser();

  if(!currentUser) redirect("/sign-in")

  return (
    <div className="border">
      <CreateWorkspaceForm/>
    </div>
  );
}
