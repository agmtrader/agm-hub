import LoadingComponent from '@/components/misc/LoadingComponent'
import { Loader2 } from 'lucide-react'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div className='h-screen w-screen bg-primary-dark flex justify-center items-center'>
        <LoadingComponent />
        <Loader2 className='animate-spin text-white' />
    </div>
  )
}

export default page