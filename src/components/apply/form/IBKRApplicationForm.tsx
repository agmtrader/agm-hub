'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
} from '@/components/ui/form'
import { application_schema } from '@/lib/entities/schemas/application'
import { Application, InternalApplication } from '@/lib/entities/application';
import { useSearchParams } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import AccountHolderInfoStep from './AccountHolderInfoStep'
import { CreateApplication } from '@/utils/entities/application'
import DocumentsStep from './DocumentsStep'
import AccountTypeStep from './AccountTypeStep'
import { Button } from '@/components/ui/button'
import LoaderButton from '@/components/misc/LoaderButton'
import { formatTimestamp } from '@/utils/dates'
import { Check } from "lucide-react"
import { useSession } from 'next-auth/react'
import { filledForm } from './SampleInfo'
import ApplicationSuccess from './ApplicationSuccess'
import { getApplicationDefaults } from '@/utils/form'

enum FormStep {
  ACCOUNT_TYPE = 0,
  ACCOUNT_HOLDER_INFO = 1,
  DOCUMENTS = 2,
  SUCCESS = 3
}

const IBKRApplicationForm = () => {

  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.ACCOUNT_TYPE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const form = useForm<Application>({
    resolver: zodResolver(application_schema),
    defaultValues: getApplicationDefaults(application_schema),
    mode: 'onChange',
    shouldUnregister: false,
  });

  const handleNextStep = async () => { 
    setCurrentStep(prevStep => prevStep + 1);
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

      if (!session?.user?.id) {
        throw new Error('User not found');
      }
      
      const advisor_id = searchParams.get('ad') || null;
      const master_account_id = searchParams.get('ma') || null;
      const lead_id = searchParams.get('ld') || null;

      // Sanitize documents: remove holderId from each document
      const sanitizedDocuments = (values.documents || []).map((doc: any) => {
        const { holderId, ...rest } = doc;
        return rest;
      });
      const sanitizedValues = { ...values, documents: sanitizedDocuments };

      const internalApplication: InternalApplication = {
        application: sanitizedValues,
        advisor_id,
        master_account_id,
        lead_id,
        id: "",
        created: formatTimestamp(new Date()),
        updated: formatTimestamp(new Date()),
        date_sent_to_ibkr: null,
        user_id: session?.user?.id,
      }

      console.log('Application ready to submit:', internalApplication.application);

      const createResponse = await CreateApplication(internalApplication);
      if (!createResponse) {
        throw new Error('Failed to create application');
      }
      
      toast({
        title: "Application Submitted",
        description: "Your IBKR application has been successfully submitted.",
        variant: "success"
      });

      // Move to success step
      setCurrentStep(FormStep.SUCCESS);
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
      { name: 'Account Type', step: FormStep.ACCOUNT_TYPE },
      { name: 'Account Holder Information', step: FormStep.ACCOUNT_HOLDER_INFO },
      { name: 'Documents', step: FormStep.DOCUMENTS },
      { name: 'Complete', step: FormStep.SUCCESS }
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
        <h1 className="text-3xl font-bold ">IBKR Account Application Form</h1>
        <p className="text-lg">Please fill out the form below to apply for an IBKR account.</p>
      </div>
      {renderProgress()}
      <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%] max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {currentStep === FormStep.ACCOUNT_TYPE && (
              <>
                <AccountTypeStep form={form} />
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