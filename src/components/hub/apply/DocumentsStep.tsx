'use client'
import { ReadApplicationDocumentHolders } from '@/utils/clients/read-batches'
import { Button } from '@/components/ui/button'

import React, { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Application } from '@/lib/clients/application'
import ContactDocuments from './ContactDocuments'
import { ReadContactByID } from '@/utils/clients/contact'
import { ReadAccountContacts } from '@/utils/clients/account'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DocumentsStepProps {
  form?: UseFormReturn<Application>
  formData?: Application
  accountId?: string | null
}

const DocumentsStep = ({ accountId }: DocumentsStepProps) => {
  const [contacts, setContacts] = useState<Array<{ id: string; name: string }>>([])

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    setContacts([])
    setError(null)
    const resolveContacts = async () => {
      if (!accountId) {
        setContacts([])
        return
      }

      setLoading(true)
      try {
        const rows = await ReadApplicationDocumentHolders(accountId)
        if (active) setContacts(rows)
      } catch (failure) {
        if (active) setError(failure instanceof Error ? failure.message : 'Document holders could not be loaded.')
      } finally { if (active) setLoading(false) }
    }

    void resolveContacts()
    return () => { active = false }
  }, [accountId, attempt])

  if (!accountId) {
    return (
      <Card>
        <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
        <CardContent>Save personal info first to create account/contact links.</CardContent>
      </Card>
    )
  }

  if (error) return <div role="alert"><p>{error}</p><Button onClick={() => setAttempt(value => value + 1)}>Try again</Button></div>
  if (loading) return <p role="status">Loading document holders…</p>
  return (
    <div className="space-y-4">
      {contacts.map((c) => (
        <ContactDocuments key={c.id} contactId={c.id} accountId={accountId} holderName={c.name} />
      ))}
    </div>
  )
}

export default DocumentsStep
