'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
} from '@/components/ui/form'
import { application_schema } from '@/lib/entities/schemas/application'
import { Application, InternalApplicationPayload } from '@/lib/entities/application';
import { useSearchParams } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import AccountHolderInfoStep from './AccountHolderInfoStep'
import { CreateApplication } from '@/utils/entities/application'
import DocumentsStep from './DocumentsStep'
import AccountTypeStep from './AccountTypeStep'
import { Button } from '@/components/ui/button'
import LoaderButton from '@/components/misc/LoaderButton'
import { Check } from "lucide-react"
import { individual_form, joint_form, organizational_form } from './SampleInfo'
import ApplicationSuccess from './ApplicationSuccess'
import { getApplicationDefaults } from '@/utils/form'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Fees from '@/components/public/Fees'
import { FormDetails } from '@/lib/entities/account'
import { GetForms } from '@/utils/entities/account'
import EmailConfirmationDialog from '@/components/apply/form/EmailConfirmationDialog'

enum FormStep {
  ACCOUNT_TYPE = 0,
  ACCOUNT_HOLDER_INFO = 1,
  //AGREEMENTS = 2,
  DOCUMENTS = 2,
  FEES = 3,
  SUCCESS = 4
}

const IBKRApplicationForm = () => {

  const searchParams = useSearchParams();
  const { t } = useTranslationProvider();

  // State for step navigation and data
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.ACCOUNT_TYPE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for viewing a single form PDF
  const [fetchedForms, setFetchedForms] = useState<FormDetails[] | null>(null);
  const [isFormViewerOpen, setIsFormViewerOpen] = useState(false);
  const [selectedFormName, setSelectedFormName] = useState<string | null>(null);
  const [selectedFormData, setSelectedFormData] = useState<string | null>(null);
  const [userSignature, setUserSignature] = useState<string | null>(null);

  // Email confirmation
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  const handleEmailConfirmed = () => {
    setEmailConfirmed(true);
    setIsEmailDialogOpen(false);
    setCurrentStep(FormStep.DOCUMENTS);
  };

  // Handler to view individual form
  const handleViewForm = async (formNumber: string, formName: string) => {
    try {
      const forms = await GetForms([formNumber]);
      if (forms && forms.fileData && forms.fileData.data) {
        setSelectedFormName(formName);
        setSelectedFormData(forms.fileData.data);
        setIsFormViewerOpen(true);
      } else {
        toast({ title: 'Error', description: 'Failed to fetch form content.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch form.', variant: 'destructive' });
    }
  };

  const form = useForm<Application>({
    resolver: zodResolver(application_schema),
    defaultValues: getApplicationDefaults(application_schema),
    mode: 'onChange',
    shouldUnregister: false,
  });
  
  useEffect(() => {
    const fetchForms = async () => {
      const forms = await GetForms(['3230', '3024', '4070', '3044', '3089', '4304', '4404', '5013', '5001', '4024', '9130', '3074', '3203', '3070', '3094', '3071', '4587', '2192', '2191', '3077', '4399', '4684', '2109', '4016', '4289']);
      console.log(forms);
      setFetchedForms(forms.formDetails);
    }
    fetchForms();
  }, []);
  
  // Helper to validate the required fields for the current step before moving on
  const validateCurrentStep = async () => {
    if (currentStep === FormStep.ACCOUNT_TYPE) {
      return await form.trigger('customer.type');
    }

    if (currentStep === FormStep.ACCOUNT_HOLDER_INFO) {
      return await form.trigger();
    }
    return true;
  };

  const handleNextStep = async () => {
    const isValid = await validateCurrentStep();

    if (!isValid) {
      toast({
        title: 'Form Errors',
        description: 'Please correct the highlighted errors before continuing.',
        variant: 'destructive'
      });
      return;
    }

    // TODO: After account holder info, trigger email confirmation dialog if not verified
    //if (currentStep === FormStep.ACCOUNT_HOLDER_INFO && !emailConfirmed) {
    //  setIsEmailDialogOpen(true);
    //  return;
    //}

    setCurrentStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  async function onSubmit(values: Application) {
    try {
      if (currentStep !== FormStep.DOCUMENTS) {
        setCurrentStep(currentStep + 1);
        return;
      }
      
      setIsSubmitting(true);

      const advisor_id = searchParams.get('ad') || null;
      const master_account_id = searchParams.get('ma') || null;
      const lead_id = searchParams.get('ld') || null;
      
      const sanitizedDocuments = (values.documents || []).map((doc: any) => {
        const { holderId, ...rest } = doc;
        return rest;
      });
      const sanitizedValues = { ...values, documents: sanitizedDocuments };

      const internalApplication: InternalApplicationPayload = {
        application: sanitizedValues,
        advisor_code: advisor_id,
        master_account_id,
        lead_id,
        date_sent_to_ibkr: null,
        user_id: null,
      }

      console.log('Application ready to submit:', internalApplication.application);
      await CreateApplication(internalApplication);

      toast({
        title: "Application Submitted",
        description: "Your IBKR application has been successfully submitted.",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const renderProgress = () => {
    const steps = [
      { name: t('apply.account.header.steps.account_type'), step: FormStep.ACCOUNT_TYPE },
      { name: t('apply.account.header.steps.account_holder_info'), step: FormStep.ACCOUNT_HOLDER_INFO },
      // TODO: { name: t('apply.account.header.steps.agreements'), step: FormStep.AGREEMENTS },
      { name: t('apply.account.header.steps.documents'), step: FormStep.DOCUMENTS },
      { name: t('fees.title'), step: FormStep.FEES },
      { name: t('apply.account.header.steps.complete'), step: FormStep.SUCCESS }
    ];

    console.log(form.formState.errors);
    console.log(form.getValues());

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.step}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step.step ? 'bg-primary text-background' : 'bg-muted text-foreground'}`}>
                  {currentStep >= step.step ? (
                    step.step === FormStep.SUCCESS ? <Check className="w-4 h-4" /> : index + 1
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="mt-2 text-sm">{step.name}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 bg-muted">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: currentStep > step.step ? '100%' : '0%', transition: 'width 0.3s ease-in-out' }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  if (currentStep === FormStep.SUCCESS) {
    return <ApplicationSuccess />;
  }

  return (
    <div className="flex flex-col justify-center items-center my-20 gap-5 p-5">
      <div className="text-center">
        <h1 className="text-3xl font-bold ">{t('apply.account.header.title')}</h1>
        <p className="text-lg">{t('apply.account.header.description')}</p>
      </div>
      {renderProgress()}
      <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%] max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {currentStep === FormStep.FEES && (
              <>
                <Fees />
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={handleNextStep}
                    className="bg-primary text-background hover:bg-primary/90"
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
            {currentStep === FormStep.ACCOUNT_TYPE && (
              <>
                <AccountTypeStep form={form} />
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleNextStep}
                    className="bg-primary text-background hover:bg-primary/90"
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
            {currentStep === FormStep.ACCOUNT_HOLDER_INFO && (
              <>
                <AccountHolderInfoStep form={form} />
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleNextStep}
                    className="bg-primary text-background hover:bg-primary/90"
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {/*
            TODO: Add agreements and disclosures step
            currentStep === FormStep.AGREEMENTS && (
                <>
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-semibold mb-2">Agreements and Disclosures</h2>
                    {fetchedForms ? fetchedForms.map((form) => (
                      <Card key={form.formNumber} className="flex justify-between p-4 items-center">
                        <div className="flex flex-col">
                          <p className="text-md font-semibold">{form.formName}</p>
                          <p className="text-sm text-muted-foreground">Form #{form.formNumber}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleViewForm(form.formNumber, form.formName)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Card>
                    )) : (
                      <LoadingComponent />
                    )}
                </div>
                <Input
                  type="text"
                  placeholder="Please enter your signature to continue"
                  value={userSignature || ""}
                  onChange={(e) => setUserSignature(e.target.value)}
                />
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleNextStep}
                    disabled={userSignature === null || userSignature === ""}
                    className="bg-primary text-background hover:bg-primary/90"
                  >
                    Next
                  </Button>
                </div>
              </>
            )
            */
            }
            {currentStep === FormStep.DOCUMENTS && (
              <>
                <DocumentsStep form={form} />
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </Button>
                  <LoaderButton onClick={form.handleSubmit(onSubmit)} isLoading={isSubmitting} text="Submit Application"/>
                </div>
              </>
            )}
          </form>
          {
            // TODO: Add email confirmation dialog
            /*
            <EmailConfirmationDialog
              isOpen={isEmailDialogOpen}
              setIsOpen={setIsEmailDialogOpen}
              onConfirmed={handleEmailConfirmed}
            />
            */
          }
        </Form>
      </div>
      {/* Form Viewer Dialog */}
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
    </div>
  );

}

export default IBKRApplicationForm;