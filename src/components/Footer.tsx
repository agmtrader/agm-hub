import React from 'react'
import { Linkedin, Facebook, Instagram } from 'react-bootstrap-icons'

const Footer = () => {
  return (
      <div className='flex flex-col w-full h-full gap-y-5 p-10 justify-center items-center'>
          <div className='flex flex-row gap-x-5 justify-center items-center'>
            <Linkedin className='text-secondary text-3xl'/>
            <Facebook className='text-secondary text-3xl'/>
            <Instagram className='text-secondary text-3xl'/>
          </div>
          <p className='text-secondary-light'>© 2023 AGM Trader Broker & Advisor, all rights reserved.</p>
      </div>
  )
}

export default Footer