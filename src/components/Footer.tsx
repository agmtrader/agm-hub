import React from 'react'

import { Facebook, Linkedin, Instagram } from 'react-bootstrap-icons'

const Footer = () => {
  return (
      <div className='flex flex-col w-full h-full gap-y-5 p-10 justify-center items-center'>
          <div className='flex flex-row gap-x-5 justify-center items-center'>
            <Facebook size={'2vh'} color='#2571A5'/>
            <Instagram size={'2vh'} color='#2571A5'/>
            <Linkedin size={'2vh'} color='#2571A5'/>
          </div>
          <p className='text-agm-light-blue'>© 2023 AGM Trader Broker & Advisor, all rights reserved.</p>
      </div>
  )
}

export default Footer