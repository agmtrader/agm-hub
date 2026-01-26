import React, { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import CountriesFormField from "@/components/ui/CountriesFormField";
import { Application } from "@/lib/entities/application";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { phone_types, id_type, marital_status, employment_status, tin_types, account_types } from '@/lib/public/form';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createW8FormDocument } from '@/utils/form';
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { format as formatDateFns } from "date-fns";
import { SecurityQuestion } from '@/lib/entities/security_question';
import { GetBusinessAndOccupation, GetSecurityQuestions } from '@/utils/entities/account';
import StatesFormField from "@/components/ui/StatesFormField";
import { CreateContact, ReadContactByEmail } from '@/utils/entities/contact';
import { BusinessAndOccupation } from '@/lib/entities/account';

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export async function handleApplicationContact(values: Application) {
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
      // CreateContact returns IDResponse
      existingContact = { id: createResp.id } as any;
    }
    if (!contact_id && existingContact?.id) {
      contact_id = existingContact.id;
    }
  }
  return contact_id;
}

interface PersonalInfoStepProps {
  form: UseFormReturn<Application>;
  onSecurityQuestionsChange?: (qa: Record<string, string>) => void;
}

const PersonalInfoStep = ({ form, onSecurityQuestionsChange }: PersonalInfoStepProps) => {

  const { t } = useTranslationProvider();

  const [questions, setQuestions] = React.useState<SecurityQuestion[]>([]);
  const [businessAndOccupations, setBusinessAndOccupations] = React.useState<BusinessAndOccupation[]>([]);
  const [selectedQA, setSelectedQA] = React.useState<Record<string, string>>({});

  const externalIdRef = useRef<string>(generateUUID())
  const secondHolderIdRef = useRef<string>(generateUUID())

  const accountType = form.watch("customer.type");

  const taxResidencyPathsByType: Record<string, string[]> = {
    INDIVIDUAL: ["customer.accountHolder.accountHolderDetails.0"],
    JOINT: [
      "customer.jointHolders.firstHolderDetails.0",
      "customer.jointHolders.secondHolderDetails.0",
    ],
    ORG: ["customer.organization.associatedEntities.associatedIndividuals.0"],
  };

  const getIdNumberForPath = (basePath: string) => {
    const identification = form.getValues(`${basePath}.identification` as any) || {};
    return (
      identification.passport ??
      identification.driversLicense ??
      identification.nationalCard ??
      ""
    );
  };

  const syncTaxResidencyFields = (
    paths: string[],
    { syncTin, syncCountry }: { syncTin?: boolean; syncCountry?: boolean } = {}
  ) => {
    const legalCountry = form.getValues("customer.legalResidenceCountry" as any);

    paths.forEach((path) => {
      const countryPath = `${path}.taxResidencies.0.country` as any;
      if (
        syncCountry &&
        legalCountry &&
        form.getValues(countryPath) !== legalCountry
      ) {
        form.setValue(countryPath, legalCountry, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
      }

      if (syncTin) {
        const idNumber = getIdNumberForPath(path);
        const tinPath = `${path}.taxResidencies.0.tin` as any;
        if (form.getValues(tinPath) !== idNumber) {
          form.setValue(tinPath, idNumber, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          });
        }
      }

      const tinTypePath = `${path}.taxResidencies.0.tinType` as any;
      if (form.getValues(tinTypePath) !== "NonUS_NationalId") {
        form.setValue(tinTypePath, "NonUS_NationalId", {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
      }
    });
  };

  const syncPrimaryPrefixFromName = (basePath: string) => {
    const first = (form.getValues(`${basePath}.name.first` as any) || "").trim();
    const last = (form.getValues(`${basePath}.name.last` as any) || "").trim();
    if (!first || !last) return;
    const prefix = `${first.charAt(0)}${last.slice(0, 5)}`.toLowerCase();
    if (!prefix) return;

    if (form.getValues("customer.prefix" as any) !== prefix) {
      form.setValue("customer.prefix" as any, prefix, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
    if (form.getValues("users.0.prefix" as any) !== prefix) {
      form.setValue("users.0.prefix" as any, prefix, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
  };

  // Simplified form watchers for essential syncing
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      
      // Sync customer prefix with user prefix
      if (name === "customer.prefix") {
        const customerPrefix = value.customer?.prefix;
        if (customerPrefix) {
          form.setValue("users.0.prefix", customerPrefix);
        }
      }

      if (
        name === "customer.accountHolder.accountHolderDetails.0.email" ||
        name === "customer.jointHolders.firstHolderDetails.0.email" ||
        name === "customer.organization.associatedEntities.associatedIndividuals.0.email"
      ) {
        const email =
          name === "customer.accountHolder.accountHolderDetails.0.email"
            ? value.customer?.accountHolder?.accountHolderDetails?.[0]?.email
            : name === "customer.jointHolders.firstHolderDetails.0.email"
              ? value.customer?.jointHolders?.firstHolderDetails?.[0]?.email
              : value.customer?.organization?.associatedEntities?.associatedIndividuals?.[0]?.email;

        if (email) {
          form.setValue("customer.email", email);
        }
      }
      
      // Sync business description for organizations
      if (name === "customer.organization.identifications.0.businessDescription") {
        const businessDescription = value.customer?.organization?.identifications?.[0]?.businessDescription;
        if (businessDescription) {
          form.setValue("customer.organization.accountSupport.businessDescription", businessDescription);
        }
      }
      
      // Sync investment objectives between account setup and financial information
      if (name && name.startsWith("accounts.0.investmentObjectives")) {
        const invObjectives = (value.accounts?.[0]?.investmentObjectives || []).filter(Boolean) as string[];
        const acctType = value.customer?.type;
        if (acctType === 'INDIVIDUAL') {
          form.setValue("customer.accountHolder.financialInformation.0.investmentObjectives", invObjectives);
        } else if (acctType === 'JOINT') {
          form.setValue("customer.jointHolders.financialInformation.0.investmentObjectives", invObjectives);
        } else if (acctType === 'ORG') {
          form.setValue("customer.organization.financialInformation.0.investmentObjectives", invObjectives);
        }
      }

      // Update W8 documents when names change
      const accountType = value.customer?.type;
      let shouldUpdateW8Documents = false;
      const holderPaths = taxResidencyPathsByType[accountType ?? ""] ?? [];
      
      // Helper function to update W8Ben form while preserving all existing fields
      const updateW8BenForm = (basePath: string, firstName?: string, lastName?: string, tin?: string) => {
        const currentW8Ben = form.getValues(`${basePath}.w8Ben` as any);
        const updatedW8Ben = { ...currentW8Ben };
        
        if (firstName && lastName) {
          updatedW8Ben.name = `${firstName} ${lastName}`;
          shouldUpdateW8Documents = true;
        }
        if (tin) {
          updatedW8Ben.foreignTaxId = tin;
        }
        
        form.setValue(`${basePath}.w8Ben` as any, updatedW8Ben);
      };
      
      if (accountType === 'INDIVIDUAL') {
        if (name?.includes("customer.accountHolder.accountHolderDetails.0.name.first") || 
            name?.includes("customer.accountHolder.accountHolderDetails.0.name.last")) {
          const firstName = value.customer?.accountHolder?.accountHolderDetails?.[0]?.name?.first;
          const lastName = value.customer?.accountHolder?.accountHolderDetails?.[0]?.name?.last;
          updateW8BenForm("customer.accountHolder.accountHolderDetails.0", firstName ?? undefined, lastName ?? undefined);
          syncPrimaryPrefixFromName("customer.accountHolder.accountHolderDetails.0");
        }
        if (name?.includes("customer.accountHolder.accountHolderDetails.0.taxResidencies.0.tin")) {
          const tin = value.customer?.accountHolder?.accountHolderDetails?.[0]?.taxResidencies?.[0]?.tin;
          updateW8BenForm("customer.accountHolder.accountHolderDetails.0", undefined, undefined, tin ?? undefined);
        }
      } else if (accountType === 'JOINT') {
        // First holder
        if (name?.includes("customer.jointHolders.firstHolderDetails.0.name.first") || 
            name?.includes("customer.jointHolders.firstHolderDetails.0.name.last")) {
          const firstName = value.customer?.jointHolders?.firstHolderDetails?.[0]?.name?.first;
          const lastName = value.customer?.jointHolders?.firstHolderDetails?.[0]?.name?.last;
          updateW8BenForm("customer.jointHolders.firstHolderDetails.0", firstName ?? undefined, lastName ?? undefined);
          syncPrimaryPrefixFromName("customer.jointHolders.firstHolderDetails.0");
        }
        if (name?.includes("customer.jointHolders.firstHolderDetails.0.taxResidencies.0.tin")) {
          const tin = value.customer?.jointHolders?.firstHolderDetails?.[0]?.taxResidencies?.[0]?.tin;
          updateW8BenForm("customer.jointHolders.firstHolderDetails.0", undefined, undefined, tin ?? undefined);
        }
        
        // Second holder
        if (name?.includes("customer.jointHolders.secondHolderDetails.0.name.first") || 
            name?.includes("customer.jointHolders.secondHolderDetails.0.name.last")) {
          const firstName = value.customer?.jointHolders?.secondHolderDetails?.[0]?.name?.first;
          const lastName = value.customer?.jointHolders?.secondHolderDetails?.[0]?.name?.last;
          updateW8BenForm("customer.jointHolders.secondHolderDetails.0", firstName ?? undefined, lastName ?? undefined);
        }
        if (name?.includes("customer.jointHolders.secondHolderDetails.0.taxResidencies.0.tin")) {
          const tin = value.customer?.jointHolders?.secondHolderDetails?.[0]?.taxResidencies?.[0]?.tin;
          updateW8BenForm("customer.jointHolders.secondHolderDetails.0", undefined, undefined, tin ?? undefined);
        }
      } else if (accountType === 'ORG') {
        if (name?.includes("customer.organization.associatedEntities.associatedIndividuals.0.name.first") || 
            name?.includes("customer.organization.associatedEntities.associatedIndividuals.0.name.last")) {
          const firstName = value.customer?.organization?.associatedEntities?.associatedIndividuals?.[0]?.name?.first;
          const lastName = value.customer?.organization?.associatedEntities?.associatedIndividuals?.[0]?.name?.last;
          updateW8BenForm("customer.organization.associatedEntities.associatedIndividuals.0", firstName ?? undefined, lastName ?? undefined);
          syncPrimaryPrefixFromName("customer.organization.associatedEntities.associatedIndividuals.0");
        }
        if (name?.includes("customer.organization.associatedEntities.associatedIndividuals.0.taxResidencies.0.tin")) {
          const tin = value.customer?.organization?.associatedEntities?.associatedIndividuals?.[0]?.taxResidencies?.[0]?.tin;
          updateW8BenForm("customer.organization.associatedEntities.associatedIndividuals.0", undefined, undefined, tin ?? undefined);
        }
      }

      // Update W8 documents in the documents array when names change
      if (shouldUpdateW8Documents) {
        setTimeout(() => updateW8Documents(), 100);
      }

      // Auto-set source of wealth to Income when employment type is EMPLOYED
      if (name?.includes("employmentType")) {
        const employmentType = name.includes("customer.accountHolder.accountHolderDetails.0.employmentType") 
          ? value.customer?.accountHolder?.accountHolderDetails?.[0]?.employmentType
          : name.includes("customer.jointHolders.firstHolderDetails.0.employmentType")
          ? value.customer?.jointHolders?.firstHolderDetails?.[0]?.employmentType
          : name.includes("customer.jointHolders.secondHolderDetails.0.employmentType")
          ? value.customer?.jointHolders?.secondHolderDetails?.[0]?.employmentType
          : name.includes("customer.organization.associatedEntities.associatedIndividuals.0.employmentType")
          ? value.customer?.organization?.associatedEntities?.associatedIndividuals?.[0]?.employmentType
          : null;

        if (employmentType === 'EMPLOYED') {
          if (accountType === 'INDIVIDUAL') {
            form.setValue("customer.accountHolder.financialInformation.0.sourcesOfWealth.0.sourceType", "SOW-IND-Income");
          } else if (accountType === 'JOINT') {
            form.setValue("customer.jointHolders.financialInformation.0.sourcesOfWealth.0.sourceType", "SOW-IND-Income");
          } else if (accountType === 'ORG') {
            form.setValue("customer.organization.financialInformation.0.sourcesOfWealth.0.sourceType", "SOW-IND-Income");
          }
        }

        // Initialize employer address with nulls when EMPLOYED or SELFEMPLOYED
        if (['EMPLOYED', 'SELFEMPLOYED'].includes(employmentType as string)) {
          const employmentDetailsPath = name.replace(/employmentType$/, 'employmentDetails');
          const currentDetails = form.getValues(employmentDetailsPath as any);
          
          if (!currentDetails?.employerAddress) {
             form.setValue(`${employmentDetailsPath}.employerAddress` as any, {
                country: null,
                street1: null,
                street2: null,
                city: null,
                state: null,
                postalCode: null
             }, {
                shouldValidate: false,
                shouldDirty: true,
                shouldTouch: false,
             });
          }
        }

        // Clear employment details when not EMPLOYED or SELFEMPLOYED
        if (employmentType && employmentType !== 'EMPLOYED' && employmentType !== 'SELFEMPLOYED') {
          const employmentDetailsPath = name.replace(/employmentType$/, 'employmentDetails');
          form.setValue(employmentDetailsPath as any, null, {
            shouldValidate: false,
            shouldDirty: true,
            shouldTouch: false,
          });
        }
      }

      // Keep tax residency in sync with legal residence country
      if (name === "customer.legalResidenceCountry") {
        syncTaxResidencyFields(holderPaths, { syncCountry: true });
      }

      // When residence address country changes, set legal residence + tax country
      if (name?.endsWith("residenceAddress.country")) {
        const newCountry = form.getValues(name as any);
        if (newCountry) {
          if (form.getValues("customer.legalResidenceCountry" as any) !== newCountry) {
            form.setValue("customer.legalResidenceCountry", newCountry, {
              shouldDirty: false,
              shouldTouch: false,
              shouldValidate: false,
            });
          }
          syncTaxResidencyFields(holderPaths, { syncCountry: true });
        }
      }

      // Auto-fill tax residency TIN/country from identification + legal residence
      if (name?.includes(".identification.")) {
        const targetPath = holderPaths.find((path) =>
          name?.startsWith(`${path}.identification`)
        );
        if (targetPath) {
          syncTaxResidencyFields([targetPath], {
            syncTin: true,
            syncCountry: true,
          });
        }
      }

      // When ID type changes, re-sync TIN with the active ID number and defaults
      if (name?.endsWith("identificationType")) {
        const basePath = name.replace(/\.identificationType$/, "");
        if (holderPaths.includes(basePath)) {
          syncTaxResidencyFields([basePath], {
            syncTin: true,
            syncCountry: true,
          });
        }
      }

      // Ensure defaults are applied when switching account type
      if (name === "customer.type") {
        syncTaxResidencyFields(holderPaths, {
          syncTin: true,
          syncCountry: true,
        });
      }

      // Ensure only the selected identification number field is kept
      if (name?.endsWith("identificationType")) {
        const selectedIdType = form.getValues(name as any) as string | undefined;
        const basePath = name.replace(/\.identificationType$/, "");

        const idFieldMapping: Record<string, string> = {
          Passport: "passport",
          "Driver License": "driversLicense",
          "National ID Card": "nationalCard",
        };

        const selectedKey = idFieldMapping[selectedIdType ?? ""] ?? "";

        // Build a clean identification object retaining misc keys (issuingCountry, etc.)
        const currentIdentification = form.getValues(`${basePath}.identification` as any) || {};

        // 1. Preserve non ID-number fields (e.g., issuingCountry, citizenship, expirationDate)
        const cleanedIdentification: Record<string, any> = {};
        Object.entries(currentIdentification).forEach(([k, v]) => {
          if (!Object.values(idFieldMapping).includes(k)) {
            cleanedIdentification[k] = v; // keep misc keys
          }
        });

        if (selectedKey) {
          // 2. Attempt to carry over any existing ID number value from the previous key(s)
          const idNumberKeys = Object.values(idFieldMapping);
          // Prefer the value already stored under the new key (if any)
          let carriedValue = currentIdentification[selectedKey];

          // If new key is empty, look for the first non-empty value from other ID keys
          if (!carriedValue) {
            carriedValue = idNumberKeys
              .filter((k) => k !== selectedKey)
              .map((k) => currentIdentification[k])
              .find((v) => v !== undefined && v !== "");
          }

          cleanedIdentification[selectedKey] = carriedValue ?? "";
        }

        // 3. Update the form with the cleaned + migrated identification object
        form.setValue(`${basePath}.identification` as any, cleanedIdentification);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // ensure multiCurrency is always true
  useEffect(() => {
    form.setValue("accounts.0.multiCurrency", true, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
    form.setValue("accounts.0.feesTemplateName", "Default", {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [form]);

  // Fetch available questions once
  useEffect(() => {
    (async () => {
      try {
        const [questionsResp, businessResp] = await Promise.all([
          GetSecurityQuestions(),
          GetBusinessAndOccupation()
        ]);
        setQuestions(questionsResp.jsonData || []);
        setBusinessAndOccupations(businessResp.jsonData || []);
      } catch (err) {
        console.error('Failed to fetch initial data', err);
      }
    })();
  }, []);

  // Whenever the selected Q&A changes, bubble up a mapping where the keys
  // are the actual question texts (labels) instead of their numeric IDs so that
  // future backend changes to question IDs do not break persisted answers.
  useEffect(() => {
    if (!onSecurityQuestionsChange) return;

    const qaByText: Record<string, string> = {};
    Object.entries(selectedQA).forEach(([id, answer]) => {
      const label = questions.find((q) => q.id === id)?.question || id;
      qaByText[label] = answer;
    });

    onSecurityQuestionsChange(qaByText);
  }, [selectedQA, onSecurityQuestionsChange, questions]);

  // When the account type changes

  // Generate external IDs if not already set
  useEffect(() => {
    const currentCustomerExternalId = form.getValues("customer.externalId");
    if (!currentCustomerExternalId) {
      form.setValue("customer.externalId", externalIdRef.current);
    }

    if (accountType === 'INDIVIDUAL') {
      const currentAccountHolderExternalId = form.getValues("customer.accountHolder.accountHolderDetails.0.externalId");
      if (!currentAccountHolderExternalId) {
        form.setValue("customer.accountHolder.accountHolderDetails.0.externalId", externalIdRef.current);
      }
    } else if (accountType === 'JOINT') {
      const firstHolderExternalId = form.getValues("customer.jointHolders.firstHolderDetails.0.externalId");
      if (!firstHolderExternalId) {
        form.setValue("customer.jointHolders.firstHolderDetails.0.externalId", externalIdRef.current);
      }
      const secondHolderExternalId = form.getValues("customer.jointHolders.secondHolderDetails.0.externalId");
      if (!secondHolderExternalId) {
        form.setValue("customer.jointHolders.secondHolderDetails.0.externalId", secondHolderIdRef.current);
      }
    } else if (accountType === 'ORG') {
      const orgIndividualExternalId = form.getValues("customer.organization.associatedEntities.associatedIndividuals.0.externalId");
      if (!orgIndividualExternalId) {
        form.setValue("customer.organization.associatedEntities.associatedIndividuals.0.externalId", externalIdRef.current);
      }
    }

    // Generate account external ID
      const accountExternalId = form.getValues("accounts.0.externalId");
      if (!accountExternalId) {
        form.setValue("accounts.0.externalId", externalIdRef.current);
      }

      // Keep customer & account external IDs aligned with first holder in JOINT accounts
      const firstHolderExternalId = form.getValues("customer.jointHolders.firstHolderDetails.0.externalId");
      if (accountType === 'JOINT' && firstHolderExternalId) {
        if (form.getValues('customer.externalId') !== firstHolderExternalId) {
          form.setValue('customer.externalId', firstHolderExternalId);
        }
        if (form.getValues('accounts.0.externalId') !== firstHolderExternalId) {
          form.setValue('accounts.0.externalId', firstHolderExternalId);
        }
      }

    // Generate user external IDs (ensure one per account holder)
    // Primary user (always present)
    const userExternalId0 = form.getValues("users.0.externalUserId");
    if (!userExternalId0) {
      form.setValue("users.0.externalUserId", externalIdRef.current);
    }
    const userIndividualId0 = form.getValues("users.0.externalIndividualId");
    if (!userIndividualId0) {
      form.setValue("users.0.externalIndividualId", externalIdRef.current);
    }
    // Ensure primary user prefix exists
    const userPrefix0 = form.getValues("users.0.prefix");
    if (!userPrefix0) {
      form.setValue("users.0.prefix", form.getValues("customer.prefix") ?? "");
    }

    // Secondary user for JOINT accounts
    if (accountType === 'JOINT') {
      const userExternalId1 = form.getValues("users.1.externalUserId");
      if (!userExternalId1) {
        form.setValue("users.1.externalUserId", secondHolderIdRef.current);
      }
      const userIndividualId1 = form.getValues("users.1.externalIndividualId");
      if (!userIndividualId1) {
        form.setValue("users.1.externalIndividualId", secondHolderIdRef.current);
      }
      const userPrefix1 = form.getValues("users.1.prefix");
      if (!userPrefix1) {
        form.setValue("users.1.prefix", form.getValues("customer.prefix") ?? "");
      }
    } else {
      // For non-joint accounts, ensure we keep only one user entry to avoid stale data
      if ((form.getValues("users") || []).length > 1) {
        form.setValue("users", (form.getValues("users") as any[]).slice(0, 1));
      }
    }
    // Keep user external IDs in sync with joint holder IDs on every change
    let unsubscribe: (() => void) | undefined;
    if (accountType === 'JOINT') {
      const subscription = form.watch((value, { name }) => {
        if (!name) return;
        if (!name.startsWith('customer.jointHolders')) return;

        const firstId = value.customer?.jointHolders?.firstHolderDetails?.[0]?.externalId;
        const secondId = value.customer?.jointHolders?.secondHolderDetails?.[0]?.externalId;

        if (firstId) {
          if (value.users?.[0]?.externalUserId !== firstId) {
            form.setValue('users.0.externalUserId', firstId);
          }
          if (value.users?.[0]?.externalIndividualId !== firstId) {
            form.setValue('users.0.externalIndividualId', firstId);
          }
        }

        if (secondId) {
          if ((value.users?.[1] ?? {}).externalUserId !== secondId) {
            form.setValue('users.1.externalUserId', secondId);
          }
          if ((value.users?.[1] ?? {}).externalIndividualId !== secondId) {
            form.setValue('users.1.externalIndividualId', secondId);
          }
        }
      });

      unsubscribe = () => {
        if (subscription?.unsubscribe) subscription.unsubscribe();
      };
    }

    return () => {
      unsubscribe?.();
    };
  }, [accountType, form]);

  // Initialize W8 documents when account type changes
  useEffect(() => {
    updateW8Documents();
  }, [accountType]);

  // Ensure financialInformation.0.investmentObjectives is initialized from accounts.0.investmentObjectives
  useEffect(() => {
    const objectives = (form.getValues("accounts.0.investmentObjectives") || []).filter(Boolean) as string[];
    const type = form.getValues("customer.type");
    if (objectives && objectives.length) {
      if (type === 'INDIVIDUAL') {
        form.setValue("customer.accountHolder.financialInformation.0.investmentObjectives", objectives, { shouldValidate: false, shouldDirty: false });
      } else if (type === 'JOINT') {
        form.setValue("customer.jointHolders.financialInformation.0.investmentObjectives", objectives, { shouldValidate: false, shouldDirty: false });
      } else if (type === 'ORG') {
        form.setValue("customer.organization.financialInformation.0.investmentObjectives", objectives, { shouldValidate: false, shouldDirty: false });
      }
    }
  }, [accountType, form]);

  // Ensure customer.email is initialized/synced with the appropriate holder email when account type changes
  useEffect(() => {
    let email: string | undefined;

    if (accountType === 'INDIVIDUAL') {
      email = form.getValues("customer.accountHolder.accountHolderDetails.0.email") ?? undefined;
    } else if (accountType === 'JOINT') {
      email = form.getValues("customer.jointHolders.firstHolderDetails.0.email") ?? undefined;
    } else if (accountType === 'ORG') {
      email = form.getValues("customer.organization.associatedEntities.associatedIndividuals.0.email") ?? undefined;
    }

    if (email) {
      form.setValue("customer.email", email);
    }
  }, [accountType, form]);

  // Ensure employer address structure exists for existing data
  useEffect(() => {
    const paths = [
      "customer.accountHolder.accountHolderDetails.0",
      "customer.jointHolders.firstHolderDetails.0",
      "customer.jointHolders.secondHolderDetails.0",
      "customer.organization.associatedEntities.associatedIndividuals.0"
    ];

    paths.forEach(path => {
      const type = form.getValues(`${path}.employmentType` as any);
      if (['EMPLOYED', 'SELFEMPLOYED'].includes(type)) {
         const address = form.getValues(`${path}.employmentDetails.employerAddress` as any);
         if (!address) {
             form.setValue(`${path}.employmentDetails.employerAddress` as any, {
                country: null,
                street1: null,
                street2: null,
                city: null,
                state: null,
                postalCode: null
             }, { shouldValidate: false, shouldDirty: true });
         }
      }
    });
  }, [form]);

  const renderAddressFields = (basePath: string) => (
    <>
      <FormField
        control={form.control}
        name={`${basePath}.street1` as any}
        render={({ field }) => (
          <FormItem>
            <div className='flex flex-row gap-2 items-center'>
              <FormLabel>{t('apply.account.account_holder_info.street_address_1')}</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${basePath}.street2` as any}
        render={({ field }) => (
          <FormItem>
            <div className='flex flex-row gap-2 items-center'>
              <FormLabel>{t('apply.account.account_holder_info.street_address_2')}</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CountriesFormField
          form={form}
          element={{
            name: `${basePath}.country`,
            title: t('apply.account.account_holder_info.country')
          }}
        />
        {/* Country subdivisions selector */}
        <StatesFormField
          form={form}
          country={form.watch(`${basePath}.country` as any) as string | undefined}
          stateFieldName={`${basePath}.state`}
          label={t('apply.account.account_holder_info.state')}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
          control={form.control}
          name={`${basePath}.city` as any}
          render={({ field }) => (
            <FormItem>
              <div className='flex flex-row gap-2 items-center'>
                <FormLabel>{t('apply.account.account_holder_info.city')}</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePath}.postalCode` as any}
          render={({ field }) => (
            <FormItem>
              <div className='flex flex-row gap-2 items-center'> 
                <FormLabel>{t('apply.account.account_holder_info.zip')}</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </>
  );

  const renderOrganizationFields = () => (
    <Card className="p-6 space-y-6">
      <CardHeader>
        <CardTitle>{t('apply.account.account_holder_info.organization_information')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
      <FormField
        control={form.control}
        name={`customer.organization.identifications.0.name` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('apply.account.account_holder_info.organization_name')}</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`customer.organization.identifications.0.businessDescription` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('apply.account.account_holder_info.business_description')}</FormLabel>
            <FormControl>
              <Textarea placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`customer.organization.identifications.0.identification` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('apply.account.account_holder_info.organization_identification_number')}</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`customer.organization.accountSupport.ownersResideUS` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('apply.account.account_holder_info.owners_reside_in_us')}</FormLabel>
            <Select onValueChange={(val)=>field.onChange(val==='true')} defaultValue={field.value?.toString() ?? null}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="true">{t('apply.account.account_holder_info.yes')}</SelectItem>
                <SelectItem value="false">{t('apply.account.account_holder_info.no')}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <h4 className="text-lg font-semibold pt-4">{t('apply.account.account_holder_info.place_of_business_address')}</h4>
      {renderAddressFields('customer.organization.identifications.0.placeOfBusinessAddress')}
      </CardContent>
    </Card>
  );

  const renderAccountHolderFields = (basePath: string, title: string) => {

    const idTypeValue = form.watch(`${basePath}.identificationType` as any)
    const idFieldMapping: Record<string, string> = {
      Passport: 'passport',
      'Driver License': 'driversLicense',
      'National ID Card': 'nationalCard',
    }
    const idNumberField = `${basePath}.identification.${idFieldMapping[idTypeValue] || 'passport'}` as any

    const selectedEmployerBusiness = form.watch(`${basePath}.employmentDetails.employerBusiness` as any);
    const selectedOccupation = form.watch(`${basePath}.employmentDetails.occupation` as any);
    
    // Get unique businesses
    const uniqueBusinesses = Array.from(new Set(businessAndOccupations.map(b => b.employerBusiness))).sort();
    
    // Get occupations for selected business
    const availableOccupations = businessAndOccupations
      .filter(b => b.employerBusiness === selectedEmployerBusiness)
      .map(b => b.occupation)
      .sort();

    // Sync descriptions to description field
    useEffect(() => {
        if (selectedEmployerBusiness === 'Other' || selectedOccupation === 'Other') {
            const businessDesc = form.getValues(`${basePath}.employmentDetails.businessDescription` as any) || '';
            const occupationDesc = form.getValues(`${basePath}.employmentDetails.occupationDescription` as any) || '';
            
            let description = '';
            if (selectedEmployerBusiness === 'Other' && businessDesc) {
                description += `business: ${businessDesc} `;
            }
            if (selectedOccupation === 'Other' && occupationDesc) {
                description += `occupation: ${occupationDesc}`;
            }
            form.setValue(`${basePath}.employmentDetails.description` as any, description.trim(), { shouldValidate: false });
        } else {
            form.setValue(`${basePath}.employmentDetails.description` as any, null, { shouldValidate: false });
        }
    }, [selectedEmployerBusiness, selectedOccupation, form.watch(`${basePath}.employmentDetails.businessDescription` as any), form.watch(`${basePath}.employmentDetails.occupationDescription` as any)]);

    return (
    <Card className="p-6 space-y-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">

        <h4 className="text-lg font-semibold">Personal Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`${basePath}.name.first` as any}
            render={({ field }) => (
              <FormItem>
                <div className='flex flex-row gap-2 items-center'>
                  <FormLabel>{t('apply.account.account_holder_info.first_name')}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${basePath}.name.last` as any}
            render={({ field }) => (
              <FormItem>
                <div className='flex flex-row gap-2 items-center'>
                  <FormLabel>{t('apply.account.account_holder_info.last_name')}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name={`${basePath}.email` as any}
          render={({ field }) => (
            <FormItem>
              <div className='flex flex-row gap-2 items-center'>
                <FormLabel>{t('apply.account.account_holder_info.email')}</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input type="email" placeholder="" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`${basePath}.dateOfBirth` as any}
            render={({ field }) => (
              <FormItem>
                <div className='flex flex-row gap-2 items-center'>
                  <FormLabel>{t('apply.account.account_holder_info.date_of_birth')}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <DateTimePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) =>
                      field.onChange(date ? formatDateFns(date, "yyyy-MM-dd") : "")
                    }
                    granularity="day"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <CountriesFormField
            form={form}
            element={{
              name: `${basePath}.countryOfBirth`,
              title: t('apply.account.account_holder_info.country_of_birth')
            }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`${basePath}.maritalStatus` as any}
            render={({ field }) => (
              <FormItem>
                <div className='flex flex-row gap-2 items-center'>
                  <FormLabel>{t('apply.account.account_holder_info.marital_status')}</FormLabel>
                  <FormMessage />
                </div>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {marital_status(t).map((option: { value: string; label: string }) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${basePath}.numDependents` as any}
            render={({ field }) => (
              <FormItem>
                <div className='flex flex-row gap-2 items-center'>
                  <FormLabel>{t('apply.account.account_holder_info.num_dependents')}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input 
                    placeholder="" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseInt(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <h4 className="text-lg font-semibold pt-4">{t('apply.account.account_holder_info.residence_address')}</h4>
        {renderAddressFields(`${basePath}.residenceAddress`)}
        <FormField
          control={form.control}
          name={`${basePath}.sameMailAddress` as any}
          render={({ field }) => (
            <FormItem>
              <div className='flex flex-row gap-2 items-center'>
                <FormLabel>{t('apply.account.account_holder_info.same_mailing_address')}</FormLabel>
                <FormMessage />
              </div>
              <Select
                onValueChange={(val) => {
                  const boolVal = val === 'true';
                  field.onChange(boolVal);
                  if (boolVal) {
                    const residenceAddr = form.getValues(`${basePath}.residenceAddress` as any);
                    form.setValue(`${basePath}.mailingAddress` as any, residenceAddr);
                  }
                }}
                defaultValue={field.value?.toString() ?? null}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">{t('apply.account.account_holder_info.yes')}</SelectItem>
                  <SelectItem value="false">{t('apply.account.account_holder_info.no')}</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {form.watch(`${basePath}.sameMailAddress` as any) === false && (
          <>
            <h4 className="text-lg font-semibold pt-4">{t('apply.account.account_holder_info.mailing_address')}</h4>
            {renderAddressFields(`${basePath}.mailingAddress`)}
          </>
        )}

        <h4 className="text-lg font-semibold pt-4">{t('apply.account.account_holder_info.contact_information')}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name={`${basePath}.phones.0.type` as any}
            render={({ field }) => (
              <FormItem>
                <div className='flex flex-row gap-2 items-center'>
                  <FormLabel>{t('apply.account.account_holder_info.phone_type')}</FormLabel>
                  <FormMessage />
                </div>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {phone_types(t).map((option: { value: string; label: string }) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <CountriesFormField
            form={form}
            element={{
              name: `${basePath}.phones.0.country`,
              title: t('apply.account.account_holder_info.phone_country')
            }}
          />
          <FormField
            control={form.control}
            name={`${basePath}.phones.0.number` as any}
            render={({ field }) => (
              <FormItem>
                <div className='flex flex-row gap-2 items-center'>
                  <FormLabel>{t('apply.account.account_holder_info.phone_number')}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <h4 className="text-lg font-semibold pt-4">{t('apply.account.account_holder_info.identification')}</h4>
        <FormField
          control={form.control}
          name={`${basePath}.identificationType` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('apply.account.account_holder_info.id_type')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {id_type(t).map((option: { value: string; label: string }) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {/* Dynamic ID Number field */}
          <FormField
            key={idNumberField}
            control={form.control}
            name={idNumberField}
            render={({ field }) => (
              <FormItem>
                <div className='flex flex-row gap-2 items-center'>
                  <FormLabel>{t('apply.account.account_holder_info.id_number')}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Expiration Date */}
          <FormField
            control={form.control}
            name={`${basePath}.identification.expirationDate` as any}
            render={({ field }) => (
              <FormItem>
                <div className='flex flex-row gap-2 items-center'>
                  <FormLabel>{t('apply.account.account_holder_info.expiration_date')}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <DateTimePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) =>
                      field.onChange(date ? formatDateFns(date, "yyyy-MM-dd") : "")
                    }
                    granularity="day"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CountriesFormField
            form={form}
            element={{
              name: `${basePath}.identification.issuingCountry`,
              title: t('apply.account.account_holder_info.issuing_country')
            }}
          />
          <CountriesFormField
            form={form}
            element={{
              name: `${basePath}.identification.citizenship`,
              title: t('apply.account.account_holder_info.citizenship')
            }}
          />
        </div>

        <h4 className="text-lg font-semibold pt-4">{t('apply.account.account_holder_info.employment_details')}</h4>
        <FormField
          control={form.control}
          name={`${basePath}.employmentType` as any}
          render={({ field }) => (
            <FormItem>
              <div className='flex flex-row gap-2 items-center'>
                <FormLabel>{t('apply.account.account_holder_info.employment_type')}</FormLabel>
                <FormMessage />
              </div>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employment_status(t).map((type: { value: string; label: string }) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {['EMPLOYED', 'SELFEMPLOYED'].includes(form.watch(`${basePath}.employmentType` as any)) && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`${basePath}.employmentDetails.employer` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('apply.account.account_holder_info.employer')}</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`${basePath}.employmentDetails.employerBusiness` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('apply.account.account_holder_info.employer_business')}</FormLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val);
                        // Clear occupation if invalid for new business
                        const currentOccupation = form.getValues(`${basePath}.employmentDetails.occupation` as any);
                        const isValid = businessAndOccupations.some(b => b.employerBusiness === val && b.occupation === currentOccupation);
                        if (!isValid) {
                            form.setValue(`${basePath}.employmentDetails.occupation` as any, '');
                        }
                      }} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[300px]">
                        {uniqueBusinesses.map((business) => (
                          <SelectItem key={business} value={business}>
                            {business}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`${basePath}.employmentDetails.occupation` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('apply.account.account_holder_info.occupation')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                    disabled={!selectedEmployerBusiness}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px]">
                      {availableOccupations.map((occupation) => (
                        <SelectItem key={occupation} value={occupation}>
                          {occupation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedEmployerBusiness === 'Other' && (
                <FormField
                    control={form.control}
                    name={`${basePath}.employmentDetails.businessDescription` as any}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('apply.account.account_holder_info.business_description_comment') || 'Business Description Comment'}</FormLabel>
                            <FormControl>
                                <Input placeholder="Please specify business" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {selectedOccupation === 'Other' && (
                <FormField
                    control={form.control}
                    name={`${basePath}.employmentDetails.occupationDescription` as any}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('apply.account.account_holder_info.occupation_description_comment') || 'Occupation Description Comment'}</FormLabel>
                            <FormControl>
                                <Input placeholder="Please specify occupation" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            <h5 className="text-md font-semibold pt-4">{t('apply.account.account_holder_info.employer_address')}</h5>
            {renderAddressFields(`${basePath}.employmentDetails.employerAddress`)}
          </>
        )}
      </CardContent>
    </Card>
    );
  }

  const updateW8Documents = () => {
    const accountType = form.getValues('customer.type');
    const currentDocs = form.getValues('documents') || [];
    
    // Remove existing W8 forms and rebuild them
    let newDocs = currentDocs.filter((doc: any) => doc.formNumber !== 5001);
    
    // Add W8 forms based on account type with proper signatures
    if (accountType === 'INDIVIDUAL') {
      const holder = form.getValues('customer.accountHolder.accountHolderDetails.0');
      if (holder?.name?.first && holder?.name?.last) {
        const holderName = `${holder.name.first} ${holder.name.last}`;
        newDocs.push(createW8FormDocument(holderName, 'primary'));
      }
    } else if (accountType === 'JOINT') {
      // Only one W8 form for the account, use both holders' names in signedBy and 'joint' as holderId
      const firstHolder = form.getValues('customer.jointHolders.firstHolderDetails.0');
      const secondHolder = form.getValues('customer.jointHolders.secondHolderDetails.0');
      const signedBy = [];
      if (firstHolder?.name?.first && firstHolder?.name?.last) {
        signedBy.push(`${firstHolder.name.first} ${firstHolder.name.last}`);
      }
      if (secondHolder?.name?.first && secondHolder?.name?.last) {
        signedBy.push(`${secondHolder.name.first} ${secondHolder.name.last}`);
      }
      if (signedBy.length > 0) {
        // Pass both names to createW8FormDocument, but override signedBy after creation
        const w8Doc = createW8FormDocument(signedBy[0], 'joint');
        w8Doc.signedBy = signedBy;
        newDocs.push(w8Doc);
      }
    } else if (accountType === 'ORG') {
      const associatedIndividual = form.getValues('customer.organization.associatedEntities.associatedIndividuals.0');
      if (associatedIndividual?.name?.first && associatedIndividual?.name?.last) {
        const holderName = `${associatedIndividual.name.first} ${associatedIndividual.name.last}`;
        newDocs.push(createW8FormDocument(holderName, 'individual-0'));
      }
    }
    
    form.setValue('documents', newDocs);
  };
  
  return (
    <div className="space-y-6">

      <Card className="p-6">
        <CardHeader>
          <CardTitle>{t('apply.account.account_setup.account_setup')}</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="accounts.0.margin"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row gap-2 items-center">
                  <FormLabel>{t('apply.account.account_setup.account_type')}</FormLabel>
                  <FormMessage />
                </div>
                <FormDescription className="text-subtitle">
                  Margin accounts allow trading with borrowed funds and can support short
                  selling, while cash accounts require paying fully for purchases and do
                  not permit borrowing.
                </FormDescription>
                <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {account_types(t).map((option: { value: string; label: string }) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {accountType === 'JOINT' ? (
        <div className="space-y-6">
          {/* Joint Account Type Selection */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>{t('apply.account.account_holder_info.joint_account_type')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="customer.jointHolders.type"
              render={({ field }) => (
                <FormItem>
                  <div className='flex flex-row gap-2 items-center'>
                    <FormLabel>{t('apply.account.account_holder_info.joint_account_type')}</FormLabel>
                    <FormMessage />
                  </div>
                  <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="community">{t('apply.account.account_holder_info.community_property')}</SelectItem>
                      <SelectItem value="joint_tenants">{t('apply.account.account_holder_info.joint_tenants_with_rights_of_survivorship')}</SelectItem>
                      <SelectItem value="tenants_common">{t('apply.account.account_holder_info.tenants_in_common')}</SelectItem>
                      <SelectItem value="tbe">{t('apply.account.account_holder_info.tenants_by_the_entirety')}</SelectItem>
                      <SelectItem value="au_joint_account">{t('apply.account.account_holder_info.au_joint_account')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            </CardContent>
          </Card>

          {/* First Holder */}
          {renderAccountHolderFields("customer.jointHolders.firstHolderDetails.0", t('apply.account.account_holder_info.first_account_holder'))}
          
          {/* Second Holder */}
          {renderAccountHolderFields("customer.jointHolders.secondHolderDetails.0", t('apply.account.account_holder_info.second_account_holder'))}
          
        </div>

      ) : accountType === 'ORG' ? (
        <div className="space-y-6">
          {renderOrganizationFields()}

          {/* Associated Individual (first entry) */}
          {renderAccountHolderFields(
            "customer.organization.associatedEntities.associatedIndividuals.0",
            "Associated Individual Details"
          )}
          
        </div>
      ) : (
        // Individual Account
        <div className="space-y-6">
          {renderAccountHolderFields("customer.accountHolder.accountHolderDetails.0", t('apply.account.account_holder_info.account_holder_information'))}
        </div>
      )}

      {accountType === 'JOINT' && (
        <Card className="p-6 space-y-6">
          <CardHeader>
            <CardTitle>{t('apply.account.account_holder_info.secondary_contact_credentials')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name={"users.1.prefix" as any}
              render={({ field }) => (
                <FormItem>
                  <div className='flex flex-row gap-2 items-center'>
                    <FormLabel>{t('apply.account.account_holder_info.username')}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormDescription>{t('apply.account.account_holder_info.username_description')}</FormDescription>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}
      
      <Card className="p-6 space-y-6">
        <CardHeader>
          <CardTitle>{t('apply.account.account_holder_info.security_questions') || 'Security Questions'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-subtitle">
            {t('apply.account.account_holder_info.security_questions_description') || 'Select three security questions and provide your answers.'}
          </p>
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              {/* Question selector */}
              <Select
                onValueChange={(val) => {
                  setSelectedQA((prev) => {
                    const newQA = { ...prev } as Record<string, string>;
                    // Remove any previous key having this index
                    const keys = Object.keys(newQA);
                    const currentKey = keys[idx];
                    if (currentKey) delete newQA[currentKey];
                    newQA[val] = '';
                    return newQA;
                  });
                }}
                defaultValue={Object.keys(selectedQA)[idx] ?? undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('apply.account.account_holder_info.select_question') || 'Select Question'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {questions.map((q) => (
                    <SelectItem key={q.id} value={q.id} disabled={Object.keys(selectedQA).includes(q.id) && Object.keys(selectedQA)[idx] !== q.id}>
                      {q.question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Answer input */}
              <Input
                placeholder={t('apply.account.account_holder_info.answer_placeholder') || 'Answer'}
                value={selectedQA[Object.keys(selectedQA)[idx]] || ''}
                onChange={(e) => {
                  const key = Object.keys(selectedQA)[idx];
                  if (!key) return;
                  setSelectedQA((prev) => ({ ...prev, [key]: e.target.value }));
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  )

}

export default PersonalInfoStep;
