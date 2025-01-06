'use client'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import React, { useEffect, useState } from 'react'
import { accessAPI } from '@/utils/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { motion } from 'framer-motion'
import { formatURL } from '@/utils/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const Page = () => {

  const [documents, setDocuments] = useState<any[]>([])
  const { lang } = useTranslationProvider()

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await accessAPI('/drive/get_files_in_folder', 'POST', {
          parent_id: '18Gtm0jl1HRfb1B_3iGidp9uPvM5ZYhOF',
        })
        setDocuments(response['content'])
      } catch (error) {
        console.error('Error fetching CSV:', error)
      }
    }
    fetchData()
  }, [])

  if (documents && documents.length === 0) return <LoadingComponent/>

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  }


  return (
    <div className="w-full h-full flex flex-col gap-5 items-center justify-start">
      <div className="flex flex-col items-center justify-center gap-5">
        <motion.h1 
          variants={fadeIn}
          className="text-7xl font-bold text-foreground"
        >
          Reporting Center
        </motion.h1>
        <motion.p className='text-lg text-subtitle' variants={fadeIn}>
          Download, transform and backup daily reports.
        </motion.p>
      </div>
      <Link href={formatURL('/dashboard/reporting/generate', lang)}> 
        <Button>
          Generate Reports
        </Button>
      </Link>
    </div>
  )
}

export default Page

const RawReports = ({documents}:{documents:any}) => {

  const router = useRouter()
  const {lang} = useTranslationProvider()
  function redirectToReport(reportId: string) {
    router.push(formatURL(`/dashboard/reporting/${reportId}`, lang))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
      {documents.map((doc:any) => (
        <Card 
          key={doc.id} 
          className='hover:shadow-lg w-96 transition-shadow cursor-pointer'
          onClick={() => redirectToReport(doc.id)}
        >
          <CardHeader className="font-semibold">{doc.name}</CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Last modified: {new Date(doc.modifiedTime).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      ))}
  </div>
  )
}