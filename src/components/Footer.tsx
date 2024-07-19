import React from 'react'

import { Facebook, Linkedin, Instagram } from 'react-bootstrap-icons'
type Props = {}

const Footer = (props: Props) => {
  return (
    <div className='flex flex-col h-full w-full relative justify-center items-center my-16'>
        <div className='flex flex-row w-full h-full justify-center gap-x-10 items-center'>
            <p className='text-agm-light-blue'>© 2023 AGM Trader Broker & Advisor, all rights reserved.</p>
            <div className='flex flex-row gap-x-5 justify-center items-center'>
              <Facebook size={'3vh'} color='#2571A5'/>
              <Instagram size={'3vh'} color='#2571A5'/>
              <Linkedin size={'3vh'} color='#2571A5'/>
            </div>
        </div>
    </div>
  )
}

export default Footer