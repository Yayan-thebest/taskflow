import { getCurrentUser } from '@/features/auth/queries';
import { redirect } from 'next/navigation';
import React from 'react'

const WorkspaceIdPage = async () => {
  const currentUser = await getCurrentUser();
  if(!currentUser) redirect("/sign-in");
  
  return (
    <div>
      Workspace Id page
    </div>
  )
}

export default WorkspaceIdPage;
