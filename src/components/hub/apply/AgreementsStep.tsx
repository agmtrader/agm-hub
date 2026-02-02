'use client'

import React, { useState } from 'react'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { FormDetails } from '@/lib/entities/account'
import { Application } from '@/lib/entities/application'
import { UseFormReturn } from 'react-hook-form'
import { GetForms } from '@/utils/entities/account'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

interface AgreementsStepProps {
  form: UseFormReturn<Application>
  forms: FormDetails[] | null
  userSignature: string | null
  onSignatureChange: (value: string) => void
  onPrevious: () => void
  onNext: () => void
  isSubmitting?: boolean
}

const AgreementsStep = ({
  form,
  forms,
  userSignature,
  onSignatureChange,
  onPrevious,
  onNext,
  isSubmitting = false,
}: AgreementsStepProps) => {
  const { t } = useTranslationProvider()
  const [isFormViewerOpen, setIsFormViewerOpen] = useState(false)
  const [selectedFormName, setSelectedFormName] = useState<string | null>(null)
  const [selectedFormData, setSelectedFormData] = useState<string | null>(null)

  function getValidSignatureNames(application: Application): string[] {
    const names: string[] = [];
    const { customer } = application;

    const addHolderName = (holder: any) => {
      const first = holder?.name?.first;
      const last = holder?.name?.last;
      if (first && last) {
        names.push(`${first} ${last}`.trim());
      }
    };

    switch (customer.type) {
      case 'INDIVIDUAL': {
        const holder = customer.accountHolder?.accountHolderDetails?.[0];
        addHolderName(holder);
        break;
      }
      case 'JOINT': {
        const firstHolder = customer.jointHolders?.firstHolderDetails?.[0];
        const secondHolder = customer.jointHolders?.secondHolderDetails?.[0];
        addHolderName(firstHolder);
        addHolderName(secondHolder);
        break;
      }
      case 'ORG': {
        const individuals = customer.organization?.associatedEntities?.associatedIndividuals || [];
        individuals.forEach(addHolderName);
        break;
      }
    }

    return names;
  };

  const handleViewForm = async (formNumber: string, formName: string) => {
    try {
      const forms = await GetForms([formNumber], 'br')
      if (forms && forms.fileData && forms.fileData.data) {
        setSelectedFormName(formName)
        setSelectedFormData(forms.fileData.data)
        setIsFormViewerOpen(true)
      } else {
        toast({ title: t('apply.account.documents.messages.error'), description: t('apply.account.agreements.messages.fetch_content_error'), variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: t('apply.account.documents.messages.error'), description: t('apply.account.agreements.messages.fetch_form_error'), variant: 'destructive' })
    }
  }

  const validNames = getValidSignatureNames(form.getValues())
  const normalizedSignature = (userSignature || '').trim().toLowerCase()
  const normalizedValidNames = validNames.map((name) => name.trim().toLowerCase())
  const isSignatureValid =
    normalizedSignature.length > 0 &&
    normalizedValidNames.length > 0 &&
    normalizedValidNames.includes(normalizedSignature)

  return (
    <>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold mb-2">{t('apply.account.agreements.title')}</h2>
        {forms ? (
          forms.map((form) => (
            <Card key={form.formNumber} className="flex justify-between p-4 items-center">
              <div className="flex flex-col">
                <p className="text-md font-semibold">{form.formName}</p>
                <p className="text-sm text-muted-foreground">{t('apply.account.agreements.form_number')}{form.formNumber}</p>
              </div>
              <Button type="button" variant="ghost" onClick={() => handleViewForm(form.formNumber, form.formName)}>
                <Eye className="w-4 h-4" />
              </Button>
            </Card>
          ))
        ) : (
          <LoadingComponent />
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        {t('apply.account.agreements.digital_signature_note')}
      </p>
      <Input
        type="text"
        placeholder={t('apply.account.agreements.enter_signature')}
        value={userSignature || ''}
        onChange={(e) => onSignatureChange(e.target.value)}
      />
      {!isSignatureValid && (userSignature || '').length > 0 && (
        <p className="text-sm text-error mt-1">{t('apply.account.agreements.signature_error')}</p>
      )}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          {t('apply.account.agreements.previous')}
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!isSignatureValid || isSubmitting}
          className="bg-primary text-background hover:bg-primary/90"
        >
          {isSubmitting ? t('apply.account.agreements.submitting') : t('apply.account.agreements.submit_application')}
        </Button>
      </div>
      <Dialog open={isFormViewerOpen} onOpenChange={setIsFormViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{selectedFormName}</DialogTitle>
          </DialogHeader>
          {selectedFormData ? (
            <iframe
              src={`data:application/pdf;base64,${selectedFormData}`}
              className="w-full h-[70vh] border-0"
              title={selectedFormName || 'Form'}
            />
          ) : (
            <p className="text-center">{t('apply.account.agreements.loading')}</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AgreementsStep
