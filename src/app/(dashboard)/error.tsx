"use client";
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link';
import React from 'react'

const ErrorPage = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='max-h-fit flex flex-col gap-y-4 items-center justify-center'>
        <AlertTriangle className='size-7 mr-2 text-muted-foreground'/>
        <p className='text-sm text-muted-foreground'>An error occured. Please try again.</p>
        <Button variant={"secondary"} size={"default"} className='' asChild>
          <Link href={"/"}>
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default ErrorPage
