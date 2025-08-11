'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { useFormContext } from 'react-hook-form'
import { Application } from '@/lib/entities/application'
import { sendEmailConfirmationEmail } from '@/utils/tools/email'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

interface EmailConfirmationDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onConfirmed: () => void
}

const EmailConfirmationDialog: React.FC<EmailConfirmationDialogProps> = ({ isOpen, setIsOpen, onConfirmed }) => {
  const { getValues } = useFormContext<Application>()

  const { lang } = useTranslationProvider()

  // Figure out the primary email based on account type/structure
  const accountType = getValues('customer.type') as 'INDIVIDUAL' | 'JOINT' | 'ORG' | undefined
  let email: string | undefined = getValues('customer.email') as string | undefined

  if (!email) {
    if (accountType === 'INDIVIDUAL') {
      email = getValues('customer.accountHolder.accountHolderDetails.0.email') as string | undefined
    } else if (accountType === 'JOINT') {
      email = getValues('customer.jointHolders.firstHolderDetails.0.email') as string | undefined
    } else if (accountType === 'ORG') {
      email = getValues('customer.organization.associatedEntities.associatedIndividuals.0.email') as string | undefined
    }
  }

  // Generate a random 4-digit PIN (digits 1-9) once per dialog open
  const pinRef = useRef<string>('')
  if (pinRef.current === '') {
    pinRef.current = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9) + 1).join('')
  }
  const pin = pinRef.current

  const [enteredPin, setEnteredPin] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // Send email when dialog opens
  useEffect(() => {
    const sendEmail = async () => {
      if (!isOpen || emailSent) return

      if (!email) {
        toast({
          title: 'Missing Email',
          description: 'Please provide an email address for the primary account holder before continuing.',
          variant: 'destructive'
        })
        return
      }

      try {
        setIsSending(true)
        await sendEmailConfirmationEmail({ pin }, email, lang)
        setEmailSent(true)
        toast({
          title: 'Confirmation Email Sent',
          description: 'Please check the recipient inbox and enter the PIN below.',
          variant: 'success'
        })
      } catch (error) {
        toast({
          title: 'Failed to Send Email',
          description: 'We were unable to send the confirmation e-mail. Please try again later.',
          variant: 'destructive'
        })
      } finally {
        setIsSending(false)
      }
    }

    void sendEmail()
  }, [isOpen, emailSent, email, pin])

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setEnteredPin('')
      setEmailSent(false)
      pinRef.current = '' // regenerate on next open
    }
  }, [isOpen])

  const handleVerify = () => {
    if (enteredPin === pin) {
      toast({
        title: 'Email Verified',
        description: 'The email address has been successfully verified.',
        variant: 'success'
      })
      onConfirmed()
    } else {
      toast({
        title: 'Invalid PIN',
        description: 'The PIN you entered does not match. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Email Confirmation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm">We just sent a confirmation email to:</p>
            <p className="font-medium text-md text-foreground break-all">{email ?? '—'}</p>
          </div>

          <Input
            type="text"
            placeholder="Enter PIN"
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
            maxLength={6}
            disabled={isSending}
          />

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              disabled={enteredPin.length !== 4 || isSending}
              onClick={handleVerify}
              className="bg-primary text-background hover:bg-primary/90"
            >
              Verify
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EmailConfirmationDialog
