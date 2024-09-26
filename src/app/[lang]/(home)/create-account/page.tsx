"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { HardHat } from 'lucide-react'

const CreateAccount = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-y-3">
        <HardHat className='w-20 h-20 text-foreground'/>
      <h1 className="text-7xl font-bold text-agm-dark-blue">Under Development</h1>
      <p className="text-lg text-subtitle mt-2">Please check back later.</p>
      <Button asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  )
}

export default CreateAccount
