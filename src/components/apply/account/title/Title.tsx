import React from 'react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import Link from 'next/link'
import Account from '@/components/sidebar/Account'
import { Header } from '@/components/Header'
import { useSession } from 'next-auth/react'

interface Props {
  setStarted: React.Dispatch<React.SetStateAction<boolean>>
}

const Title = ({setStarted}:Props) => {

  const {data:session} = useSession()
  console.log(session)

  return (
    <div className='w-full h-fit flex flex-col'>
      <Header/>
      <div className='flex flex-col gap-y-10 bg-[url(/images/bull.jpg)] h-[100vh] w-full bg-cover bg-center z-0 justify-center items-center'>
        <div className='w-full h-full opacity-40 bg-primary-dark absolute z-1'></div>
        <div className='z-10 flex flex-col gap-y-5 justify-center items-center'>
          <Image src={'/images/brand/agm-logo-white.png'} alt = 'AGM Logo' height = {100} width = {300}/>
          <p className='text-7xl font-bold text-background'>Account Application Form</p>
          {
            session ? 
            <div className='flex flex-col justify-center items-center gap-y-5'>
              <Button onClick={() => setStarted(true)}>Get started.</Button>
            </div>
            :
            <Account/>
          }
        </div>
      </div>
    </div>
  )
}

export default Title