'use client'
import { ReadApplicationDocumentHolders } from '@/utils/clients/read-batches'
import { Button } from '@/components/ui/button'

import React, { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Application } from '@/lib/clients/application'
import ContactDocuments from './ContactDocuments'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ApplicationSyncStatus from './ApplicationSyncStatus'
import { ApplicationSyncFailure } from '@/utils/clients/application-sync-feedback'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

interface DocumentsStepProps {
  form?: UseFormReturn<Application>
  formData?: Application
  accountId?: string | null
  contactSync?: 'pending' | 'ready' | 'failed'
  syncFailure?: ApplicationSyncFailure | null
  onRetryContacts?: () => void
  onReviewPersonalInfo?: () => void
}

const DocumentsStep = ({ accountId, contactSync = 'ready', syncFailure, onRetryContacts, onReviewPersonalInfo }: DocumentsStepProps) => {
  const { t } = useTranslationProvider()
  const [contacts, setContacts] = useState<Array<{ id: string; name: string }>>([])

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    setContacts([])
    setError(null)
    const resolveContacts = async () => {
      if (!accountId || contactSync !== 'ready') {
        setContacts([])
        return
      }

      setLoading(true)
      try {
        const rows = await ReadApplicationDocumentHolders(accountId)
        if (rows.length === 0) throw new Error('No document holders are linked to this application. Try contact setup again.')
        if (active) setContacts(rows)
      } catch {
        if (active) setError('load_failed')
      } finally { if (active) setLoading(false) }
    }

    void resolveContacts()
    return () => { active = false }
  }, [accountId, attempt, contactSync])

  if (!accountId) {
    return (
      <Card>
        <CardHeader><CardTitle>{t('forms.application_sync.documents_title')}</CardTitle></CardHeader>
        <CardContent>{t('forms.application_sync.save_first')}</CardContent>
      </Card>
    )
  }

  if (contactSync === 'pending') return <p role="status">{t('forms.application_sync.preparing')}</p>
  if (contactSync === 'failed') return <ApplicationSyncStatus failure={syncFailure || { kind: 'temporary' }}
    onRetry={onRetryContacts} onReviewPersonalInfo={onReviewPersonalInfo} />
  if (error) return <div role="alert"><p>{t('forms.application_sync.load_failed')}</p><Button type="button" onClick={() => setAttempt(value => value + 1)}>{t('forms.application_sync.retry')}</Button></div>
  if (loading) return <p role="status">{t('forms.application_sync.loading')}</p>
  return (
    <div className="space-y-4">
      {contacts.map((c) => (
        <ContactDocuments key={c.id} contactId={c.id} accountId={accountId} holderName={c.name} />
      ))}
    </div>
  )
}

export default DocumentsStep
