import { Card } from '@/components/ui/card'
import { Contact } from '@/lib/entities/contact'
import { countries } from '@/lib/form'
import React from 'react'

interface Props {
  contact: Contact
  title?: string
}

const ContactCard = ({ contact, title }: Props) => {
  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">{title || 'Basic Information'}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-foreground font-medium text-md">Contact</p>
          <p className="text-subtitle text-sm">{contact?.ContactName || 'Loading...'}</p>
        </div>
        <div>
          <p className="text-foreground font-medium text-md">Email</p>
          <p className="text-subtitle text-sm">{contact?.ContactEmail || '-'}</p>
        </div>
        <div>
          <p className="text-foreground font-medium text-md">Phone</p>
          <p className="text-subtitle text-sm">{contact?.ContactPhone || '-'}</p>
        </div>
        <div>
          <p className="text-foreground font-medium text-md">Country</p>
          <p className="text-subtitle text-sm">{countries.find(c => c.value === contact?.ContactCountry)?.label || '-'}</p>
        </div>
        <div>
          <p className="text-foreground font-medium text-md">Company</p>
          <p className="text-subtitle text-sm">{contact?.CompanyName || '-'}</p>
        </div>
      </div>
    </Card>
  )
}

export default ContactCard