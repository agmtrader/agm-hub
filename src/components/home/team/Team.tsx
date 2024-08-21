import React from 'react'
import { TeamCarousel } from './Carousel'
import { Button } from '@/components/ui/button'

type Props = {}

const Team = (props: Props) => {
  return (
    <div className='h-full w-full flex flex-col justify-center gap-y-10 items-center'>
        <p className='text-5xl font-bold'>Meet Our Team</p>
        <TeamCarousel/>
        <Button> Contact us. </Button>
    </div>
  )
}

export default Team