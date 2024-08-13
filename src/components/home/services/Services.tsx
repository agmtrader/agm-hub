import { Handshake } from 'lucide-react'
import React from 'react'
import { GraphUpArrow, Mortarboard } from 'react-bootstrap-icons'

const services = [
  {
    name: 'AGM Trader',
    icon: <GraphUpArrow className='text-white h-[15vw] w-[15vw]'/>
  },
  {
    name: 'AGM Advisor',
    icon: <Mortarboard className='text-white h-[15vw] w-[15vw]'/>
  },
  {
    name: 'AGM Institutional',
    icon: <Handshake className='text-white h-[15vw] w-[15vw]'/>
  }
]

function Services() {
  return (
    <div className='flex flex-col h-full w-full'>
      <div className='bg-agm-blue w-full h-full justify-center items-center flex flex-col gap-y-16 py-20'>
        <h2 className='text-agm-white text-5xl font-bold'>Our Services</h2>
        
        <div className='flex items-center justify-evenly w-full'>
          {services.map((element, index) => (
              <div key={index} className='w-fit h-full gap-y-10 flex flex-col justify-center items-center rounded-3xl p-[5vw] bg-agm-dark-blue'>
                {element.icon}
                <p className='text-white font-bold'>{element.name}</p>
              </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Services