"use client"
import { Button } from '@/components/ui/button'
import { updateFieldInDocument } from '@/utils/api'
import { useSession } from 'next-auth/react'
import React from 'react'

const page = () => {

  const {data:session} = useSession()

  async function onClick() {
    if (session) {
      await updateFieldInDocument(`users/${session.user.id}`, 'email', '')
    }
  }

  return (
    <div className='w-full h-[80vh] flex justify-center items-center'>
        <Button onClick={onClick}>Click me</Button>
    </div>
  )
}

export default page