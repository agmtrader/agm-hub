import React from 'react'
import { TeamCarousel } from './Carousel'

type Props = {}

const Team = (props: Props) => {
  return (
    <div className='h-full w-full flex flex-col justify-center gap-y-10 items-center'>
        <p className='text-5xl font-bold'>Our Team</p>
        <TeamCarousel/>
    </div>
  )
}

export default Team