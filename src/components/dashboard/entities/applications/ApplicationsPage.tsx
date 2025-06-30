"use client"
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DataTable } from '@/components/misc/DataTable';
import { itemVariants } from '@/lib/anims';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingComponent from '@/components/misc/LoadingComponent';
import { redirect } from 'next/navigation';
import { formatURL } from '@/utils/language/lang';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { Label } from '@/components/ui/label';
import { ReadApplications } from '@/utils/entities/application';
import { InternalApplication } from '@/lib/entities/application';

const ApplicationsPage = () => {

  const {lang} = useTranslationProvider()
  const [applications, setApplications] = useState<InternalApplication[] | null>(null)
  const [showAll, setShowAll] = useState(false)

  const handleRowClick = (row: InternalApplication) => {
    redirect(formatURL(`/dashboard/applications/${row.id}`, lang))
  }

  useEffect(() => {

    async function fetchData () {

        const applications = await ReadApplications()
        setApplications(applications)
    }

    fetchData()

  }, [showAll])

  if (!applications) return <LoadingComponent className='w-full h-full' />

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox
          id="showAll"
          checked={showAll}
          onCheckedChange={(checked) => setShowAll(checked as boolean)}
        />
        <Label htmlFor="showAll">Show all applications</Label>
      </div>
      <motion.div variants={itemVariants} className="w-full">
        <DataTable 
          data={applications}
          infiniteScroll
          enableRowActions
          rowActions={[
            {
              label: 'View',
              onClick: (row: InternalApplication) => handleRowClick(row)
            }
          ]}
        />
      </motion.div>
    </div>
  )
}

export default ApplicationsPage