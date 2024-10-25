import { Loader2 } from 'lucide-react'
import React from 'react'

type Props = {}

const LoadingComponent = (props: Props) => {
  return (
    <div className='flex flex-col w-full h-full justify-center items-center gap-5'>
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  )
}

export default LoadingComponent