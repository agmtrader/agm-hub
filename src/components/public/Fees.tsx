'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const Fees = () => {
  const { t } = useTranslationProvider()

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('fees.managed_accounts.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Management Fees */}
            <div className="flex flex-col justify-between gap-2">
              <span className="font-semibold">{t('fees.managed_accounts.management_fees_label')}</span>
              <span>{t('fees.managed_accounts.management_fees_value')}</span>
            </div>
            {/* Execution Costs */}
            <div className="flex flex-col justify-between gap-2">
              <span className="font-semibold">{t('fees.managed_accounts.execution_costs_label')}</span>
              <span>{t('fees.managed_accounts.execution_costs_value')}</span>
            </div>
            {/* Custody Fees */}
            <div className="flex flex-col justify-between gap-2">
              <span className="font-semibold">{t('fees.managed_accounts.custody_fees_label')}</span>
              <span>{t('fees.managed_accounts.custody_fees_value')}</span>
            </div>
            {/* Other Fees */}
            <div className="flex flex-col justify-between gap-2">
              <span className="font-semibold">{t('fees.managed_accounts.other_fees_label')}</span>
              <span>
                <span className="text-subtitle">{t('fees.managed_accounts.other_fees_wires')}</span><br />
                <span className="text-subtitle">{t('fees.managed_accounts.other_fees_domestic')}</span><br />
                <span className="text-subtitle">{t('fees.managed_accounts.other_fees_international')}</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Self-Directed Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>{t('fees.self_directed_accounts.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Management Fees */}
            <div className="flex flex-col justify-between gap-2">
              <span className="font-semibold">{t('fees.self_directed_accounts.management_fees_label')}</span>
              <span>{t('fees.self_directed_accounts.management_fees_value')}</span>
            </div>
            {/* Execution Costs */}
            <div className="flex flex-col justify-between gap-2">
              <span className="font-semibold">{t('fees.self_directed_accounts.execution_costs_label')}</span>
              <span>{t('fees.self_directed_accounts.execution_costs_value')}</span>
            </div>
            {/* Custody Fees */}
            <div className="flex flex-col justify-between gap-2">
              <span className="font-semibold">{t('fees.self_directed_accounts.custody_fees_label')}</span>
              <span>{t('fees.self_directed_accounts.custody_fees_value')}</span>
            </div>
            {/* Other Fees */}
            <div className="flex flex-col justify-between gap-2">
              <span className="font-semibold">{t('fees.self_directed_accounts.other_fees_label')}</span>
              <span>
                <span className="text-subtitle">{t('fees.self_directed_accounts.other_fees_wires')}</span><br />
                <span className="text-subtitle">{t('fees.self_directed_accounts.other_fees_domestic')}</span><br />
                <span className="text-subtitle">{t('fees.self_directed_accounts.other_fees_international')}</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footnote */}
      <p className="max-w-2xl text-xs text-center text-red-500 mt-4">{t('fees.footnote')}</p>
    </div>
  )
}

export default Fees
