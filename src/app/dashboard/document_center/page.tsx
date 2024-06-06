import React from 'react'
import { Button } from '@/components/ui/button'

type Props = {}

const page = (props: Props) => {
  return (
    <div>
        <div className='flex gap-x-5'>
            <Button className='w-fit h-fit'> Upload POA</Button>
            <Button className='w-fit h-fit'> Upload POI</Button>
            <Button className='w-fit h-fit'> Upload POW</Button>
        </div>
    </div>
  )
}

export default page