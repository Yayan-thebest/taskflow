import { getCurrentUser } from '@/features/auth/queries';
import React from 'react'
import { ProjectIdClient } from './client';



const ProjectIdPage = async () => {
    const currentUser = await getCurrentUser();
    if(!currentUser) return ("sign-in");

  return (
    <ProjectIdClient />
  )
}

export default ProjectIdPage;
