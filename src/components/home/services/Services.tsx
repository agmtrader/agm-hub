import React from 'react'

const services = [
  {
    name: 'AGM Trader'
  },
  {
    name: 'AGM Advisor'
  },
  {
    name: 'AGM Institutional'
  }
]

function Services() {
  return (
    <div className='flex flex-col h-full w-[104.4%] -mx-[2.2%]'>
      <div className='bg-agm-light-orange w-full h-full justify-center items-center flex flex-col gap-y-10 py-20'>
        <h2 className='text-agm-white text-5xl font-bold'>Our Services</h2>
        <div className='flex items-center justify-center h-full w-[70%] gap-x-10'>
          {services.map((element, index) => (
              <div key={index} className='w-full h-[50vh] flex flex-col justify-between py-10 gap-y-5 items-center'>
                <div className='h-fit w-fit'>
                  <p className='text-2xl text-agm-white font-light'>{element.name}</p>
                </div>
                <div className='w-full h-full rounded-3xl bg-agm-dark-orange'></div>
              </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Services