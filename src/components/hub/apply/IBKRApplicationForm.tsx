'use client'

import React, { useEffect, useState } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { Form } from '@/components/ui/form'
import { application_schema } from '@/lib/entities/schemas/application'
import { Application, InternalApplicationPayload } from '@/lib/entities/application';
import { toast } from '@/hooks/use-toast'
import PersonalInfoStep from './PersonalInfoStep'
import { CreateApplication, UpdateApplicationByID } from '@/utils/entities/application'
import DocumentsStep from './DocumentsStep'
import AccountTypeStep from './AccountTypeStep'
import { Button } from '@/components/ui/button'
import ApplicationSuccess from './ApplicationSuccess'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import FinancialInfoStep from './FinancialInfoStep'
import RegulatoryInfoStep from './RegulatoryInfoStep'
import AgreementsStep from './AgreementsStep'
import { getApplicationDefaults } from '@/utils/entities/application'
import ProgressMeter from './ProgressMeter'
import { BusinessAndOccupation, FinancialRange, FormDetails } from '@/lib/entities/account'
import { GetBusinessAndOccupation, GetFinancialRanges, GetForms } from '@/utils/entities/account'
import { CreateContact, ReadContactByEmail } from '@/utils/entities/contact'
import { individual_form, joint_form } from './samples'

export enum FormStep {
  ACCOUNT_TYPE = 0,
  PERSONAL_INFO = 1,
  FINANCIAL_INFO = 2,
  REGULATORY_INFO = 3,
  DOCUMENTS = 4,
  AGREEMENTS = 5,
  SUCCESS = 6,
}

const IBKRApplicationForm = () => {

  const { t } = useTranslationProvider();
  const searchParams = useSearchParams();
  const advisorCode = searchParams.get('ad');

  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.ACCOUNT_TYPE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const [financialRanges, setFinancialRanges] = useState<FinancialRange[]>([]);
  const [businessAndOccupations, setBusinessAndOccupations] = useState<BusinessAndOccupation[]>([]);
  const [estimatedDeposit, setEstimatedDeposit] = useState<number | null>(null);
  const [estimatedDepositError, setEstimatedDepositError] = useState<string | null>(null);
  const [referrer, setReferrer] = useState<string | null>(null);

  const [agreementForms, setAgreementForms] = useState<FormDetails[] | null>(null);
  const [userSignature, setUserSignature] = useState<string | null>(null);
  
  const agreementFormNumbers = [
    '3230', '3024', '4070', '3044', '3089', '4304', '4404', '5013', '5001', '4024', '9130', '3074', '3203',
    '3070', '3094', '3071', '4587', '2192', '2191', '3077', '4399', '4684', '2109', '4016', '4289',
  ];

  const form = useForm<Application>({
    resolver: zodResolver(application_schema),
    defaultValues: getApplicationDefaults(application_schema),
    mode: 'onChange',
    shouldUnregister: false,
  });

  const sendClientLog = async (
    event: string,
    payload: Record<string, unknown>,
    severity: 'INFO' | 'WARNING' | 'ERROR' = 'WARNING',
  ) => {
    try {
      await fetch('/api/client-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'IBKRApplicationForm',
          event,
          severity,
          timestamp: new Date().toISOString(),
          payload,
        }),
      });
    } catch (error) {
      // Local fallback in case the log endpoint fails.
      console.error('Failed to send client log', error);
    }
  };

  const flattenValidationErrors = (errors: FieldErrors<Application>) => {
    const collected: { field: string; message: string; type?: string }[] = [];

    const walk = (node: unknown, path: string) => {
      if (!node || typeof node !== 'object') return;

      const nodeAsRecord = node as Record<string, unknown>;
      const message = typeof nodeAsRecord.message === 'string' ? nodeAsRecord.message : null;
      const type = typeof nodeAsRecord.type === 'string' ? nodeAsRecord.type : undefined;

      if (message || type) {
        collected.push({
          field: path || 'form',
          message: message ?? 'Validation error',
          type,
        });
      }

      if (Array.isArray(node)) {
        node.forEach((item, index) => {
          walk(item, path ? `${path}.${index}` : String(index));
        });
        return;
      }

      Object.entries(nodeAsRecord).forEach(([key, value]) => {
        if (key === 'ref' || key === 'message' || key === 'type') return;
        walk(value, path ? `${path}.${key}` : key);
      });
    };

    walk(errors as unknown, '');
    return collected;
  };

  const redactFormValuesForLogs = (values: Application) => {
    const sensitiveKeyPattern = /(tax|tin|ssn|signature|checksum|payload|password|secret)/i;

    const transform = (value: unknown, key: string): unknown => {
      if (value === null || value === undefined) return value;

      if (key === 'documents' && Array.isArray(value)) {
        return value.map((document) => {
          const doc = (document ?? {}) as Record<string, unknown>;
          return {
            formNumber: doc.formNumber ?? null,
            proofOfIdentityType: doc.proofOfIdentityType ?? null,
            proofOfAddressType: doc.proofOfAddressType ?? null,
            hasPayload: Boolean(doc.payload),
            hasAttachedFile: Boolean(doc.attachedFile),
          };
        });
      }

      if (value instanceof File) {
        return {
          type: 'File',
          name: value.name,
          size: value.size,
          mimeType: value.type,
        };
      }

      if (Array.isArray(value)) {
        return value.map((item) => transform(item, key));
      }

      if (typeof value === 'object') {
        const asRecord = value as Record<string, unknown>;
        const output: Record<string, unknown> = {};
        Object.entries(asRecord).forEach(([childKey, childValue]) => {
          if (sensitiveKeyPattern.test(childKey)) {
            output[childKey] = '[REDACTED]';
            return;
          }
          output[childKey] = transform(childValue, childKey);
        });
        return output;
      }

      return value;
    };

    return transform(values, 'root');
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [financialRangesResult, businessResult, agreementsResult] = await Promise.all([
          GetFinancialRanges(),
          GetBusinessAndOccupation(),
          GetForms(agreementFormNumbers, 'br'),
        ]);

        setFinancialRanges(financialRangesResult?.jsonData ?? []);  
        setAgreementForms(agreementsResult?.formDetails ?? null);
        setBusinessAndOccupations(businessResult?.jsonData ?? []);

      } catch {
        toast({ title: 'Error', description: 'Failed to load financial ranges, business and occupations, and agreements.', variant: 'destructive' }); 
      }
    };
    fetchData();
  }, []);

  async function handleApplicationContact(values: Application) {
    let contact_id: string | null = null;
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
    for (const c of contacts) {
      if (!c.email) continue;
      let existingContact = await ReadContactByEmail(c.email);
      if (!existingContact) {
        const createResp = await CreateContact({ name: c.name, email: c.email });
        existingContact = { id: createResp.id } as any;
      }
      if (!contact_id && existingContact?.id) {
        contact_id = existingContact.id;
      }
    }
    return contact_id;
  }

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

  const sanitizeIdNumbers = (application: Application): Application => {
    const clone = structuredClone(application);
    const stripIdSeparators = (value: unknown) =>
      typeof value === 'string' ? value.replace(/[\s-]+/g, '') : value;

    const sanitizeHolder = (holder: any) => {
      if (!holder) return;

      if (holder.identification) {
        holder.identification.passport = stripIdSeparators(holder.identification.passport);
        holder.identification.nationalCard = stripIdSeparators(holder.identification.nationalCard);
        holder.identification.driversLicense = stripIdSeparators(holder.identification.driversLicense);
      }

      if (Array.isArray(holder.taxResidencies)) {
        holder.taxResidencies = holder.taxResidencies.map((taxResidency: any) => ({
          ...taxResidency,
          tin: stripIdSeparators(taxResidency?.tin),
        }));
      }

      if (holder.w8Ben) {
        holder.w8Ben.tin = stripIdSeparators(holder.w8Ben.tin);
        holder.w8Ben.foreignTaxId = stripIdSeparators(holder.w8Ben.foreignTaxId);
      }
    };

    switch (clone.customer.type) {
      case 'INDIVIDUAL':
        sanitizeHolder(clone.customer.accountHolder?.accountHolderDetails?.[0]);
        break;
      case 'JOINT':
        sanitizeHolder(clone.customer.jointHolders?.firstHolderDetails?.[0]);
        sanitizeHolder(clone.customer.jointHolders?.secondHolderDetails?.[0]);
        break;
      case 'ORG':
        (clone.customer.organization?.associatedEntities?.associatedIndividuals || []).forEach(sanitizeHolder);
        (clone.customer.organization?.identifications || []).forEach((identification: any) => {
          identification.identification = stripIdSeparators(identification?.identification);
        });
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
  
  const sanitizeOccupationAndBusinessDescriptions = (application: Application): Application => {
    const clone = structuredClone(application);
    const strip = (holder: any) => {
      if (!holder?.employmentDetails) return;
      delete holder.employmentDetails.occupationDescription;
      delete holder.employmentDetails.businessDescription;
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
        (clone.customer.organization?.associatedEntities?.associatedIndividuals || []).forEach(strip);
        break;
    }
    return clone;
  };

  const normalizeJointW8Signers = (application: Application): Application => {
    if (application.customer.type !== 'JOINT') return application;

    const clone = structuredClone(application);
    const firstHolder = clone.customer.jointHolders?.firstHolderDetails?.[0];
    const secondHolder = clone.customer.jointHolders?.secondHolderDetails?.[0];

    const signedBy = [
      firstHolder?.name?.first && firstHolder?.name?.last
        ? `${firstHolder.name.first} ${firstHolder.name.last}`.trim()
        : null,
      secondHolder?.name?.first && secondHolder?.name?.last
        ? `${secondHolder.name.first} ${secondHolder.name.last}`.trim()
        : null,
    ].filter((name): name is string => Boolean(name));

    if (signedBy.length !== 2 || !Array.isArray(clone.documents)) {
      return clone;
    }

    clone.documents = clone.documents.map((document) => {
      if (!document || document.formNumber !== 5001) return document;
      return {
        ...document,
        signedBy,
      };
    });

    return clone;
  };

  function sanitizeApplication(application: Application): Application {
    return sanitizeAccents(
      sanitizeOccupationAndBusinessDescriptions(
        sanitizeEmploymentDetails(
          sanitizeMailingAddress(
            sanitizeIdentificationType(
              sanitizeIdNumbers(application),
            ),
          ),
        ),
      ),
    );
  }

  const handlePreviousStep = () => {
    const prev = currentStep - 1;
    if (prev === FormStep.ACCOUNT_TYPE) {
      form.reset(getApplicationDefaults(application_schema));
      setEstimatedDeposit(null);
      setEstimatedDepositError(null);
      setReferrer(null);
      setUserSignature(null);
    }
    setCurrentStep(prev as FormStep);
  };

  const handleNextStep = async () => {

    let isValid = true;
    let validatedFieldsLog: string[] = [];

    if (currentStep === FormStep.ACCOUNT_TYPE) {
      validatedFieldsLog = ['customer.type'];
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
        validatedFieldsLog = fieldsToValidate;
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
      const validationErrors = flattenValidationErrors(form.formState.errors);
      const currentValues = form.getValues();

      void sendClientLog(
        'form_validation_failed',
        {
          step: FormStep[currentStep],
          currentStep,
          validatedFields: validatedFieldsLog,
          validationErrors,
          estimatedDeposit,
          estimatedDepositError,
          applicationValues: redactFormValuesForLogs(currentValues),
        },
        'WARNING',
      );

      toast({ 
        title: t('forms.form_errors_title'),
        description: t('forms.form_errors_description'),
        variant: 'destructive'
      });
      return;
    }

    if (currentStep === FormStep.AGREEMENTS) {
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

    const valuesWithNormalizedW8Signers = normalizeJointW8Signers(currentValues);
    const sanitizedValues = sanitizeApplication(valuesWithNormalizedW8Signers);

    if (currentStep >= FormStep.PERSONAL_INFO) {
      contact_id = await handleApplicationContact(sanitizedValues);
    }

    let status = 'Started';
    if (currentStep === FormStep.AGREEMENTS) {
      status = 'Completed';
    }

    if (!contact_id) return;

    if (!applicationId) {
      const internalApplication: InternalApplicationPayload = {
        application: sanitizedValues,
        advisor_code: advisorCode,
        master_account: null,
        date_sent_to_ibkr: null,
        status,
        contact_id: contact_id,
        security_questions: null,
        estimated_deposit: estimatedDeposit ?? null,
        risk_profile_id: null,
        referrer: referrer ?? null,
      };
      const createResp = await CreateApplication(internalApplication);
      setApplicationId(createResp.id);
    } else {
      const updatePayload:any = { application: sanitizedValues, status: status };
      if (estimatedDeposit !== null) {
        updatePayload.estimated_deposit = estimatedDeposit;
      }
      if (referrer !== null) {
        updatePayload.referrer = referrer;
      }
      if (contact_id) {
        updatePayload.contact_id = contact_id;
      }
      await UpdateApplicationByID(applicationId, updatePayload);
    }
  }

  if (currentStep === FormStep.SUCCESS) {
    const documents = form.getValues('documents') || [];
    const uploadedDocs = documents.filter(d => d && d.formNumber !== 5001);
    const documentsUploaded = uploadedDocs.length > 0;
    return <ApplicationSuccess documentsUploaded={documentsUploaded} />;
  }

  return (
    <div className="flex flex-col justify-center items-center my-20 gap-5 p-5">
      <div className="text-center">
        <h1 className="text-3xl font-bold ">{t('apply.account.header.title')}</h1>
        <p className="text-lg">{t('apply.account.header.description')}</p>
      </div>
      <ProgressMeter currentStep={currentStep} />
      <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%] max-w-3xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              () => handleNextStep(),
              (errors) => {
                void sendClientLog(
                  'form_submit_blocked_by_validation',
                  {
                    step: FormStep[currentStep],
                    currentStep,
                    validationErrors: flattenValidationErrors(errors),
                    applicationValues: redactFormValuesForLogs(form.getValues()),
                  },
                  'WARNING',
                );
              },
            )}
            className="space-y-8"
          >
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
                <PersonalInfoStep form={form} businessAndOccupations={businessAndOccupations} referrer={referrer} setReferrer={setReferrer} />
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
                  <Button type="button" onClick={handleNextStep} className="bg-primary text-background hover:bg-primary/90">
                    Next
                  </Button>
                </div>
              </>
            )}

            {currentStep === FormStep.AGREEMENTS && (
              <AgreementsStep
                form={form}
                forms={agreementForms}
                userSignature={userSignature}
                onSignatureChange={setUserSignature}
                onPrevious={handlePreviousStep}
                onNext={form.handleSubmit(() => handleNextStep())}
                isSubmitting={isSubmitting}
              />
            )}
          </form>
        </Form>
      </div>
    </div>
  );

}

export default IBKRApplicationForm;
