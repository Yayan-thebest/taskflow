import { getCurrentUser } from '@/features/auth/queries';
import { redirect } from 'next/navigation';
import React from 'react'
import { WorpaceIdClient } from './client';

const WorkspaceIdPage = async () => {
  const currentUser = await getCurrentUser();
  if(!currentUser) redirect("/sign-in");
  
  return (
    <div>
      <WorpaceIdClient />
    </div>
  )
}

export default WorkspaceIdPage;
