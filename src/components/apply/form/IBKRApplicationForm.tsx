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
import PersonalInfoStep from './PersonalInfoStep'
import { CreateApplication, ReadApplicationByID, UpdateApplicationByID } from '@/utils/entities/application'
import DocumentsStep from './DocumentsStep'
import AccountTypeStep from './AccountTypeStep'
import { Button } from '@/components/ui/button'
import LoaderButton from '@/components/misc/LoaderButton'
import { Check } from "lucide-react"
import ApplicationSuccess from './ApplicationSuccess'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { individual_form } from './samples'
import { useSession } from 'next-auth/react'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { getApplicationDefaults } from '@/utils/form'
import FinancialInfoStep from './FinancialInfoStep'
import RegulatoryInfoStep from './RegulatoryInfoStep'
import AccountInformationStep from './AccountInformationStep'

// Local storage keys used for saving progress
// No local storage needed anymore; we use query params to load existing applications.

enum FormStep {
  ACCOUNT_TYPE = 0,
  PERSONAL_INFO = 1,           // Basic account holder information
  FINANCIAL_INFO = 2,         // Net-worth, income, investment objectives, etc.
  REGULATORY_INFO = 3,        // Regulatory questions (affiliation, control, etc.)
  ACCOUNT_INFORMATION = 4,    // Account setup: base currency, account type, trading permissions
  DOCUMENTS = 5,
  SUCCESS = 6,
}

const IBKRApplicationForm = () => {

  const searchParams = useSearchParams();
  const { t } = useTranslationProvider();
  const { data: session } = useSession();
  
  // State for step navigation and data
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.ACCOUNT_TYPE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isLoadingApplication, setIsLoadingApplication] = useState(false);

  const form = useForm<Application>({
    resolver: zodResolver(application_schema),
    defaultValues: individual_form,
    mode: 'onChange',
    shouldUnregister: false,
  });

  // Load existing application based on query param (app=<id>)
  useEffect(() => {
    const appId = searchParams.get('app');
    if (!appId) return;
    setIsLoadingApplication(true);
    (async () => {
      try {
        const existing = await ReadApplicationByID(appId);
        if (existing?.application) {
          form.reset(existing.application);
          setApplicationId(existing.id);
        }
      } catch (err) {
        console.error('Failed to fetch application', err);
      } finally {
        setIsLoadingApplication(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (isLoadingApplication) {
    return <LoadingComponent className="py-10">Loading application…</LoadingComponent>;
  }

  // No need to restore step from storage; default at ACCOUNT_TYPE.

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
    } else {
      await UpdateApplicationByID(applicationId, { application: sanitizedValues, status: status });
    }
  };
  
  // Helper to validate the required fields for the current step before moving on
  const validateCurrentStep = async () => {
    if (currentStep === FormStep.ACCOUNT_TYPE) {
      return await form.trigger('customer.type');
    }

    // For now, run full validation on all intermediate steps until individual schemas are extracted.
    if (
      currentStep === FormStep.PERSONAL_INFO ||
      currentStep === FormStep.FINANCIAL_INFO ||
      currentStep === FormStep.REGULATORY_INFO ||
      currentStep === FormStep.ACCOUNT_INFORMATION
    ) {
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
      // No local storage cleanup required
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
      { name: t('apply.account.header.steps.personal_info'), step: FormStep.PERSONAL_INFO },
      { name: t('apply.account.header.steps.financial_info'), step: FormStep.FINANCIAL_INFO },
      { name: t('apply.account.header.steps.regulatory_info'), step: FormStep.REGULATORY_INFO },
      { name: t('apply.account.header.steps.account_information'), step: FormStep.ACCOUNT_INFORMATION },
      { name: t('apply.account.header.steps.documents'), step: FormStep.DOCUMENTS },
      { name: t('apply.account.header.steps.complete'), step: FormStep.SUCCESS },
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
            {currentStep === FormStep.PERSONAL_INFO && (
              <>
                <PersonalInfoStep form={form} />
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePreviousStep}>Previous</Button>
                  <Button type="button" onClick={handleNextStep} className="bg-primary text-background hover:bg-primary/90">Next</Button>
                </div>
              </>
            )}

            {currentStep === FormStep.FINANCIAL_INFO && (
              <div className="space-y-8">
                <FinancialInfoStep form={form} />
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePreviousStep}>Previous</Button>
                  <Button type="button" onClick={handleNextStep} className="bg-primary text-background hover:bg-primary/90">Next</Button>
                </div>
              </div>
            )}

            {currentStep === FormStep.REGULATORY_INFO && (
              <div className="space-y-8">
                <RegulatoryInfoStep form={form} />
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePreviousStep}>Previous</Button>
                  <Button type="button" onClick={handleNextStep} className="bg-primary text-background hover:bg-primary/90">Next</Button>
                </div>
              </div>
            )}

            {currentStep === FormStep.ACCOUNT_INFORMATION && (
              <div className="space-y-8">
                <AccountInformationStep form={form} />
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePreviousStep}>Previous</Button>
                  <Button type="button" onClick={handleNextStep} className="bg-primary text-background hover:bg-primary/90">Next</Button>
                </div>
              </div>
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