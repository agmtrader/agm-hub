'use client'

import React, { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Application } from '@/lib/entities/application'
import ContactDocuments from './ContactDocuments'
import { ReadContactByEmail } from '@/utils/entities/contact'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DocumentsStepProps {
  form?: UseFormReturn<Application>
  formData?: Application
  accountId?: string | null
}

const DocumentsStep = ({ form, formData, accountId }: DocumentsStepProps) => {
  const data = formData || form?.getValues()
  const [contacts, setContacts] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    const resolveContacts = async () => {
      const out: Array<{ name: string; email?: string }> = []
      const customer: any = data?.customer
      if (!customer) return

      if (customer.type === 'INDIVIDUAL') {
        const h = customer.accountHolder?.accountHolderDetails?.[0]
        if (h?.name?.first || h?.name?.last) out.push({ name: `${h.name.first} ${h.name.last}`.trim(), email: h.email })
      } else if (customer.type === 'JOINT') {
        const first = customer.jointHolders?.firstHolderDetails?.[0]
        const second = customer.jointHolders?.secondHolderDetails?.[0]
        if (first?.name?.first || first?.name?.last) out.push({ name: `${first.name.first} ${first.name.last}`.trim(), email: first.email })
        if (second?.name?.first || second?.name?.last) out.push({ name: `${second.name.first} ${second.name.last}`.trim(), email: second.email })
      } else if (customer.type === 'ORG') {
        const individuals = customer.organization?.associatedEntities?.associatedIndividuals || []
        individuals.forEach((ind: any) => {
          if (ind?.name?.first || ind?.name?.last) out.push({ name: `${ind.name.first} ${ind.name.last}`.trim(), email: ind.email })
        })
      }

      const resolved: Array<{ id: string; name: string }> = []
      for (const c of out) {
        if (!c.email) continue
        const contact = await ReadContactByEmail(c.email)
        if (contact?.id) resolved.push({ id: contact.id, name: c.name })
      }
      setContacts(Array.from(new Map(resolved.map((c) => [c.id, c])).values()))
    }

    void resolveContacts()
  }, [data?.customer])

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
