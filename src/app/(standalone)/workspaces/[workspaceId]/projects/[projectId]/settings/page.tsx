import { getCurrentUser } from '@/features/auth/queries'
import React from 'react'
import { ProjectIdSettingsClient } from './client';

const ProjectIdSettingsPage = async () => {
    const currentUser = getCurrentUser();
    if(!currentUser) return ("/sign-in");

  return (
    <ProjectIdSettingsClient />
  )
}

export default ProjectIdSettingsPage
