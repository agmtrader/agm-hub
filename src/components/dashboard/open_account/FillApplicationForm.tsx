"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { DataTable } from '@/components/dashboard/components/DataTable';
import { Map, Ticket } from '@/lib/types';

import { getDefaults } from '@/utils/form';
import { about_you_primary_schema, about_you_secondary_schema, regulatory_schema } from '@/lib/schemas';

interface Props {
  ticket: Ticket,
  setCanContinue: React.Dispatch<React.SetStateAction<boolean>>
}

const FillApplicationForm = ({ticket, setCanContinue}:Props) => {
  
  // Initialize data variables
  const [primaryHolderInfo, setPrimaryHolderInfo] = useState<Map | null>(null)
  const [secondaryHolderInfo, setSecondaryHolderInfo] = useState<Map | null>(null)
  const [regulatoryInfo, setRegulatoryInfo] = useState<Map | null>(null)

  const primaryDefaultValues = getDefaults(about_you_primary_schema(t => t))
  const secondaryDefaultValues = getDefaults(about_you_secondary_schema(t => t))
  const regulatoryDefaultValues = getDefaults(regulatory_schema(t => t))

  // Query
  useEffect(() => {
    
    async function queryData () {

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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 100
      }
    }
  }

  return (
    <motion.div 
      className='w-full max-w-7xl h-fit gap-5 text-foreground flex flex-col justify-center items-center'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className='text-7xl text-foreground font-bold'
        variants={itemVariants}
      >
        Open Account.
      </motion.h1>

      {primaryHolderInfo && Object.keys(primaryHolderInfo).length > 0 && 
        <motion.div className='w-full flex flex-col gap-5' variants={itemVariants}>
          <p className='text-lg font-semibold'>Primary Holder Information</p>
          <DataTable data={[primaryHolderInfo]} width={100}/>
        </motion.div>
      }

      {secondaryHolderInfo && Object.keys(secondaryHolderInfo).length > 0 &&
        <motion.div className='w-full flex flex-col gap-5' variants={itemVariants}>
          <p className='text-lg font-semibold'>Secondary Holder Information</p>
          <DataTable data={[secondaryHolderInfo]} width={100}/>
        </motion.div>
      }
      
      {regulatoryInfo && Object.keys(regulatoryInfo).length > 0 &&
        <motion.div className='w-full flex flex-col gap-5' variants={itemVariants}>
          <p className='text-lg font-semibold'>Regulatory Information</p>
          <DataTable data={[regulatoryInfo]} width={100}/>
        </motion.div>
      }

    </motion.div>
  )
}

export default FillApplicationForm
