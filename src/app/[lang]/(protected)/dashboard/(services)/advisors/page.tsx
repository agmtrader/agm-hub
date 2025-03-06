'use client'

import { ColumnDefinition } from '@/components/misc/DataTable'
import DashboardPage from '@/components/misc/DashboardPage'
import { toast } from '@/hooks/use-toast'
import { Advisor } from '@/lib/entities/advisor'
import { accessAPI } from '@/utils/api'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import AdvisorsPage from '@/components/dashboard/advisors/AdvisorsPage'

const page = () => {

    return (
        <DashboardPage title='Advisor Center' description='Manage, contact and more'>
            <AdvisorsPage />
        </DashboardPage>
  )
}

export default page