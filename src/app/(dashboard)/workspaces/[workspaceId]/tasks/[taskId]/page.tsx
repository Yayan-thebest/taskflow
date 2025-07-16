import { getCurrentUser } from '@/features/auth/queries';
import { redirect } from 'next/navigation';
import React from 'react'
import { TaskIdClient } from './client';

const TaskIdPage = async () => {

    const currentUser = await getCurrentUser();
    if(!currentUser) redirect("/sign-in");
          
  return (
    <TaskIdClient />
  )
}

export default TaskIdPage
