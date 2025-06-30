'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Contact } from '@/lib/entities/contact'
import ContactCard from './ContactCard'

interface ContactViewProps {
  contact: Contact
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const ContactView = ({ contact, isOpen, onOpenChange }: ContactViewProps) => {

  if (!contact) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Contact Overview</DialogTitle>
        </DialogHeader>
        <ContactCard contact={contact} />
      </DialogContent>
    </Dialog>
  )
}

export default ContactView 