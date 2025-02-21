"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { DataTable } from '@/components/dashboard/components/DataTable';
import { Map, Ticket } from '@/lib/types';

import { getDefaults } from '@/utils/form';
import { about_you_primary_schema, about_you_secondary_schema, general_info_schema, regulatory_schema } from '@/lib/schemas/ticket';
import DashboardPage from '@/components/misc/DashboardPage';
import { itemVariants } from '@/lib/anims';

interface Props {
  ticket: Ticket,
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>
}

const FillApplicationForm = ({ticket, setCanContinue}:Props) => {
  
  // Initialize data variables
  const [primaryHolderInfo, setPrimaryHolderInfo] = useState<Map | null>(null)
  const [secondaryHolderInfo, setSecondaryHolderInfo] = useState<Map | null>(null)
  const [regulatoryInfo, setRegulatoryInfo] = useState<Map | null>(null)
  const [generalInfo, setGeneralInfo] = useState<Map | null>(null)
  const generalInfoValues = getDefaults(general_info_schema(t => t))
  const primaryDefaultValues = getDefaults(about_you_primary_schema(t => t))
  const secondaryDefaultValues = getDefaults(about_you_secondary_schema(t => t))
  const regulatoryDefaultValues = getDefaults(regulatory_schema(t => t))

  // Query
  useEffect(() => {
    
    async function queryData () {

      let generalInfo:Map = {}
      if (ticket) {
        Object.keys(generalInfoValues).forEach((key:any) => {
          generalInfo[key] = ticket[key as keyof Ticket]
        })
      }
      setGeneralInfo(generalInfo)

      let primaryHolderInfo:Map = {}
      if (ticket) {
        Object.keys(primaryDefaultValues).forEach((key:any) => {
          primaryHolderInfo[key] = ticket[key as keyof Ticket]
        })
      }
      setPrimaryHolderInfo(primaryHolderInfo)

      let secondaryHolderInfo:Map = {}
      if (ticket && ticket['account_type' as keyof Ticket] === 'Joint') {
        Object.keys(secondaryDefaultValues).forEach((key:any) => {
          secondaryHolderInfo[key] = ticket['secondary_' + key as keyof Ticket]
        })
      }
      setSecondaryHolderInfo(secondaryHolderInfo)

      let regulatoryInfo:Map = {}
      if (ticket) {
        Object.keys(regulatoryDefaultValues).forEach((key:any) => {
          regulatoryInfo[key] = ticket[key as keyof Ticket]
        })
      }
      setRegulatoryInfo(regulatoryInfo)

      setCanContinue(true)
      
    }
    
    queryData()
  }, [])

  return (
    <DashboardPage title='Fill out the application form' description=''>

      {generalInfo && Object.keys(generalInfo).length > 0 &&
        <motion.div className='w-full max-w-7xl flex flex-col gap-5' variants={itemVariants}>
          <p className='text-lg font-semibold'>General Information</p>
          <DataTable data={[generalInfo]}/>
        </motion.div>
      }

      {primaryHolderInfo && Object.keys(primaryHolderInfo).length > 0 && 
        <motion.div className='w-full max-w-7xl flex flex-col gap-5' variants={itemVariants}>
          <p className='text-lg font-semibold'>Primary Holder Information</p>
          <DataTable data={[primaryHolderInfo]}/>
        </motion.div>
      }

      {secondaryHolderInfo && Object.keys(secondaryHolderInfo).length > 0 &&
        <motion.div className='w-full max-w-7xl flex flex-col gap-5' variants={itemVariants}>
          <p className='text-lg font-semibold'>Secondary Holder Information</p>
          <DataTable data={[secondaryHolderInfo]}/>
        </motion.div>
      }
      
      {regulatoryInfo && Object.keys(regulatoryInfo).length > 0 &&
        <motion.div className='w-full max-w-7xl flex flex-col gap-5' variants={itemVariants}>
          <p className='text-lg font-semibold'>Regulatory Information</p>
          <DataTable data={[regulatoryInfo]}/>
        </motion.div>
      }

    </DashboardPage>
  )
}

export default FillApplicationForm
