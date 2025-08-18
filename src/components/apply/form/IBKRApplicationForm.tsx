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
import { CreateApplication, ReadApplicationByID, UpdateApplicationByID } from '@/utils/entities/application'
import DocumentsStep from './DocumentsStep'
import AccountTypeStep from './AccountTypeStep'
import { Button } from '@/components/ui/button'
import LoaderButton from '@/components/misc/LoaderButton'
import { Check } from "lucide-react"
import ApplicationSuccess from './ApplicationSuccess'
import { getApplicationDefaults } from '@/utils/form'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { individual_form } from './samples'
import { useSession } from 'next-auth/react'

// Local storage keys used for saving progress
const LOCAL_STORAGE_APP_ID = 'agm_application_draft_id';
const LOCAL_STORAGE_APP_STEP = 'agm_application_current_step';

enum FormStep {
  ACCOUNT_TYPE = 0,
  ACCOUNT_HOLDER_INFO = 1,
  DOCUMENTS = 2,
  SUCCESS = 3
}

const IBKRApplicationForm = () => {

  const searchParams = useSearchParams();
  const { t } = useTranslationProvider();
  const { data: session } = useSession();
  
  // State for step navigation and data
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.ACCOUNT_TYPE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const form = useForm<Application>({
    resolver: zodResolver(application_schema),
    defaultValues: individual_form,
    mode: 'onChange',
    shouldUnregister: false,
  });

  // Load existing draft (if any) from localStorage and hydrate the form
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const draftId = window.localStorage.getItem(LOCAL_STORAGE_APP_ID);
    if (!draftId) return;
    (async () => {
      try {
        const existing = await ReadApplicationByID(draftId);
        if (existing?.application) {
          form.reset(existing.application);
          setApplicationId(existing.id);
        }
      } catch (err) {
        // If fetch fails, clear invalid draft id
        window.localStorage.removeItem(LOCAL_STORAGE_APP_ID);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load existing step (if any) from localStorage so the user resumes where they left off
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const draftId = window.localStorage.getItem(LOCAL_STORAGE_APP_ID);
    const storedStep = window.localStorage.getItem(LOCAL_STORAGE_APP_STEP);
    if (draftId && storedStep !== null) {
      const stepNum = parseInt(storedStep, 10);
      if (!isNaN(stepNum) && stepNum >= FormStep.ACCOUNT_TYPE && stepNum <= FormStep.SUCCESS) {
        setCurrentStep(stepNum as FormStep);
      }
    }
  }, []);

  const sanitizeDocuments = (values: Application) => {
    const sanitizedDocuments = (values.documents || []).map((doc: any) => {
      const { holderId, ...rest } = doc;
      return rest;
    });
    return { ...values, documents: sanitizedDocuments };
  };

  // Create/update draft on every step
  const saveProgress = async () => {
    if (!session?.user) throw new Error('User not found');

    const advisor_id = searchParams.get('ad') || null;
    const master_account_id = searchParams.get('ma') || null;
    const lead_id = searchParams.get('ld') || null;

    const currentValues = form.getValues();
    const sanitizedValues = sanitizeDocuments(currentValues);

    let status = 'Started';
    if (currentStep === FormStep.DOCUMENTS) {
      status = 'Completed';
    }

    if (!applicationId) {
      const internalApplication: InternalApplicationPayload = {
        application: sanitizedValues,
        advisor_code: advisor_id,
        master_account_id,
        lead_id,
        date_sent_to_ibkr: null,
        user_id: session?.user.id,
        status,
      };
      const createResp = await CreateApplication(internalApplication);
      setApplicationId(createResp.id);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCAL_STORAGE_APP_ID, createResp.id);
        window.localStorage.setItem(LOCAL_STORAGE_APP_STEP, currentStep.toString());
      }
    } else {
      await UpdateApplicationByID(applicationId, { application: sanitizedValues, status: status });
    }
  };
  
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

    try {
      await saveProgress();
      const next = currentStep + 1;
      setCurrentStep(next as FormStep);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCAL_STORAGE_APP_STEP, next.toString());
      }
      toast({
        title: 'Saved',
        description: 'Progress saved.',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save progress.',
        variant: 'destructive'
      });
    }
  };

  const handlePreviousStep = () => {
    const prev = currentStep - 1;
    setCurrentStep(prev as FormStep);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_STORAGE_APP_STEP, prev.toString());
    }
  };

  async function onSubmit(values: Application) {
    try {

      if (!session?.user) throw new Error('User not found')

      if (currentStep !== FormStep.DOCUMENTS) {
        await handleNextStep();
        return;
      }
      
      setIsSubmitting(true);

      // Final save (create if needed, otherwise update)
      await saveProgress();

      toast({
        title: "Application Submitted",
        description: "Your IBKR application has been successfully submitted.",
        variant: "success"
      });

      setCurrentStep(FormStep.SUCCESS);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(LOCAL_STORAGE_APP_STEP);
        window.localStorage.removeItem(LOCAL_STORAGE_APP_ID);
      }
      setApplicationId(null);
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
      { name: t('apply.account.header.steps.documents'), step: FormStep.DOCUMENTS },
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

  if (currentStep === FormStep.SUCCESS) return <ApplicationSuccess />;

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
        </Form>
      </div>
    </div>
  );

}

export default IBKRApplicationForm;