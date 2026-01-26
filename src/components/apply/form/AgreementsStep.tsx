'use client'

import React, { useEffect, useState } from 'react'
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

interface AgreementsStepProps {
  form: UseFormReturn<Application>
  userSignature: string | null
  onSignatureChange: (value: string) => void
  onPrevious: () => void
  onNext: () => void
}

const AgreementsStep = ({
  form,
  userSignature,
  onSignatureChange,
  onPrevious,
  onNext,
}: AgreementsStepProps) => {
  const [fetchedForms, setFetchedForms] = useState<FormDetails[] | null>(null)
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

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const forms = await GetForms(
          [
            '3230', '3024', '4070', '3044', '3089', '4304', '4404', '5013', '5001', '4024', '9130', '3074', '3203',
            '3070', '3094', '3071', '4587', '2192', '2191', '3077', '4399', '4684', '2109', '4016', '4289',
          ],
          'br'
        )
        setFetchedForms(forms.formDetails)
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch forms.', variant: 'destructive' })
      }
    }
    fetchForms()
  }, [])

  const handleViewForm = async (formNumber: string, formName: string) => {
    try {
      const forms = await GetForms([formNumber], 'br')
      if (forms && forms.fileData && forms.fileData.data) {
        setSelectedFormName(formName)
        setSelectedFormData(forms.fileData.data)
        setIsFormViewerOpen(true)
      } else {
        toast({ title: 'Error', description: 'Failed to fetch form content.', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch form.', variant: 'destructive' })
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
        <h2 className="text-xl font-semibold mb-2">Agreements and Disclosures</h2>
        {fetchedForms ? (
          fetchedForms.map((form) => (
            <Card key={form.formNumber} className="flex justify-between p-4 items-center">
              <div className="flex flex-col">
                <p className="text-md font-semibold">{form.formName}</p>
                <p className="text-sm text-muted-foreground">Form #{form.formNumber}</p>
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
        Please note this field counts as a digital signature and must match the account holder&apos;s first and last
        name as entered in the application.
      </p>
      <Input
        type="text"
        placeholder="Enter your first and last name exactly as in the application"
        value={userSignature || ''}
        onChange={(e) => onSignatureChange(e.target.value)}
      />
      {!isSignatureValid && (userSignature || '').length > 0 && (
        <p className="text-sm text-error mt-1">Signature must exactly match the account holder&apos;s first and last name.</p>
      )}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!isSignatureValid}
          className="bg-primary text-background hover:bg-primary/90"
        >
          Next
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
            <p className="text-center">Loading...</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AgreementsStep
