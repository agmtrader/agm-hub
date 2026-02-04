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
import CountriesFormField from "@/components/misc/CountriesFormField";
import { Application } from "@/lib/entities/application";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { phone_types, id_type, marital_status, employment_status, account_types } from '@/lib/entities/application';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { format as formatDateFns } from "date-fns";
import StatesFormField from "@/components/misc/StatesFormField";
import { BusinessAndOccupation } from '@/lib/entities/account';

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface PersonalInfoStepProps {
  form: UseFormReturn<Application>;
  onSecurityQuestionsChange?: (qa: Record<string, string>) => void;
  businessAndOccupations: BusinessAndOccupation[];
}

const PersonalInfoStep = ({ form, businessAndOccupations }: PersonalInfoStepProps) => {

  const { t } = useTranslationProvider();

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

  // Base Syncing
  const syncDefaults = (path: string, value: unknown) => {
    if (form.getValues(path as any) !== value) {
      form.setValue(path as any, value, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
  };

  const syncIfEmpty = (path: string, value: unknown) => {
    const currentValue = form.getValues(path as any);
    if (currentValue === undefined || currentValue === null || currentValue === "") {
      form.setValue(path as any, value, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
  };

  // External IDs are used to identify the account holder in IBKR, and need to be unique per person. This function sets the unique external IDs for the customer, account, account holders, and users.
  // All accounts have a primary holder, so the external ID for the customer, account, first user and first account holder are the same.
  const syncExternalIds = (
    currentAccountType?: string,
    value?: Application,
    name?: string
  ) => {
    syncIfEmpty("customer.externalId", externalIdRef.current);
    syncIfEmpty("accounts.0.externalId", externalIdRef.current);
    syncIfEmpty("users.0.externalUserId", externalIdRef.current);
    syncIfEmpty("users.0.externalIndividualId", externalIdRef.current);

    if (currentAccountType === "INDIVIDUAL") {
      syncIfEmpty(
        "customer.accountHolder.accountHolderDetails.0.externalId",
        externalIdRef.current
      );
    } else if (currentAccountType === "JOINT") {
      syncIfEmpty(
        "customer.jointHolders.firstHolderDetails.0.externalId",
        externalIdRef.current
      );
      syncIfEmpty(
        "customer.jointHolders.secondHolderDetails.0.externalId",
        secondHolderIdRef.current
      );
      syncIfEmpty("users.1.externalUserId", secondHolderIdRef.current);
      syncIfEmpty("users.1.externalIndividualId", secondHolderIdRef.current);
    } else if (currentAccountType === "ORG") {
      syncIfEmpty(
        "customer.organization.associatedEntities.associatedIndividuals.0.externalId",
        externalIdRef.current
      );
    }

    if (currentAccountType === "JOINT") {
      const firstHolderExternalId = form.getValues(
        "customer.jointHolders.firstHolderDetails.0.externalId"
      );
      if (firstHolderExternalId) {
        syncDefaults("customer.externalId", firstHolderExternalId);
        syncDefaults("accounts.0.externalId", firstHolderExternalId);
      }
    } else {
      if ((form.getValues("users") || []).length > 1) {
        form.setValue("users", (form.getValues("users") as any[]).slice(0, 1));
      }
    }

    if (!name || !name.startsWith("customer.jointHolders")) return;

    const firstId = value?.customer?.jointHolders?.firstHolderDetails?.[0]?.externalId;
    const secondId = value?.customer?.jointHolders?.secondHolderDetails?.[0]?.externalId;

    if (firstId) {
      syncDefaults("users.0.externalUserId", firstId);
      syncDefaults("users.0.externalIndividualId", firstId);
      syncDefaults("customer.externalId", firstId);
      syncDefaults("accounts.0.externalId", firstId);
    }

    if (secondId) {
      syncDefaults("users.1.externalUserId", secondId);
      syncDefaults("users.1.externalIndividualId", secondId);
    }
  };

  // Prefixes are used to identify the account holder in IBKR, and need to be set to all users and the customer.
  const applyPrefixToAccountHolder = (basePath: string) => {
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

  const applyPrefixToSecondHolder = (basePath: string) => {
    const first = (form.getValues(`${basePath}.name.first` as any) || "").trim();
    const last = (form.getValues(`${basePath}.name.last` as any) || "").trim();
    if (!first || !last) return;
    const prefix = `${first.charAt(0)}${last.slice(0, 5)}`.toLowerCase();
    if (!prefix) return;

    if (form.getValues("users.1.prefix" as any) !== prefix) {
      form.setValue("users.1.prefix" as any, prefix, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
  };

  const syncPrefixes = (
    currentAccountType?: string,
    value?: Application,
    name?: string
  ) => {
    const customerPrefix = value?.customer?.prefix ?? form.getValues("customer.prefix") ?? "";
    if (customerPrefix) {
      syncIfEmpty("users.0.prefix", customerPrefix);
      if (currentAccountType === "JOINT") {
        syncIfEmpty("users.1.prefix", customerPrefix);
      }
    }

    if (!name) return;

    if (name === "customer.prefix") {
      if (customerPrefix) {
        syncDefaults("users.0.prefix", customerPrefix);
        if (currentAccountType === "JOINT") {
          syncIfEmpty("users.1.prefix", customerPrefix);
        }
      }
      return;
    }

    if (currentAccountType === "INDIVIDUAL") {
      if (
        name.includes("customer.accountHolder.accountHolderDetails.0.name.first") ||
        name.includes("customer.accountHolder.accountHolderDetails.0.name.last")
      ) {
        applyPrefixToAccountHolder("customer.accountHolder.accountHolderDetails.0");
      }
    } else if (currentAccountType === "JOINT") {
      if (
        name.includes("customer.jointHolders.firstHolderDetails.0.name.first") ||
        name.includes("customer.jointHolders.firstHolderDetails.0.name.last")
      ) {
        applyPrefixToAccountHolder("customer.jointHolders.firstHolderDetails.0");
      }
      if (
        name.includes("customer.jointHolders.secondHolderDetails.0.name.first") ||
        name.includes("customer.jointHolders.secondHolderDetails.0.name.last")
      ) {
        applyPrefixToSecondHolder("customer.jointHolders.secondHolderDetails.0");
      }
    } else if (currentAccountType === "ORG") {
      if (
        name.includes("customer.organization.associatedEntities.associatedIndividuals.0.name.first") ||
        name.includes("customer.organization.associatedEntities.associatedIndividuals.0.name.last")
      ) {
        applyPrefixToAccountHolder(
          "customer.organization.associatedEntities.associatedIndividuals.0"
        );
      }
    }
  };

  // The email is set to the customer and all account holders.
  const syncCustomerEmail = (value: Application, name?: string) => {
    if (
      name !== "customer.accountHolder.accountHolderDetails.0.email" &&
      name !== "customer.jointHolders.firstHolderDetails.0.email" &&
      name !== "customer.organization.associatedEntities.associatedIndividuals.0.email"
    ) {
      return;
    }

    const email =
      name === "customer.accountHolder.accountHolderDetails.0.email"
        ? value.customer?.accountHolder?.accountHolderDetails?.[0]?.email
        : name === "customer.jointHolders.firstHolderDetails.0.email"
          ? value.customer?.jointHolders?.firstHolderDetails?.[0]?.email
          : value.customer?.organization?.associatedEntities?.associatedIndividuals?.[0]?.email;

    if (email) {
      form.setValue("customer.email", email);
    }
  };

  // The ID number is picked with a identificationType which is later removed since IBKR does not ask for it later.
  // This function removes the identificationType and parses it so that it fits the format IBKR requires.
  const syncIdentificationNumber = (name?: string) => {
    if (!name?.endsWith("identificationType")) return;
    const selectedIdType = form.getValues(name as any) as string | undefined;
    const basePath = name.replace(/\.identificationType$/, "");

    const idFieldMapping: Record<string, string> = {
      Passport: "passport",
      "Driver License": "driversLicense",
      "National ID Card": "nationalCard",
    };

    const selectedKey = idFieldMapping[selectedIdType ?? ""] ?? "";
    const currentIdentification = form.getValues(`${basePath}.identification` as any) || {};

    const cleanedIdentification: Record<string, any> = {};
    Object.entries(currentIdentification).forEach(([k, v]) => {
      if (!Object.values(idFieldMapping).includes(k)) {
        cleanedIdentification[k] = v;
      }
    });

    if (selectedKey) {
      const idNumberKeys = Object.values(idFieldMapping);
      let carriedValue = currentIdentification[selectedKey];

      if (!carriedValue) {
        carriedValue = idNumberKeys
          .filter((k) => k !== selectedKey)
          .map((k) => currentIdentification[k])
          .find((v) => v !== undefined && v !== "");
      }

      cleanedIdentification[selectedKey] = carriedValue ?? "";
    }

    form.setValue(`${basePath}.identification` as any, cleanedIdentification);
  };

  // Tax Residencies require the account holder's country and identification number so we auto fill it here.
  const applyTaxResidencyToAccountHolder = ( paths: string[], { syncTin, syncCountry }: { syncTin?: boolean; syncCountry?: boolean } = {}) => {

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
        const identification = form.getValues(`${path}.identification` as any) || {};
        const idNumber = 
          identification.passport ??
          identification.driversLicense ??
          identification.nationalCard ?? ""

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

  const syncTaxResidencies = (
    value: Application,
    name?: string,
    holderPaths: string[] = []
  ) => {
    if (name === "customer.legalResidenceCountry") {
      applyTaxResidencyToAccountHolder(holderPaths, { syncCountry: true });
    }

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
        applyTaxResidencyToAccountHolder(holderPaths, { syncCountry: true });
      }
    }

    if (name?.includes(".identification.")) {
      const targetPath = holderPaths.find((path) =>
        name?.startsWith(`${path}.identification`)
      );
      if (targetPath) {
        applyTaxResidencyToAccountHolder([targetPath], {
          syncTin: true,
          syncCountry: true,
        });
      }
    }

    if (name?.endsWith("identificationType")) {
      const basePath = name.replace(/\.identificationType$/, "");
      if (holderPaths.includes(basePath)) {
        applyTaxResidencyToAccountHolder([basePath], {
          syncTin: true,
          syncCountry: true,
        });
      }
    }

    if (name === "customer.type") {
      applyTaxResidencyToAccountHolder(holderPaths, {
        syncTin: true,
        syncCountry: true,
      });
    }
  };

  // The W8 Form requires the account holder's full name and identification number so we auto fill it here.
  const applyW8BenToAccountHolder = (
    basePath: string,
    firstName?: string,
    lastName?: string,
    tin?: string
  ) => {
    const currentW8Ben = form.getValues(`${basePath}.w8Ben` as any);
    const updatedW8Ben = { ...(currentW8Ben) };

    if (firstName && lastName) {
      updatedW8Ben.name = `${firstName} ${lastName}`;
    }
    if (tin) {
      updatedW8Ben.foreignTaxId = tin;
    }

    form.setValue(`${basePath}.w8Ben` as any, updatedW8Ben);
  };

  const syncW8BenForm = (value: Application, name?: string) => {
    const currentAccountType = value.customer?.type;

    if (currentAccountType === "INDIVIDUAL") {
      if (name?.includes("customer.accountHolder.accountHolderDetails.0.name.first") || name?.includes("customer.accountHolder.accountHolderDetails.0.name.last")) {
        const firstName = value.customer?.accountHolder?.accountHolderDetails?.[0]?.name?.first;
        const lastName = value.customer?.accountHolder?.accountHolderDetails?.[0]?.name?.last;
        applyW8BenToAccountHolder(
          "customer.accountHolder.accountHolderDetails.0",
          firstName ?? undefined,
          lastName ?? undefined
        );
      }
      if (name?.includes("customer.accountHolder.accountHolderDetails.0.taxResidencies.0.tin")) {
        const tin = value.customer?.accountHolder?.accountHolderDetails?.[0]?.taxResidencies?.[0]?.tin;
        applyW8BenToAccountHolder(
          "customer.accountHolder.accountHolderDetails.0",
          undefined,
          undefined,
          tin ?? undefined
        );
      }
    } else if (currentAccountType === "JOINT") {
      if (name?.includes("customer.jointHolders.firstHolderDetails.0.name.first") || name?.includes("customer.jointHolders.firstHolderDetails.0.name.last")) {
        const firstName = value.customer?.jointHolders?.firstHolderDetails?.[0]?.name?.first;
        const lastName = value.customer?.jointHolders?.firstHolderDetails?.[0]?.name?.last;
        applyW8BenToAccountHolder(
          "customer.jointHolders.firstHolderDetails.0",
          firstName ?? undefined,
          lastName ?? undefined
        );
      }
      if (name?.includes("customer.jointHolders.firstHolderDetails.0.taxResidencies.0.tin")) {
        const tin = value.customer?.jointHolders?.firstHolderDetails?.[0]?.taxResidencies?.[0]?.tin;
        applyW8BenToAccountHolder(
          "customer.jointHolders.firstHolderDetails.0",
          undefined,
          undefined,
          tin ?? undefined
        );
      }

      if (
        name?.includes("customer.jointHolders.secondHolderDetails.0.name.first") ||
        name?.includes("customer.jointHolders.secondHolderDetails.0.name.last")
      ) {
        const firstName = value.customer?.jointHolders?.secondHolderDetails?.[0]?.name?.first;
        const lastName = value.customer?.jointHolders?.secondHolderDetails?.[0]?.name?.last;
        applyW8BenToAccountHolder(
          "customer.jointHolders.secondHolderDetails.0",
          firstName ?? undefined,
          lastName ?? undefined
        );
      }
      if (name?.includes("customer.jointHolders.secondHolderDetails.0.taxResidencies.0.tin")) {
        const tin = value.customer?.jointHolders?.secondHolderDetails?.[0]?.taxResidencies?.[0]?.tin;
        applyW8BenToAccountHolder(
          "customer.jointHolders.secondHolderDetails.0",
          undefined,
          undefined,
          tin ?? undefined
        );
      }
    } else if (currentAccountType === "ORG") {
      if (name?.includes("customer.organization.associatedEntities.associatedIndividuals.0.name.first") || name?.includes("customer.organization.associatedEntities.associatedIndividuals.0.name.last")) {
        const firstName = value.customer?.organization?.associatedEntities?.associatedIndividuals?.[0]?.name?.first;
        const lastName = value.customer?.organization?.associatedEntities?.associatedIndividuals?.[0]?.name?.last;
        applyW8BenToAccountHolder(
          "customer.organization.associatedEntities.associatedIndividuals.0",
          firstName ?? undefined,
          lastName ?? undefined
        );
      }
      if (name?.includes("customer.organization.associatedEntities.associatedIndividuals.0.taxResidencies.0.tin")) {
        const tin = value.customer?.organization?.associatedEntities?.associatedIndividuals?.[0]?.taxResidencies?.[0]?.tin;
        applyW8BenToAccountHolder(
          "customer.organization.associatedEntities.associatedIndividuals.0",
          undefined,
          undefined,
          tin ?? undefined
        );
      }
    }

  };

  // When an account holder is employed, we auto fill the source of wealth here because Income is required as a source of wealth for employed account holders.
  const syncSourcesOfWealth = (value: Application, name?: string) => {
    if (!name?.includes("employmentType")) return;
    const currentAccountType = value.customer?.type;
    const employmentType = name.includes("customer.accountHolder.accountHolderDetails.0.employmentType")
      ? value.customer?.accountHolder?.accountHolderDetails?.[0]?.employmentType
      : name.includes("customer.jointHolders.firstHolderDetails.0.employmentType")
        ? value.customer?.jointHolders?.firstHolderDetails?.[0]?.employmentType
        : name.includes("customer.jointHolders.secondHolderDetails.0.employmentType")
          ? value.customer?.jointHolders?.secondHolderDetails?.[0]?.employmentType
          : name.includes("customer.organization.associatedEntities.associatedIndividuals.0.employmentType")
            ? value.customer?.organization?.associatedEntities?.associatedIndividuals?.[0]
                ?.employmentType
            : null;

    if (employmentType === "EMPLOYED") {
      if (currentAccountType === "INDIVIDUAL") {
        form.setValue(
          "customer.accountHolder.financialInformation.0.sourcesOfWealth.0.sourceType",
          "SOW-IND-Income"
        );
      } else if (currentAccountType === "JOINT") {
        form.setValue(
          "customer.jointHolders.financialInformation.0.sourcesOfWealth.0.sourceType",
          "SOW-IND-Income"
        );
      } else if (currentAccountType === "ORG") {
        form.setValue(
          "customer.organization.financialInformation.0.sourcesOfWealth.0.sourceType",
          "SOW-IND-Income"
        );
      }
    }

    if (["EMPLOYED", "SELFEMPLOYED"].includes(employmentType as string)) {
      const employmentDetailsPath = name.replace(/employmentType$/, "employmentDetails");
      const currentDetails = form.getValues(employmentDetailsPath as any);

      if (!currentDetails?.employerAddress) {
        form.setValue(
          `${employmentDetailsPath}.employerAddress` as any,
          {
            country: null,
            street1: null,
            street2: null,
            city: null,
            state: null,
            postalCode: null,
          },
          {
            shouldValidate: false,
            shouldDirty: true,
            shouldTouch: false,
          }
        );
      }
    }

    if (employmentType && employmentType !== "EMPLOYED" && employmentType !== "SELFEMPLOYED") {
      const employmentDetailsPath = name.replace(/employmentType$/, "employmentDetails");
      form.setValue(employmentDetailsPath as any, null, {
        shouldValidate: false,
        shouldDirty: true,
        shouldTouch: false,
      });
    }
  };

  const syncOrganizationBusinessDescription = (value: Application, name?: string) => {
    if (name !== "customer.organization.identifications.0.businessDescription") return;
    const businessDescription =
      value.customer?.organization?.identifications?.[0]?.businessDescription;
    if (businessDescription) {
      form.setValue(
        "customer.organization.accountSupport.businessDescription",
        businessDescription
      );
    }
  };

  const updateW8Documents = () => {
    const accountType = form.getValues('customer.type');
    const currentDocs = form.getValues('documents') || [];
    const existingIndex = currentDocs.findIndex(
      (doc: any) => doc.formNumber === 5001
    );
    if (existingIndex < 0) return;

    const signedBy: string[] = [];
    if (accountType === 'INDIVIDUAL') {
      const holder = form.getValues('customer.accountHolder.accountHolderDetails.0');
      if (holder?.name?.first && holder?.name?.last) {
        signedBy.push(`${holder.name.first} ${holder.name.last}`);
      }
    } else if (accountType === 'JOINT') {
      const firstHolder = form.getValues('customer.jointHolders.firstHolderDetails.0');
      const secondHolder = form.getValues('customer.jointHolders.secondHolderDetails.0');
      if (firstHolder?.name?.first && firstHolder?.name?.last) {
        signedBy.push(`${firstHolder.name.first} ${firstHolder.name.last}`);
      }
      if (secondHolder?.name?.first && secondHolder?.name?.last) {
        signedBy.push(`${secondHolder.name.first} ${secondHolder.name.last}`);
      }
    } else if (accountType === 'ORG') {
      const associatedIndividual = form.getValues(
        'customer.organization.associatedEntities.associatedIndividuals.0'
      );
      if (associatedIndividual?.name?.first && associatedIndividual?.name?.last) {
        signedBy.push(
          `${associatedIndividual.name.first} ${associatedIndividual.name.last}`
        );
      }
    }

    if (!signedBy.length) return;

    const existingDoc = currentDocs[existingIndex] as any;
    const currentSignedBy = existingDoc.signedBy || [];

    // Check if signedBy has actually changed to avoid infinite loops
    const hasChanged = 
      currentSignedBy.length !== signedBy.length ||
      !currentSignedBy.every((val: string, index: number) => val === signedBy[index]);

    if (!hasChanged) return;

    const newDocs = [...currentDocs];
    newDocs[existingIndex] = {
      ...existingDoc,
      signedBy,
    } as any;

    form.setValue('documents', newDocs);
  };

  const syncInvestmentObjectives = (value: Application, name?: string) => {
    if (!name || !name.startsWith("accounts.0.investmentObjectives")) return;
    const invObjectives = (value.accounts?.[0]?.investmentObjectives || []).filter(
      Boolean
    ) as string[];
    const acctType = value.customer?.type;
    if (acctType === "INDIVIDUAL") {
      form.setValue(
        "customer.accountHolder.financialInformation.0.investmentObjectives",
        invObjectives
      );
    } else if (acctType === "JOINT") {
      form.setValue(
        "customer.jointHolders.financialInformation.0.investmentObjectives",
        invObjectives
      );
    } else if (acctType === "ORG") {
      form.setValue(
        "customer.organization.financialInformation.0.investmentObjectives",
        invObjectives
      );
    }
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {

      if (name === 'documents' || name?.startsWith('documents.')) return;

      const currentAccountType = value.customer?.type;
      const holderPaths = taxResidencyPathsByType[currentAccountType ?? ""] ?? [];

      // Account Type Changes
      syncExternalIds(currentAccountType, value as Application, name);
      syncPrefixes(currentAccountType, value as Application, name);

      // Application Wide Changes
      syncCustomerEmail(value as Application, name);
      syncIdentificationNumber(name);
      syncTaxResidencies(value as Application, name, holderPaths);
      syncW8BenForm(value as Application, name);
      syncSourcesOfWealth(value as Application, name);
      syncOrganizationBusinessDescription(value as Application, name);

      updateW8Documents();

    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Manual validation for Identification fields (Type and Number)
  useEffect(() => {
    const validateIdentities = () => {
      const type = form.getValues("customer.type");
      const paths: string[] = [];

      if (type === "INDIVIDUAL") {
        paths.push("customer.accountHolder.accountHolderDetails.0");
      } else if (type === "JOINT") {
        paths.push("customer.jointHolders.firstHolderDetails.0");
        paths.push("customer.jointHolders.secondHolderDetails.0");
      } else if (type === "ORG") {
        paths.push("customer.organization.associatedEntities.associatedIndividuals.0");
      }

      const idFieldMapping: Record<string, string> = {
        Passport: 'passport',
        'Driver License': 'driversLicense',
        'National ID Card': 'nationalCard',
      };

      paths.forEach((basePath) => {
        const idTypePath = `${basePath}.identificationType` as any;
        const idType = form.getValues(idTypePath) as string | undefined;

        // Validate Identification Type
        if (!idType) {
          form.setError(idTypePath, {
            type: "manual",
            message: "Required",
          });
        } else {
          const currentError = form.getFieldState(idTypePath).error;
          if (currentError?.type === "manual") {
            form.clearErrors(idTypePath);
          }

          // Validate Identification Number
          const mappedField = idFieldMapping[idType];
          if (mappedField) {
            const idNumberPath = `${basePath}.identification.${mappedField}` as any;
            const idNumber = form.getValues(idNumberPath);

            if (!idNumber) {
              form.setError(idNumberPath, {
                type: "manual",
                message: "Required",
              });
            } else {
              const currentIdError = form.getFieldState(idNumberPath).error;
              if (currentIdError?.type === "manual") {
                form.clearErrors(idNumberPath);
              }
            }
          }
        }
      });
    };

    const subscription = form.watch(() => {
      validateIdentities();
    });

    validateIdentities();

    return () => subscription.unsubscribe();
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
            <div className='flex flex-row gap-2 items-center'>
              <FormLabel>{t('apply.account.account_holder_info.organization_name')}</FormLabel>
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
        name={`customer.organization.identifications.0.businessDescription` as any}
        render={({ field }) => (
          <FormItem>
            <div className='flex flex-row gap-2 items-center'>
            <FormLabel>{t('apply.account.account_holder_info.business_description')}</FormLabel>
            <FormMessage />
            </div>
            <FormControl>
              <Textarea placeholder="" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`customer.organization.identifications.0.identification` as any}
        render={({ field }) => (
          <FormItem>
            <div className='flex flex-row gap-2 items-center'>
              <FormLabel>{t('apply.account.account_holder_info.organization_identification_number')}</FormLabel>
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
        name={`customer.organization.accountSupport.ownersResideUS` as any}
        render={({ field }) => (
          <FormItem>
            <div className='flex flex-row gap-2 items-center'>
              <FormLabel>{t('apply.account.account_holder_info.owners_reside_in_us')}</FormLabel>
              <FormMessage />
            </div>
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
    const employmentType = form.watch(`${basePath}.employmentType` as any);
    const selectedOccupation = form.watch(`${basePath}.employmentDetails.occupation` as any);
    
    // Get unique businesses
    const uniqueBusinesses = Array.from(new Set(businessAndOccupations.map(b => b.employerBusiness))).sort();
    const businessOptions = businessAndOccupations.length ? uniqueBusinesses : ["Other"];
    
    // Get occupations for selected business
    const availableOccupations = businessAndOccupations
      .filter(b => b.employerBusiness === selectedEmployerBusiness)
      .map(b => b.occupation)
      .sort();
    const occupationOptions = availableOccupations.length ? availableOccupations : ["Other"];

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
              <div className='flex flex-row gap-2 items-center'> 
                <FormLabel>{t('apply.account.account_holder_info.id_type')}</FormLabel>
                <FormMessage />
              </div>
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
                        {businessOptions.map((business) => (
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
                      {occupationOptions.map((occupation) => (
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

            {(employmentType === 'SELFEMPLOYED') && (
                <FormField
                    control={form.control}
                    name={`${basePath}.employmentDetails.businessDescription` as any}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('apply.account.account_holder_info.business_description')}</FormLabel>
                            <p className="text-sm text-subtitle">{t('apply.account.account_holder_info.business_description_comment')}</p>
                            <FormMessage />
                            <FormControl>
                                <Textarea 
                                    placeholder={''} 
                                    {...field} 
                                />
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
                            <FormLabel>{t('apply.account.account_holder_info.occupation_description')}</FormLabel>
                            <p className="text-sm text-subtitle">{t('apply.account.account_holder_info.occupation_description_comment')}</p>
                            <FormControl>
                                <Textarea placeholder={''} {...field} />
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
  
  return (
    <div className="space-y-6">

      <Card className="p-6">
        <CardHeader>
          <CardTitle>{t('apply.account.account_holder_info.account_setup')}</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="accounts.0.margin"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row gap-2 items-center">
                  <FormLabel>{t('apply.account.account_holder_info.account_type')}</FormLabel>
                  <FormMessage />
                </div>
                <FormDescription className="text-subtitle">
                  {t('apply.account.account_holder_info.margin_account_description')}
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


    </div>
  )

}

export default PersonalInfoStep;
