'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
} from '@/components/ui/form'
import { application_schema } from '@/lib/entities/schemas/application'
import { Application, InternalApplicationPayload } from '@/lib/entities/application';
import { toast } from '@/hooks/use-toast'
import PersonalInfoStep, { handleApplicationContact } from './PersonalInfoStep'
import { CreateApplication, UpdateApplicationByID } from '@/utils/entities/application'
import DocumentsStep from './DocumentsStep'
import AccountTypeStep from './AccountTypeStep'
import { Button } from '@/components/ui/button'
import LoaderButton from '@/components/misc/LoaderButton'
import ApplicationSuccess from './ApplicationSuccess'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import FinancialInfoStep from './FinancialInfoStep'
import RegulatoryInfoStep from './RegulatoryInfoStep'
import AgreementsStep from './AgreementsStep'
import { getApplicationDefaults } from '@/utils/form'
import ProgressMeter from './ProgressMeter'
import { FinancialRange } from '@/lib/entities/account'
import { GetFinancialRanges } from '@/utils/entities/account'

export enum FormStep {
  ACCOUNT_TYPE = 0,
  PERSONAL_INFO = 1,
  FINANCIAL_INFO = 2,
  REGULATORY_INFO = 3,
  AGREEMENTS = 4,
  DOCUMENTS = 5,
  SUCCESS = 6,
}

const IBKRApplicationForm = () => {

  const { t } = useTranslationProvider();

  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.ACCOUNT_TYPE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [securityQA, setSecurityQA] = useState<Record<string, string>>({});
  const [estimatedDeposit, setEstimatedDeposit] = useState<number | null>(null);
  const [userSignature, setUserSignature] = useState<string | null>(null);
  const [financialRanges, setFinancialRanges] = useState<FinancialRange[]>([]);
  const [financialRangesLoading, setFinancialRangesLoading] = useState(false);
  const [financialRangesError, setFinancialRangesError] = useState<string | null>(null);
  const [estimatedDepositError, setEstimatedDepositError] = useState<string | null>(null);

  const form = useForm<Application>({
    resolver: zodResolver(application_schema),
    defaultValues: getApplicationDefaults(application_schema),
    mode: 'onChange',
    shouldUnregister: false,
  });

  useEffect(() => {
    const fetchFinancialRanges = async () => {
      try {
        setFinancialRangesLoading(true);
        const response = await GetFinancialRanges();
        setFinancialRanges(response?.jsonData ?? []);
      } catch (error) {
        console.error('Error fetching financial ranges', error);
        setFinancialRangesError('Failed to load financial ranges');
      } finally {
        setFinancialRangesLoading(false);
      }
    };

    fetchFinancialRanges();
  }, []);

  const sanitizeDocuments = (values: Application) => {
    const sanitizedDocuments = (values.documents || []).map((doc: any) => {
      const { holderId, ...rest } = doc;
      return rest;
    });
    return { ...values, documents: sanitizedDocuments };
  };

  const sanitizeEmploymentDetails = (application: Application): Application => {
    const clone = structuredClone(application);
    const strip = (holder: any) => {
      if (!holder) return;
      if (holder.employmentType && holder.employmentType !== 'EMPLOYED' && holder.employmentType !== 'SELFEMPLOYED') {
        holder.employmentDetails = null;
      }
    };

    switch (clone.customer.type) {
      case 'INDIVIDUAL':
        strip(clone.customer.accountHolder?.accountHolderDetails?.[0]);
        break;
      case 'JOINT':
        strip(clone.customer.jointHolders?.firstHolderDetails?.[0]);
        strip(clone.customer.jointHolders?.secondHolderDetails?.[0]);
        break;
      case 'ORG':
        const individuals = clone.customer.organization?.associatedEntities?.associatedIndividuals || [];
        individuals.forEach(strip);
        break;
    }
    return clone;
  };

  const sanitizeMailingAddress = (application: Application): Application => {
    const clone = structuredClone(application);

    const processHolder = (holder: any) => {
      if (!holder) return;
      if (holder.sameMailAddress === true) {
        holder.mailingAddress = null;
      }
    };

    switch (clone.customer.type) {
      case 'INDIVIDUAL':
        processHolder(clone.customer.accountHolder?.accountHolderDetails?.[0]);
        break;
      case 'JOINT':
        processHolder(clone.customer.jointHolders?.firstHolderDetails?.[0]);
        processHolder(clone.customer.jointHolders?.secondHolderDetails?.[0]);
        break;
      case 'ORG':
        const individuals = clone.customer.organization?.associatedEntities?.associatedIndividuals || [];
        individuals.forEach(processHolder);
        break;
    }
    return clone;
  };

  const sanitizeIdentificationType = (application: Application): Application => {
    const clone = structuredClone(application);

    const clear = (holder: any) => {
      if (holder && Object.prototype.hasOwnProperty.call(holder, 'identificationType')) {
        delete holder.identificationType;
      }
    };

    switch (clone.customer.type) {
      case 'INDIVIDUAL':
        clear(clone.customer.accountHolder?.accountHolderDetails?.[0]);
        break;
      case 'JOINT':
        clear(clone.customer.jointHolders?.firstHolderDetails?.[0]);
        clear(clone.customer.jointHolders?.secondHolderDetails?.[0]);
        break;
      case 'ORG':
        (clone.customer.organization?.associatedEntities?.associatedIndividuals || []).forEach(clear);
        break;
    }

    return clone;
  };

  const sanitizeAccents = <T,>(data: T): T => {
    const transform = (value: any): any => {
      if (typeof value === 'string') {
        try {
          return value.normalize('NFD').replace(/\p{Diacritic}/gu, '');
        } catch {
          // Fallback for older engines without \p{Diacritic}
          return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
      }
      if (Array.isArray(value)) return value.map(transform);
      if (value && typeof value === 'object') {
        const out: Record<string, any> = {};
        Object.entries(value).forEach(([k, v]) => {
          out[k] = transform(v);
        });
        return out;
      }
      return value;
    };
    return transform(data);
  };
  
  function sanitizeApplication(application: Application): Application {
    return sanitizeAccents(sanitizeDocuments(sanitizeEmploymentDetails(sanitizeMailingAddress(sanitizeIdentificationType(application)))));
  }

  const handlePreviousStep = () => {
    const prev = currentStep - 1;
    setCurrentStep(prev as FormStep);
  };

  const handleNextStep = async () => {

    let isValid = true;

    if (currentStep === FormStep.ACCOUNT_TYPE) {
      isValid = await form.trigger('customer.type');
    }

    if (
      currentStep === FormStep.PERSONAL_INFO ||
      currentStep === FormStep.FINANCIAL_INFO ||
      currentStep === FormStep.REGULATORY_INFO ||
      currentStep === FormStep.AGREEMENTS
    ) {
      const accountType = form.getValues('customer.type');
      let fieldsToValidate: any[] = [];

      if (currentStep === FormStep.PERSONAL_INFO) {
        fieldsToValidate = [
          'customer.email',
          'customer.prefix',
          'customer.externalId',
          'customer.legalResidenceCountry',
          'accounts.0.margin',
          'accounts.0.externalId',
          'users'
        ];
        
        if (accountType === 'INDIVIDUAL') {
          fieldsToValidate.push('customer.accountHolder.accountHolderDetails');
        } else if (accountType === 'JOINT') {
          fieldsToValidate.push('customer.jointHolders.firstHolderDetails');
          fieldsToValidate.push('customer.jointHolders.secondHolderDetails');
          fieldsToValidate.push('customer.jointHolders.type');
        } else if (accountType === 'ORG') {
          fieldsToValidate.push('customer.organization.identifications');
          fieldsToValidate.push('customer.organization.accountSupport');
          fieldsToValidate.push('customer.organization.associatedEntities');
        }
      } else if (currentStep === FormStep.FINANCIAL_INFO) {
        fieldsToValidate = [
          'accounts.0.baseCurrency', 
          'accounts.0.tradingPermissions', 
          'accounts.0.investmentObjectives'
        ];
        
        if (accountType === 'INDIVIDUAL') {
          fieldsToValidate.push('customer.accountHolder.financialInformation');
        } else if (accountType === 'JOINT') {
          fieldsToValidate.push('customer.jointHolders.financialInformation');
        } else if (accountType === 'ORG') {
          fieldsToValidate.push('customer.organization.financialInformation');
        }
      } else if (currentStep === FormStep.REGULATORY_INFO) {
        if (accountType === 'INDIVIDUAL') {
          fieldsToValidate.push('customer.accountHolder.regulatoryInformation');
        } else if (accountType === 'JOINT') {
          fieldsToValidate.push('customer.jointHolders.regulatoryInformation');
        } else if (accountType === 'ORG') {
          fieldsToValidate.push('customer.organization.regulatoryInformation');
        }
      }

      if (fieldsToValidate.length > 0) {
        isValid = await form.trigger(fieldsToValidate);
      } else if (currentStep === FormStep.AGREEMENTS) {
        isValid = true;
      }
      
      if (currentStep === FormStep.FINANCIAL_INFO) {
        if (estimatedDeposit === null || estimatedDeposit === undefined) {
          setEstimatedDepositError('Required');
          isValid = false;
        } else {
          setEstimatedDepositError(null);
        }
      }
    }

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

  async function saveProgress() {
    
    const currentValues = form.getValues();
    let contact_id: string | null = null;

    const sanitizedValues = sanitizeApplication(currentValues);

    if (currentStep >= FormStep.PERSONAL_INFO) {
      contact_id = await handleApplicationContact(sanitizedValues);
    }

    let status = 'Started';
    if (currentStep === FormStep.DOCUMENTS) {
      status = 'Completed';
    }

    if (!contact_id) return;

    if (!applicationId) {
      const internalApplication: InternalApplicationPayload = {
        application: sanitizedValues,
        advisor_code: null,
        master_account: null,
        date_sent_to_ibkr: null,
        status,
        contact_id: contact_id,
        security_questions: securityQA,
        estimated_deposit: estimatedDeposit ?? null,
        risk_profile_id: null,
      };
      const createResp = await CreateApplication(internalApplication);
      setApplicationId(createResp.id);
    } else {
      const updatePayload:any = { application: sanitizedValues, status: status };
      if (Object.keys(securityQA).length) {
        updatePayload.security_questions = securityQA;
      }
      if (estimatedDeposit !== null) {
        updatePayload.estimated_deposit = estimatedDeposit;
      }
      if (contact_id) {
        updatePayload.contact_id = contact_id;
      }
      await UpdateApplicationByID(applicationId, updatePayload);
    }
  }

  async function onSubmit(_values: Application) {

    if (currentStep !== FormStep.DOCUMENTS) return;

    try {
      setIsSubmitting(true);
      await saveProgress();

      toast({
        title: "Application Submitted",
        description: "Your IBKR application has been successfully submitted.",
        variant: "success"
      });

      setCurrentStep(FormStep.SUCCESS);
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

  if (currentStep === FormStep.SUCCESS) return <ApplicationSuccess />;

  return (
    <div className="flex flex-col justify-center items-center my-20 gap-5 p-5">
      <div className="text-center">
        <h1 className="text-3xl font-bold ">{t('apply.account.header.title')}</h1>
        <p className="text-lg">{t('apply.account.header.description')}</p>
      </div>
      <ProgressMeter form={form} currentStep={currentStep} />
      <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%] max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {currentStep === FormStep.ACCOUNT_TYPE && (
              <>
                <AccountTypeStep form={form} />
                <div className="flex justify-between">
                  <div></div>
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
                <PersonalInfoStep form={form} onSecurityQuestionsChange={setSecurityQA} />
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePreviousStep}>Previous</Button>
                  <Button type="button" onClick={handleNextStep} className="bg-primary text-background hover:bg-primary/90">Next</Button>
                </div>
              </>
            )}

            {currentStep === FormStep.FINANCIAL_INFO && (
              <div className="space-y-8">
                <FinancialInfoStep
                  form={form}
                  setEstimatedDeposit={(val) => {
                    setEstimatedDeposit(val);
                    if (val !== null) setEstimatedDepositError(null);
                  }}
                  estimatedDeposit={estimatedDeposit}
                  financialRanges={financialRanges}
                  financialRangesLoading={financialRangesLoading}
                  financialRangesError={financialRangesError}
                  estimatedDepositError={estimatedDepositError}
                />
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

            {currentStep === FormStep.AGREEMENTS && (
              <AgreementsStep
                form={form}
                userSignature={userSignature}
                onSignatureChange={setUserSignature}
                onPrevious={handlePreviousStep}
                onNext={handleNextStep}
              />
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