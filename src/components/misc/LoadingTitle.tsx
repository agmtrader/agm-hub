import { Loader2 } from 'lucide-react'
import React from 'react'

const LoadingTitle = () => {
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center gap-y-5'>
      <Loader2 className='w-24 h-24 animate-spin text-primary' />
      <p className='text-7xl font-bold'>Loading...</p>
      <p className='text-xl text-subtitle'>Stay laserfocused.</p>
    </div>
  )
}

export default LoadingTitle