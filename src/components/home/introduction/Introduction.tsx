import React from 'react'
import { Button } from '@/components/ui/button'

const Introduction = () => {
  return (
    <div className='flex flex-col h-full w-full justify-center items-center py-10'>
      <div className='flex flex-col h-full w-[50%] text-center gap-y-10 justify-center items-center'>
        <p className='text-5xl font-bold'>Empowering Today's Traders for Tomorrows Markets</p>
        <p className='text-xl font-light text-agm-gray'>
        Since 1995, AGM as an International Securities Broker/Dealer has facilitated 
        direct access to more than 150 financial markets (Securities Exchanges) in the
        US, Europe, Asia and Latin America, otherwise unavailable to certain investors. 
        </p>
        <p className='text-xl font-light text-agm-gray'>
          Our clients can trade and invest the following assets 24/7 in more than 20 different currencies from a single account:
        </p>
        <ul className='text-xl text-agm-blue font-light text-agm-gray'>
          <li>
            Stocks
          </li>
          <li>
            ETFs
          </li>
          <li>
            Bonds
          </li>
          <li>
            Mutual Funds
          </li>
          <li>
            Options
          </li>
          <li>
            Futures
          </li>
          <li>
            and <span className='font-bold'>more</span>.
          </li>
        </ul>
        <p className='text-xl font-light'>through our specialized apps and services.</p>
        <Button>
          Learn more.
        </Button>
      </div>
    </div>
  )
}

export default Introduction