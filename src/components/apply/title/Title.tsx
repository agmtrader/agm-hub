'use client'
import React, { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { motion } from 'framer-motion'
import ShimmerButton from '@/components/ui/shimmer-button'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { containerVariants, itemVariants } from '@/lib/anims'
import Link from 'next/link'
import { formatURL } from '@/utils/language/lang'
import { useSearchParams } from 'next/navigation'
import { ReadApplicationByLeadID } from '@/utils/entities/application'
import { ReadLeadByID, UpdateLeadByID } from '@/utils/entities/lead'
import { toast } from '@/hooks/use-toast'
import { formatTimestamp } from '@/utils/dates'

interface Props {
  setStarted: React.Dispatch<React.SetStateAction<boolean>>
}

const Title = ({ setStarted }:Props) => {

  const { t, lang } = useTranslationProvider()
  const searchParams = useSearchParams()
  const [isCheckingApplication, setIsCheckingApplication] = useState(false)
  const [existingApplicationError, setExistingApplicationError] = useState(false)
  const [leadNotFoundError, setLeadNotFoundError] = useState(false)

  useEffect(() => {
    checkLeadAndApplication()
  }, [searchParams])

  async function checkLeadAndApplication() {
    const leadId = searchParams.get('ld')
    if (!leadId) return

    setIsCheckingApplication(true)
    try {
      // First check if the lead exists
      const leadData = await ReadLeadByID(leadId)
      console.log(leadData)
      if (!leadData || !leadData.leads || leadData.leads.length === 0) {
        setLeadNotFoundError(true)
        toast({
          title: "Lead Not Found",
          description: "The lead ID provided is invalid or does not exist.",
          variant: "destructive"
        })
        return
      }

      // Check if the lead is closed
      if (leadData.leads[0].closed) {
        setLeadNotFoundError(true)
        toast({
          title: "Lead Closed",
          description: "The lead has already been closed. Please contact support for more information.",
          variant: "destructive"
        })
        return
      }

      // If lead exists, check for existing application
      const existingApplication = await ReadApplicationByLeadID(leadId)
      if (existingApplication) {
        setExistingApplicationError(true)
        toast({
          title: "Application Already Exists",
          description: "An application has already been submitted for this lead. Please contact support for more information.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error checking lead and application:', error)
      toast({
        title: "Validation Error",
        description: "Unable to validate lead information. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsCheckingApplication(false)
    }
  }

  async function handleStartApplication() {

    const leadId = searchParams.get('ld')

    if (leadNotFoundError) {
      toast({
        title: "Invalid Lead",
        description: "Cannot start application with an invalid lead ID.",
        variant: "destructive"
      })
      return
    }

    if (existingApplicationError) {
      toast({
        title: "Cannot Start Application",
        description: "An application already exists for this lead.",
        variant: "destructive"
      })
      return
    }

    if (leadId) {
      await UpdateLeadByID(leadId, {
        closed: formatTimestamp(new Date())
      })
    }
    setStarted(true)
  }

  const hasError = leadNotFoundError || existingApplicationError

  return (
    <div className='w-full h-screen flex flex-col'>
      <Header/>
      <div className='flex-1 flex flex-col gap-y-10 bg-[url(/assets/backgrounds/bull.jpg)] w-full bg-cover bg-center z-0 justify-center items-center relative overflow-hidden'>
        <div className='w-full h-full opacity-60 bg-secondary-dark absolute z-1'></div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className='z-10 flex flex-col gap-y-8 justify-center items-center text-center px-4'
        >
          <motion.h1 variants={itemVariants} className='text-6xl md:text-7xl font-bold text-background'>
            {t('apply.account.title.ready')}
          </motion.h1>
          <motion.p variants={itemVariants} className='text-2xl md:text-3xl text-background max-w-2xl'>
            {t('apply.account.title.description')}
          </motion.p>
          <motion.div variants={itemVariants}>
            <p className='text-md text-background'>
              {t('apply.account.title.get_started')} <Link href={formatURL('/requirements', lang)} className='text-primary'>{t('apply.account.title.get_started_link')}</Link>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className='flex w-full gap-x-5 justify-center items-center'
          >
          </motion.div>
          <motion.div variants={itemVariants}>
            <ShimmerButton
              onClick={handleStartApplication}
              className={`px-8 py-3 text-lg font-semibold mt-4 ${hasError ? 'opacity-50 cursor-not-allowed' : ''}`}
              background={hasError ? '#6b7280' : '#22c55e'}
              disabled={isCheckingApplication || hasError}
            >
                <p className="text-sm">
                  {isCheckingApplication 
                    ? 'Validating...' 
                    : leadNotFoundError
                      ? 'Invalid Lead'
                      : existingApplicationError 
                        ? 'Application Exists' 
                        : t('apply.account.title.startApplication')
                  }
                </p>
            </ShimmerButton>
          </motion.div>
          {/*
            <motion.div variants={itemVariants}>
              <PreviousApplications setAccount={setAccount} setStarted={setStarted}/>
            </motion.div>
          */}
        </motion.div>
      </div>
    </div>
  )
}

export default Title