'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
} from '@/components/ui/form'
import { application_schema, individual_applicant_schema } from '@/lib/entities/schemas/application'
import { Application, InternalApplicationPayload } from '@/lib/entities/application';
import { useSearchParams } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import PersonalInfoStep from './PersonalInfoStep'
import { CreateApplication, ReadApplicationByID, UpdateApplicationByID } from '@/utils/entities/application'
import DocumentsStep from './DocumentsStep'
import AccountTypeStep from './AccountTypeStep'
import { Button } from '@/components/ui/button'
import LoaderButton from '@/components/misc/LoaderButton'
import { Check, Eye } from "lucide-react"
import ApplicationSuccess from './ApplicationSuccess'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import LoadingComponent from '@/components/misc/LoadingComponent'
import FinancialInfoStep from './FinancialInfoStep'
import RegulatoryInfoStep from './RegulatoryInfoStep'
import AccountInformationStep from './AccountInformationStep'
import { CreateContact, ReadContactByEmail } from '@/utils/entities/contact'
import { formatTimestamp } from '@/utils/dates'
import { getApplicationDefaults } from '@/utils/form'
import { FormDetails } from '@/lib/entities/account'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { GetForms } from '@/utils/entities/account'
import { Dialog, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog'

// Local storage keys used for saving progress
// No local storage needed anymore; we use query params to load existing applications.

enum FormStep {
  ACCOUNT_TYPE = 0,
  PERSONAL_INFO = 1,           // Basic account holder information
  FINANCIAL_INFO = 2,         // Net-worth, income, investment objectives, etc.
  REGULATORY_INFO = 3,        // Regulatory questions (affiliation, control, etc.)
  ACCOUNT_INFORMATION = 4,    // Account setup: base currency, account type, trading permissions
  AGREEMENTS = 5,
  DOCUMENTS = 6,
  SUCCESS = 7,
}

const IBKRApplicationForm = () => {

  const searchParams = useSearchParams();
  const { t } = useTranslationProvider();
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.ACCOUNT_TYPE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isLoadingApplication, setIsLoadingApplication] = useState(false);
  const [securityQA, setSecurityQA] = useState<Record<string, string>>({});
  const [estimatedDeposit, setEstimatedDeposit] = useState<number | null>(null);

  const [fetchedForms, setFetchedForms] = useState<FormDetails[] | null>(null);
  const [userSignature, setUserSignature] = useState<string | null>(null);
  const [isFormViewerOpen, setIsFormViewerOpen] = useState(false);
  const [selectedFormName, setSelectedFormName] = useState<string | null>(null);
  const [selectedFormData, setSelectedFormData] = useState<string | null>(null);

  const form = useForm<Application>({
    resolver: zodResolver(application_schema),
    defaultValues: getApplicationDefaults(application_schema),
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
  }, [searchParams]);

  if (isLoadingApplication) return <LoadingComponent className="py-10">Loading application…</LoadingComponent>

  const sanitizeDocuments = (values: Application) => {
    const sanitizedDocuments = (values.documents || []).map((doc: any) => {
      const { holderId, ...rest } = doc;
      return rest;
    });
    return { ...values, documents: sanitizedDocuments };
  };

  // New helper to strip employmentDetails for holders whose employmentType is neither EMPLOYED nor SELF_EMPLOYED
  const sanitizeEmploymentDetails = (application: Application): Application => {
    const clone = structuredClone(application);
    const strip = (holder: any) => {
      if (!holder) return;
      if (holder.employmentType && holder.employmentType !== 'EMPLOYED' && holder.employmentType !== 'SELF_EMPLOYED') {
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

  // Helper to strip mailingAddress when sameMailAddress is true
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

  // Helper to remove `identificationType` fields from all account holders before persisting
  const stripIdentificationType = (application: Application): Application => {
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

  // Helper to recursively remove accented characters from all string fields
  const stripAccents = <T,>(data: T): T => {
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

  const getContactCandidates = (values: Application): { name: string; email: string }[] => {
    const contacts: { name: string; email: string }[] = [];
    const { customer } = values;

    switch (customer.type) {
      case 'INDIVIDUAL': {
        const holder = customer.accountHolder?.accountHolderDetails?.[0];
        if (holder?.email) {
          contacts.push({
            name: `${holder.name.first} ${holder.name.last}`.trim(),
            email: holder.email,
          });
        }
        break;
      }
      case 'JOINT': {
        const first = customer.jointHolders?.firstHolderDetails?.[0];
        const second = customer.jointHolders?.secondHolderDetails?.[0];
        if (first?.email) {
          contacts.push({ name: `${first.name.first} ${first.name.last}`.trim(), email: first.email });
        }
        if (second?.email) {
          contacts.push({ name: `${second.name.first} ${second.name.last}`.trim(), email: second.email });
        }
        break;
      }
      case 'ORG': {
        const individuals = customer.organization?.associatedEntities?.associatedIndividuals || [];
        individuals.forEach((ind) => {
          if (ind?.email) {
            contacts.push({ name: `${ind.name.first} ${ind.name.last}`.trim(), email: ind.email });
          }
        });
        break;
      }
    }

    return contacts;
  };

  // Helper to get the list of valid signature names for the application,
  // based on the account holder / authorized individuals.
  const getValidSignatureNames = (application: Application): string[] => {
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

  // Create/update draft on every step
  const saveProgress = async () => {

    const advisor_id = searchParams.get('ad') || null;
    const master_account = searchParams.get('ma') || null;

    const currentValues = form.getValues();
    const sanitizedValues = stripAccents(
      sanitizeDocuments(
        sanitizeEmploymentDetails(
          sanitizeMailingAddress(stripIdentificationType(currentValues))
        )
      )
    );

    // Contact creation – only attempt after Personal Info step (or later)
    let contact_id = null;
    if (currentStep >= FormStep.PERSONAL_INFO) {
      const candidates = getContactCandidates(sanitizedValues);
      for (const c of candidates) {
        if (!c.email) continue;
        let existingContact = await ReadContactByEmail(c.email);
        if (!existingContact) {
          const createResp = await CreateContact({ name: c.name, email: c.email });
          // CreateContact returns IDResponse
          existingContact = { id: createResp.id } as any;
        }
        if (!contact_id && existingContact?.id) {
          contact_id = existingContact.id;
        }
      }
    }

    let status = 'Started';
    if (currentStep === FormStep.DOCUMENTS) {
      status = 'Completed';
    }

    if (!applicationId) {

      const internalApplication: InternalApplicationPayload = {
        application: sanitizedValues,
        advisor_code: advisor_id,
        master_account,
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
      console.log('Updating application', applicationId, { application: sanitizedValues, status: status });
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

    // Extra validation for Agreements step: signature must match an account holder name
    if (currentStep === FormStep.AGREEMENTS) {
      const normalizedSignature = (userSignature || '').trim().toLowerCase();

      if (!normalizedSignature) {
        toast({
          title: 'Signature Required',
          description: 'Please enter your full name as your digital signature before continuing.',
          variant: 'destructive',
        });
        return;
      }

      const applicationValues = form.getValues();
      const validNames = getValidSignatureNames(applicationValues).map((name) =>
        name.trim().toLowerCase()
      );

      if (!validNames.length || !validNames.includes(normalizedSignature)) {
        toast({
          title: 'Signature Mismatch',
          description:
            'Your signature must exactly match the account holder name (first and last name) as entered in the application.',
          variant: 'destructive',
        });
        return;
      }
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

  useEffect(() => {
    const fetchForms = async () => {
      const forms = await GetForms(['3230', '3024', '4070', '3044', '3089', '4304', '4404', '5013', '5001', '4024', '9130', '3074', '3203', '3070', '3094', '3071', '4587', '2192', '2191', '3077', '4399', '4684', '2109', '4016', '4289'], 'br');
      console.log(forms);
      setFetchedForms(forms.formDetails);
    }
    fetchForms();
  }, []);

  // Handler to view individual form
  const handleViewForm = async (formNumber: string, formName: string) => {
    try {
      const forms = await GetForms([formNumber], 'br');
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

  async function onSubmit(values: Application) {
    try {

      if (currentStep !== FormStep.DOCUMENTS) {
        await handleNextStep();
        return;
      }
      
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

  const renderProgress = () => {
    const steps = [
      { name: t('apply.account.header.steps.account_type'), step: FormStep.ACCOUNT_TYPE },
      { name: t('apply.account.header.steps.personal_info'), step: FormStep.PERSONAL_INFO },
      { name: t('apply.account.header.steps.financial_info'), step: FormStep.FINANCIAL_INFO },
      { name: t('apply.account.header.steps.regulatory_info'), step: FormStep.REGULATORY_INFO },
      { name: t('apply.account.header.steps.account_information'), step: FormStep.ACCOUNT_INFORMATION },
      { name: t('apply.account.header.steps.agreements'), step: FormStep.AGREEMENTS },
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
                <FinancialInfoStep form={form} setEstimatedDeposit={setEstimatedDeposit} estimatedDeposit={estimatedDeposit} />
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

            {currentStep === FormStep.AGREEMENTS && (
                <>
                {/** Derive valid signature names and validity flag for Agreements step */}
                {(() => {
                  const applicationValues = form.getValues();
                  const validNames = getValidSignatureNames(applicationValues).map((name) =>
                    name.trim().toLowerCase()
                  );
                  const normalizedSignature = (userSignature || '').trim().toLowerCase();
                  const isSignatureValid =
                    normalizedSignature.length > 0 &&
                    validNames.length > 0 &&
                    validNames.includes(normalizedSignature);

                  return (
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
                <p className="text-sm text-muted-foreground">
                  Please note this field counts as a digital signature and must match the account
                  holder&apos;s first and last name as entered in the application.
                </p>
                <Input
                  type="text"
                  placeholder="Enter your first and last name exactly as in the application"
                  value={userSignature || ""}
                  onChange={(e) => setUserSignature(e.target.value)}
                />
                {!isSignatureValid && (userSignature || '').length > 0 && (
                  <p className="text-sm text-error mt-1">
                    Signature must exactly match the account holder&apos;s first and last name.
                  </p>
                )}
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
                    disabled={!isSignatureValid}
                    className="bg-primary text-background hover:bg-primary/90"
                  >
                    Next
                  </Button>
                </div>
                    </>
                  );
                })()}
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
    </div>
  );

}

export default IBKRApplicationForm;