import { getCurrentUser } from '@/features/auth/queries';
import { MembersList } from '@/features/workspaces/components/members-list';
import { getWorkspaceInfo } from '@/features/workspaces/queries';
import { redirect } from 'next/navigation';
import React from 'react';

interface WorkspaceIdMembersPageProps {
    params: {
        workspaceId: string;
    }
};

const WorkspaceIdMembersPage = async ({params}: WorkspaceIdMembersPageProps) => {
    const currentUser = await getCurrentUser();
    if(!currentUser) redirect("/sign-in");
  
    const initialValues = await getWorkspaceInfo({ workspaceId: params.workspaceId});
    if(!initialValues){
        redirect("/");
    }

  return (
    <div  className="w-full lg:max-w-xl">
        <MembersList initialValues={initialValues}/> 
    </div>
  )
}

export default WorkspaceIdMembersPage
