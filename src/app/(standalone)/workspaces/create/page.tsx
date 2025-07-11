{/** when new user is registred he will redirect first on this page and have to create a workspaces before */}
import { getCurrentUser } from '@/features/auth/queries';
import { CreateWorkspaceForm } from '@/features/workspaces/components/create-workspace-form';
import { redirect } from 'next/navigation';
import React from 'react'

const WorkspaceCreatePage = async () => {
  const currentUser = await getCurrentUser();
  if(!currentUser) redirect("/sign-in");
  
  return (
    <div className='w-full lg:max-w-xl'>
      <div className='flex flex-col gap-y-2 mb-4'>
        <h1 className="text-xl font-bold">Welcome to TaskFlow</h1>
        <p className='text-muted-foreground font-medium text-lg'>Onboarding process </p>
      </div>
      <CreateWorkspaceForm />
    </div>
  )
}

export default WorkspaceCreatePage;
