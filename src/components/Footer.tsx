import React from 'react'

import { Facebook, Linkedin, Instagram } from 'react-bootstrap-icons'
type Props = {}

const Footer = (props: Props) => {
  return (
    <div className='flex flex-col h-full w-full relative justify-center items-center my-10'>
        <div className='flex flex-row w-[40%] h-full gap-y-5 justify-between items-center'>
            <p className='text-agm-light-blue'>© 2023 AGM Trader Broker & Advisor, todos los derechos reservados.</p>
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