import { getCurrentUser } from "@/features/auth/actions";
import { UserButton } from "@/features/auth/components/user-button";
import { redirect } from "next/navigation";

export default async function Home() {
  const currentUser = await getCurrentUser();

  if(!currentUser) redirect("/sign-in")

  return (
    <div>
      <UserButton />
    </div>
  );
}
