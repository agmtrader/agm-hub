import LoadingComponent from '@/components/misc/LoadingComponent'
import { Loader2 } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <div className='h-screen w-screen bg-secondary-dark flex justify-center items-center'>
        <Loader2 className='animate-spin text-white' />
    </div>
  )
}

export default page