'use client'

import React, { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Application } from '@/lib/clients/application'
import ContactDocuments from './ContactDocuments'
import { ReadContactByID } from '@/utils/clients/contact'
import { ReadAccountContacts } from '@/utils/clients/account_contact'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DocumentsStepProps {
  form?: UseFormReturn<Application>
  formData?: Application
  accountId?: string | null
}

const DocumentsStep = ({ accountId }: DocumentsStepProps) => {
  const [contacts, setContacts] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    const resolveContacts = async () => {
      if (!accountId) {
        setContacts([])
        return
      }

      const links = await ReadAccountContacts({ account_id: accountId })
      const resolvedContacts = await Promise.all(
        links
          .map((link) => String(link.contact_id || '').trim())
          .filter(Boolean)
          .map((contactId) => ReadContactByID(contactId))
      )

      const deduped = Array.from(
        new Map(
          resolvedContacts
            .filter((contact) => Boolean(contact?.id))
            .map((contact) => [
              String(contact!.id),
              {
                id: String(contact!.id),
                name: contact!.company_name || contact!.name || contact!.email || String(contact!.id),
              },
            ])
        ).values()
      )

      setContacts(deduped)
    }

    void resolveContacts()
  }, [accountId])

  if (!accountId) {
    return (
      <Card>
        <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
        <CardContent>Save personal info first to create account/contact links.</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {contacts.map((c) => (
        <ContactDocuments key={c.id} contactId={c.id} accountId={accountId} holderName={c.name} />
      ))}
    </div>
  )
}

export default DocumentsStep
