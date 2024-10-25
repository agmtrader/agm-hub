import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Header } from '@/components/Header'
import { signIn, useSession } from 'next-auth/react'
import { motion } from 'framer-motion' // Add this import
import ShimmerButton from '@/components/ui/shimmer-button'

interface Props {
  setStarted: React.Dispatch<React.SetStateAction<boolean>>
}

const Title = ({setStarted}:Props) => {
  const {data:session} = useSession()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  }

  return (
    <div className='w-full h-screen flex flex-col'>
      <Header/>
      <div className='flex-1 flex flex-col gap-y-10 bg-[url(/images/bull.jpg)] w-full bg-cover bg-center z-0 justify-center items-center relative overflow-hidden'>
        <div className='w-full h-full opacity-60 bg-primary-dark absolute z-1'></div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className='z-10 flex flex-col gap-y-8 justify-center items-center text-center px-4'
        >
          <motion.h1 variants={itemVariants} className='text-6xl md:text-7xl font-bold text-background'>
            Ready to make money?
          </motion.h1>
          <motion.p variants={itemVariants} className='text-2xl md:text-3xl text-background max-w-2xl'>
            Unlock the world of financial opportunities with your AGM trading account.
          </motion.p>
          {!session?.user ? 
            <motion.div variants={itemVariants} className='flex flex-col sm:flex-row w-full gap-5 justify-center items-center mt-4'>
              <Button 
                onClick={(e) => {
                  e.preventDefault()
                  signIn('', {callbackUrl: '/apply/account'})
                }}
                className="w-full sm:w-auto px-8 py-3 text-lg font-semibold"
              >
                Sign In
              </Button>
              <Button className="w-full sm:w-auto px-8 py-3 text-lg font-semibold">
                <Link href='/create-account'>
                  Create Account
                </Link>
              </Button>
            </motion.div>
            :
            <motion.div variants={itemVariants}>
              <ShimmerButton
                onClick={() => setStarted(true)}
                className="px-8 py-3 text-lg font-semibold mt-4"
                background='#22c55e'
              >
                Start Application
              </ShimmerButton>
            </motion.div>
          }
        </motion.div>
      </div>
    </div>
  )
}

export default Title