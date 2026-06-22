'use client'

import React, { useEffect, useState } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { Form } from '@/components/ui/form'
import { application_schema } from '@/lib/clients/schemas/application'
import { Application } from '@/lib/clients/application';
import { toast } from '@/hooks/use-toast'
import PersonalInfoStep from './PersonalInfoStep'
import { CreateAccount, UpdateAccountByAccountID } from '@/utils/clients/account'
import DocumentsStep from './DocumentsStep'
import AccountTypeStep from './AccountTypeStep'
import { Button } from '@/components/ui/button'
import ApplicationSuccess from './ApplicationSuccess'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import FinancialInfoStep from './FinancialInfoStep'
import RegulatoryInfoStep from './RegulatoryInfoStep'
import AgreementsStep from './AgreementsStep'
import { getApplicationDefaults } from '@/utils/clients/application'
import ProgressMeter from './ProgressMeter'
import { BusinessAndOccupation, FinancialRange, FormDetails, InternalAccount } from '@/lib/clients/account'
import { GetBusinessAndOccupation, GetFinancialRanges, GetForms } from '@/utils/clients/account'
import { CreateAccountContact, ReadAccountContacts, UpdateAccountContact } from '@/utils/clients/account_contact'
import { CreateContact, CreateContactScreening, ReadContactByEmail, ReadContactDocuments, ReadContactScreenings, UploadContactDocument } from '@/utils/clients/contact'
import { individual_form, individual_form_2, joint_form } from './samples'
import { Loader2 } from 'lucide-react'

export enum FormStep {
  ACCOUNT_TYPE = 0,
  PERSONAL_INFO = 1,
  FINANCIAL_INFO = 2,
  REGULATORY_INFO = 3,
  DOCUMENTS = 4,
  AGREEMENTS = 5,
  SUCCESS = 6,
}

type PrefetchedData = {
  financialRangesResult: any;
  businessResult: any;
  agreementsResult: any;
};

type Props = {
  prefetchedData?: PrefetchedData | null;
};

type LinkedContact = {
  name: string;
  contact_id: string;
  externalId?: string | null;
  entityId?: string | null;
};

const IBKRApplicationForm = ({ prefetchedData = null }: Props) => {

  const { t } = useTranslationProvider();
  const searchParams = useSearchParams();
  const advisorCode = searchParams.get('ad')

  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.ACCOUNT_TYPE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreparingDocuments, setIsPreparingDocuments] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);

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
        const bootstrap = prefetchedData
          ? prefetchedData
          : await Promise.all([
              GetFinancialRanges(),
              GetBusinessAndOccupation(),
              GetForms(agreementFormNumbers),
            ]).then(([financialRangesResult, businessResult, agreementsResult]) => ({
              financialRangesResult,
              businessResult,
              agreementsResult,
            }));

        setFinancialRanges(bootstrap.financialRangesResult?.jsonData ?? []);  
        setAgreementForms(bootstrap.agreementsResult?.formDetails ?? null);
        setBusinessAndOccupations(bootstrap.businessResult?.jsonData ?? []);

      } catch {
        toast({ title: 'Error', description: 'Failed to load financial ranges, business and occupations, and agreements.', variant: 'destructive' }); 
      }
    };
    fetchData();
  }, [prefetchedData]);

  const extractApplicantContacts = (values: Application) => {
    const contacts: { name: string; email?: string; externalId?: string | null; entityId?: string | null }[] = [];
    const { customer } = values;

    switch (customer.type) {
      case 'INDIVIDUAL': {
        const holder = customer.accountHolder?.accountHolderDetails?.[0];
        if (holder?.name?.first || holder?.name?.last) {
          contacts.push({
            name: `${holder.name.first} ${holder.name.last}`.trim(),
            email: holder.email,
            externalId: holder.externalId ?? null,
            entityId: (holder as any)?.entityId ? String((holder as any).entityId) : null,
          });
        }
        break;
      }
      case 'JOINT': {
        const first = customer.jointHolders?.firstHolderDetails?.[0];
        const second = customer.jointHolders?.secondHolderDetails?.[0];
        if (first?.name?.first || first?.name?.last) {
          contacts.push({
            name: `${first.name.first} ${first.name.last}`.trim(),
            email: first.email,
            externalId: first.externalId ?? null,
            entityId: (first as any)?.entityId ? String((first as any).entityId) : null,
          });
        }
        if (second?.name?.first || second?.name?.last) {
          contacts.push({
            name: `${second.name.first} ${second.name.last}`.trim(),
            email: second.email,
            externalId: second.externalId ?? null,
            entityId: (second as any)?.entityId ? String((second as any).entityId) : null,
          });
        }
        break;
      }
      case 'ORG': {
        const individuals = customer.organization?.associatedEntities?.associatedIndividuals || [];
        individuals.forEach((ind) => {
          if (ind?.name?.first || ind?.name?.last) {
            contacts.push({
              name: `${ind.name.first} ${ind.name.last}`.trim(),
              email: ind.email,
              externalId: ind.externalId ?? null,
              entityId: (ind as any)?.entityId ? String((ind as any).entityId) : null,
            });
          }
        });
        break;
      }
    }
    return contacts.filter((c) => c.name);
  }

  async function ensureContacts(values: Application) {
    const applicantContacts = extractApplicantContacts(values);
    const linkedContacts: LinkedContact[] = [];

    for (const c of applicantContacts) {
      let existingContact = c.email ? await ReadContactByEmail(c.email) : null;
      if (!existingContact) {
        const createResp = await CreateContact({
          name: c.name,
          email: c.email ?? undefined,
        } as any);
        existingContact = { id: createResp.id } as any;
      }

      if (!existingContact?.id) continue;
      linkedContacts.push({
        name: c.name,
        contact_id: existingContact.id,
        externalId: c.externalId ?? null,
        entityId: c.entityId ?? null,
      });
    }

    return linkedContacts;
  }

  async function ensureAccountContactLinks(
    persistedAccountId: string,
    linkedContacts: LinkedContact[]
  ) {
    const existingLinks = await ReadAccountContacts({ account_id: persistedAccountId });
    const existingByContact = new Map(existingLinks.map((link) => [link.contact_id, link]));

    for (const linkedContact of linkedContacts) {
      const existing = existingByContact.get(linkedContact.contact_id);
      if (!existing) {
        await CreateAccountContact({
          account_id: persistedAccountId,
          contact_id: linkedContact.contact_id,
          entity_id: linkedContact.entityId ?? null,
          external_id: linkedContact.externalId ?? null,
        });
      } else {
        const updates: Record<string, string | null> = {};
        const existingEntity = String(existing.entity_id ?? '').trim();
        const existingExternal = String(existing.external_id ?? '').trim();
        const nextEntity = String(linkedContact.entityId ?? '').trim();
        const nextExternal = String(linkedContact.externalId ?? '').trim();

        if (!existingEntity && nextEntity) updates.entity_id = nextEntity;
        if (!existingExternal && nextExternal) updates.external_id = nextExternal;

        if (Object.keys(updates).length > 0) {
          await UpdateAccountContact({ id: existing.id }, updates);
        }
      }
    }
  }

  async function ensureContactScreenings(linkedContacts: LinkedContact[]) {
    for (const linkedContact of linkedContacts) {
      const screenings = await ReadContactScreenings(linkedContact.contact_id);
      if (!screenings || screenings.length === 0) {
        await CreateContactScreening(linkedContact.contact_id);
      }
    }
  }

  async function ensureContactDocuments(
    accountIdForDocuments: string,
    values: Application,
    linkedContacts: Array<{ name: string; contact_id: string }>
  ) {
    const nameToContactId = new Map(linkedContacts.map((contact) => [contact.name, contact.contact_id]));
    const documents = values.documents || [];

    for (const document of documents) {
      if (!document?.attachedFile || !document?.payload) continue;
      const signers = document.signedBy || [];
      if (signers.length === 0) continue;

      const category = document.formNumber === 5001
        ? 'Tax'
        : document.formNumber === 8001
          ? 'Proof of Identity'
          : 'Proof of Address';

      const type = document.formNumber === 5001
        ? 'W8 Form'
        : document.formNumber === 8001
          ? (document.proofOfIdentityType || 'Document')
          : (document.proofOfAddressType || 'Document');

      for (const signerName of signers) {
        const contactId = nameToContactId.get(signerName);
        if (!contactId) continue;

        const existing = await ReadContactDocuments(contactId);
        const alreadyUploaded = (existing?.documents || []).some(
          (doc: any) => doc?.sha1_checksum && doc.sha1_checksum === document.attachedFile?.sha1Checksum
        );
        if (alreadyUploaded) continue;

        await UploadContactDocument(
          accountIdForDocuments,
          contactId,
          document.attachedFile.fileName ?? '',
          document.attachedFile.fileLength ?? 0,
          document.attachedFile.sha1Checksum ?? '',
          document.payload?.mimeType || '',
          document.payload?.data || '',
          category,
          type,
          'en',
          (document as any).issuedDate || '',
          (document as any).expiryDate || '',
          null,
        );
      }
    }
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

  const buildApplicationJsonForStorage = (application: Application): Application => {
    const clone = structuredClone(application);
    const docs = Array.isArray(clone.documents) ? clone.documents : [];

    clone.documents = docs.map((doc: any) => {
      if (!doc) return doc;
      return {
        formNumber: doc.formNumber ?? null,
        signedBy: Array.isArray(doc.signedBy) ? doc.signedBy : [],
        externalIndividualId: doc.externalIndividualId ?? null,
        proofOfIdentityType: doc.proofOfIdentityType ?? null,
        proofOfAddressType: doc.proofOfAddressType ?? null,
        validAddress: doc.validAddress ?? false,
        execLoginTimestamp: doc.execLoginTimestamp ?? null,
        execTimestamp: doc.execTimestamp ?? null,
        issuedDate: doc.issuedDate ?? null,
        expiryDate: doc.expiryDate ?? null,
        attachedFile: doc.attachedFile ? {
          fileName: doc.attachedFile.fileName ?? '',
          fileLength: doc.attachedFile.fileLength ?? 0,
          sha1Checksum: doc.attachedFile.sha1Checksum ?? '',
        } : null,
      };
    }) as any;

    return clone;
  };

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
    const currentValues = form.getValues();
    void sendClientLog(
      'form_step_attempt',
      {
        step: FormStep[currentStep],
        currentStep,
        estimatedDeposit,
        estimatedDepositError,
        applicationValues: redactFormValuesForLogs(currentValues),
      },
      'INFO',
    );

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

    void sendClientLog(
      'form_step_validation_passed',
      {
        step: FormStep[currentStep],
        currentStep,
        validatedFields: validatedFieldsLog,
        applicationValues: redactFormValuesForLogs(form.getValues()),
      },
      'INFO',
    );

    if (currentStep === FormStep.ACCOUNT_TYPE) {
      const next = currentStep + 1;
      setCurrentStep(next as FormStep);
      return;
    }

    if (currentStep === FormStep.AGREEMENTS) {
      try {
        setIsSubmitting(true);
        await saveProgress({ finalizeApplication: true });
        void sendClientLog(
          'form_submission_success',
          {
            step: FormStep[currentStep],
            currentStep,
            applicationValues: redactFormValuesForLogs(form.getValues()),
          },
          'INFO',
        );
        toast({
          title: "Application Submitted",
          description: "Your IBKR application has been successfully submitted.",
          variant: "success"
        });
        setCurrentStep(FormStep.SUCCESS);
        setAccountId(null);
      } catch (error) {
        void sendClientLog(
          'form_submission_failed',
          {
            step: FormStep[currentStep],
            currentStep,
            error: error instanceof Error ? error.message : String(error),
            applicationValues: redactFormValuesForLogs(form.getValues()),
          },
          'ERROR',
        );
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
      const prepareContacts = currentStep + 1 === FormStep.DOCUMENTS;
      if (prepareContacts) setIsPreparingDocuments(true);
      await saveProgress({ prepareContacts });
      void sendClientLog(
        'form_step_save_success',
        {
          step: FormStep[currentStep],
          currentStep,
          nextStep: FormStep[currentStep + 1],
          applicationValues: redactFormValuesForLogs(form.getValues()),
        },
        'INFO',
      );
      const next = currentStep + 1;
      setCurrentStep(next as FormStep);
      toast({
        title: 'Saved',
        description: 'Progress saved.',
        variant: 'success'
      });
    } catch (error) {
      void sendClientLog(
        'form_step_save_failed',
        {
          step: FormStep[currentStep],
          currentStep,
          error: error instanceof Error ? error.message : String(error),
          applicationValues: redactFormValuesForLogs(form.getValues()),
        },
        'ERROR',
      );
      toast({
        title: 'Error',
        description: 'Failed to save progress.',
        variant: 'destructive'
      });
    } finally {
      setIsPreparingDocuments(false);
    }
  };

  async function saveProgress(
    options: { stepOverride?: FormStep; prepareContacts?: boolean; finalizeApplication?: boolean } = {},
  ): Promise<{ persistedAccountId: string | null; linkedContacts: LinkedContact[] }> {
    const stepAtSave = options.stepOverride ?? currentStep;
    const prepareContacts = options.prepareContacts === true;
    const finalizeApplication = options.finalizeApplication === true;
    
    const currentValues = form.getValues();

    const valuesWithNormalizedW8Signers = normalizeJointW8Signers(currentValues);
    const sanitizedValues = sanitizeApplication(valuesWithNormalizedW8Signers);
    const storageValues = buildApplicationJsonForStorage(sanitizedValues);
    const shouldSyncContacts = prepareContacts || finalizeApplication;
    const linkedContacts = shouldSyncContacts ? await ensureContacts(sanitizedValues) : [];

    if (shouldSyncContacts && linkedContacts.length === 0) {
      return { persistedAccountId: accountId, linkedContacts };
    }

    let persistedAccountId = accountId;
    if (!accountId) {
      const internalAccount: InternalAccount = {
        ibkr_account_number: null,
        ibkr_username: null,
        temporal_email: null,
        application_json: storageValues as unknown as Record<string, unknown>,
        advisor_code: advisorCode,
        master_account: null,
        date_sent_to_ibkr: null,
        estimated_deposit: estimatedDeposit ?? null,
        management_type: null,
        referrer: referrer ?? null,
        emailed_credentials: false,
      };
      const createResp = await CreateAccount(internalAccount);
      persistedAccountId = createResp.id;
      setAccountId(createResp.id);
    } else {
      const updatePayload: Partial<InternalAccount> = {
        application_json: storageValues as unknown as Record<string, unknown>,
      };
      if (estimatedDeposit !== null) {
        updatePayload.estimated_deposit = estimatedDeposit;
      }
      if (referrer !== null) {
        updatePayload.referrer = referrer;
      }
      await UpdateAccountByAccountID(accountId, updatePayload);
      persistedAccountId = accountId;
    }

    if (!persistedAccountId) {
      return { persistedAccountId: null, linkedContacts };
    }

    if (shouldSyncContacts && linkedContacts.length > 0) {
      await ensureAccountContactLinks(persistedAccountId, linkedContacts);
    }

    if (finalizeApplication && linkedContacts.length > 0) {
      await ensureContactScreenings(linkedContacts);
    }

    if (finalizeApplication && linkedContacts.length > 0) {
      await ensureContactDocuments(persistedAccountId, sanitizedValues, linkedContacts);
    }
    return { persistedAccountId, linkedContacts };
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
                  <Button type="button" variant="outline" onClick={handlePreviousStep} disabled={isPreparingDocuments}>Previous</Button>
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isPreparingDocuments}
                    className="bg-primary text-background hover:bg-primary/90"
                  >
                    {isPreparingDocuments ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Preparing documents...
                      </span>
                    ) : 'Next'}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === FormStep.DOCUMENTS && (
              <>
                <DocumentsStep form={form} accountId={accountId} />
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
