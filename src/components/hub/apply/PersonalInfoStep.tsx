import React, { useEffect, useRef } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
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
import { Application } from "@/lib/clients/application";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { id_type, marital_status, employment_status, account_types } from '@/lib/clients/application';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { format as formatDateFns } from "date-fns";
import StatesFormField from "@/components/misc/StatesFormField";
import { BusinessAndOccupation } from '@/lib/clients/account';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";

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
  referrer: string | null;
  setReferrer: (value: string | null) => void;
}

const PersonalInfoStep = ({ form, businessAndOccupations, referrer, setReferrer }: PersonalInfoStepProps) => {

  const { t } = useTranslationProvider();

  const externalIdRef = useRef<string>(generateUUID())
  const secondHolderIdRef = useRef<string>(generateUUID())

  const accountType = form.watch("customer.type");
  const associatedIndividualsBasePath = "customer.organization.associatedEntities.associatedIndividuals";
  const beneficialOwnershipBasePath = "customer.organization.beneficialOwnership";
  const hasBeneficialOwners = form.watch(
    `${beneficialOwnershipBasePath}.hasBeneficialOwners` as any
  );

  const defaultW8Ben = {
    localTaxForms: [],
    name: "",
    foreignTaxId: "",
    tinOrExplanationRequired: true,
    part29ACountry: "N/A",
    cert: true,
    signatureType: "Electronic",
    blankForm: true,
    taxFormFile: "Form5001.pdf",
    electronicFormat: true,
  };

  const createAssociatedIndividualDefaults = () => ({
    externalId: generateUUID(),
    name: {
      first: "",
      last: "",
    },
    email: "",
    residenceAddress: {
      street1: "",
      street2: "",
      country: "",
      state: "",
      city: "",
      postalCode: "",
    },
    sameMailAddress: true,
    mailingAddress: null,
    countryOfBirth: "",
    dateOfBirth: "",
    maritalStatus: "",
    numDependents: 0,
    phones: [
      {
        type: "Mobile",
        country: "",
        number: "",
      },
    ],
    identificationType: "Passport",
    identification: {
      issuingCountry: "",
      expirationDate: "",
      citizenship: "",
      passport: "",
    },
    employmentType: "UNEMPLOYED",
    employmentDetails: {
      description: null,
    },
    taxResidencies: [
      {
        country: "",
        tinType: "NonUS_NationalId",
        tin: "",
      },
    ],
    w8Ben: { ...defaultW8Ben },
  });

  const associatedIndividualFields = useFieldArray({
    control: form.control,
    name: associatedIndividualsBasePath as any,
  });

  const beneficialOwnerFields = useFieldArray({
    control: form.control,
    name: `${beneficialOwnershipBasePath}.beneficialOwners` as any,
  });

  const intermediateEntityFields = useFieldArray({
    control: form.control,
    name: `${beneficialOwnershipBasePath}.intermediateEntities` as any,
  });

  const trusteeFields = useFieldArray({
    control: form.control,
    name: `${beneficialOwnershipBasePath}.trustees` as any,
  });

  const getHolderPaths = (currentAccountType?: string, value?: Partial<Application>) => {
    if (currentAccountType === "INDIVIDUAL") {
      return ["customer.accountHolder.accountHolderDetails.0"];
    }

    if (currentAccountType === "JOINT") {
      return [
        "customer.jointHolders.firstHolderDetails.0",
        "customer.jointHolders.secondHolderDetails.0",
      ];
    }

    if (currentAccountType === "ORG") {
      const individuals =
        value?.customer?.organization?.associatedEntities?.associatedIndividuals ??
        form.getValues(associatedIndividualsBasePath as any) ??
        [];
      const count = Math.max(individuals.length, associatedIndividualFields.fields.length, 1);
      return Array.from(
        { length: count },
        (_, index) => `${associatedIndividualsBasePath}.${index}`
      );
    }

    return [];
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
      const associatedIndividuals = value?.customer?.organization?.associatedEntities?.associatedIndividuals ?? [];
      associatedIndividuals.forEach((individual, index) => {
        if (!individual?.externalId) {
          syncIfEmpty(
            `${associatedIndividualsBasePath}.${index}.externalId`,
            index === 0 ? externalIdRef.current : generateUUID()
          );
        }
      });
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
      const associatedIndividualNameMatch = name.match(
        /^customer\.organization\.associatedEntities\.associatedIndividuals\.(\d+)\.name\.(first|last)$/
      );
      if (associatedIndividualNameMatch?.[1] === "0") {
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
      !/^customer\.organization\.associatedEntities\.associatedIndividuals\.0\.email$/.test(name ?? "")
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
      const associatedIndividualMatch = name?.match(
        /^customer\.organization\.associatedEntities\.associatedIndividuals\.(\d+)\.name\.(first|last)$/
      );
      if (associatedIndividualMatch) {
        const index = Number(associatedIndividualMatch[1]);
        const associatedIndividual = value.customer?.organization?.associatedEntities?.associatedIndividuals?.[index];
        applyW8BenToAccountHolder(
          `${associatedIndividualsBasePath}.${index}`,
          associatedIndividual?.name?.first ?? undefined,
          associatedIndividual?.name?.last ?? undefined
        );
      }
      const associatedIndividualTinMatch = name?.match(
        /^customer\.organization\.associatedEntities\.associatedIndividuals\.(\d+)\.taxResidencies\.0\.tin$/
      );
      if (associatedIndividualTinMatch) {
        const index = Number(associatedIndividualTinMatch[1]);
        const tin = value.customer?.organization?.associatedEntities?.associatedIndividuals?.[index]?.taxResidencies?.[0]?.tin;
        applyW8BenToAccountHolder(`${associatedIndividualsBasePath}.${index}`, undefined, undefined, tin ?? undefined);
      }
    }

  };

  const syncPhoneTypes = (holderPaths: string[] = []) => {
    holderPaths.forEach((path) => {
      const phoneTypePath = `${path}.phones.0.type` as any;
      if (form.getValues(phoneTypePath) !== "Mobile") {
        form.setValue(phoneTypePath, "Mobile", {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
      }
    });
  };

  const syncMailingAddresses = (holderPaths: string[] = []) => {
    holderPaths.forEach((path) => {
      const sameMailAddressPath = `${path}.sameMailAddress` as any;
      const mailingAddressPath = `${path}.mailingAddress` as any;

      if (form.getValues(sameMailAddressPath) !== true) {
        form.setValue(sameMailAddressPath, true, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
      }

      if (form.getValues(mailingAddressPath) !== null) {
        form.setValue(mailingAddressPath, null, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
      }

      form.clearErrors([sameMailAddressPath, mailingAddressPath]);
    });
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
          : name.match(/^customer\.organization\.associatedEntities\.associatedIndividuals\.(\d+)\.employmentType$/)
            ? value.customer?.organization?.associatedEntities?.associatedIndividuals?.[
                Number(name.match(/^customer\.organization\.associatedEntities\.associatedIndividuals\.(\d+)\.employmentType$/)?.[1] ?? 0)
              ]?.employmentType
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
      const holderPaths = getHolderPaths(currentAccountType, value as Application);

      // Account Type Changes
      syncExternalIds(currentAccountType, value as Application, name);
      syncPrefixes(currentAccountType, value as Application, name);

      // Application Wide Changes
      syncCustomerEmail(value as Application, name);
      syncIdentificationNumber(name);
      syncTaxResidencies(value as Application, name, holderPaths);
      syncPhoneTypes(holderPaths);
      syncMailingAddresses(holderPaths);
      syncW8BenForm(value as Application, name);
      syncSourcesOfWealth(value as Application, name);
      syncOrganizationBusinessDescription(value as Application, name);

      updateW8Documents();

    });

    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const holderPaths = getHolderPaths(accountType);
    syncPhoneTypes(holderPaths);
    syncMailingAddresses(holderPaths);
  }, [accountType, associatedIndividualFields.fields.length, form]);

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
        paths.push(...getHolderPaths(type));
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

  const renderInstitutionalOwnershipFields = () => (
    <Card className="p-6 space-y-6">
      <CardHeader>
        <CardTitle>Identification of 25% Or Greater Underlying Beneficial Owners</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          This is for each individual, if any, who, directly or indirectly, through any contract,
          arrangement, understanding, relationship or otherwise, owns 25% or more of the equity
          interests of the legal entity listed above.
        </p>

        <FormField
          control={form.control}
          name={`${beneficialOwnershipBasePath}.hasBeneficialOwners` as any}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <div className="flex flex-row gap-2 items-center">
                <FormLabel>Beneficial owner certification</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <RadioGroup
                  value={field.value === undefined || field.value === null ? "" : String(field.value)}
                  onValueChange={(value) => {
                    const nextValue = value === "true";
                    field.onChange(nextValue);

                    if (nextValue && beneficialOwnerFields.fields.length === 0) {
                      beneficialOwnerFields.append({
                        fullName: "",
                        ownershipPercentage: 25,
                        relationship: "",
                      });
                    }

                    if (!nextValue) {
                      form.setValue(`${beneficialOwnershipBasePath}.beneficialOwners` as any, [], {
                        shouldDirty: true,
                        shouldValidate: false,
                      });
                    }
                  }}
                  className="space-y-3"
                >
                  <FormItem className="flex items-start gap-3 rounded-md border p-4">
                    <FormControl>
                      <RadioGroupItem value="true" className="mt-1" />
                    </FormControl>
                    <FormLabel className="font-normal leading-relaxed">
                      Yes, there are one or more persons who are beneficial owners of 25% or more
                      of the equity interests of the legal entity for which the account is being opened.
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-start gap-3 rounded-md border p-4">
                    <FormControl>
                      <RadioGroupItem value="false" className="mt-1" />
                    </FormControl>
                    <FormLabel className="font-normal leading-relaxed">
                      No, I certify that to the best of my knowledge there are no natural persons
                      who own, directly or indirectly, 25% or more of the equity interests of the
                      legal entity for which the account is being opened.
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {hasBeneficialOwners === true && (
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold">Beneficial owners</h4>
              <p className="text-sm text-muted-foreground">
                Provide each individual who directly or indirectly owns 25% or more of any ownership
                interest in the applying entity.
              </p>
            </div>
            {beneficialOwnerFields.fields.map((fieldItem, index) => (
              <div key={fieldItem.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end rounded-md border p-4">
                <FormField
                  control={form.control}
                  name={`${beneficialOwnershipBasePath}.beneficialOwners.${index}.fullName` as any}
                  render={({ field }) => (
                    <FormItem className="sm:col-span-5">
                      <div className="flex flex-row gap-2 items-center">
                        <FormLabel>Full legal name</FormLabel>
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
                  name={`${beneficialOwnershipBasePath}.beneficialOwners.${index}.ownershipPercentage` as any}
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <div className="flex flex-row gap-2 items-center">
                        <FormLabel>Ownership %</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          type="number"
                          min={25}
                          max={100}
                          placeholder=""
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`${beneficialOwnershipBasePath}.beneficialOwners.${index}.relationship` as any}
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel>Relationship or ownership path</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} value={field.value ?? ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="sm:col-span-1"
                  onClick={() => beneficialOwnerFields.remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                beneficialOwnerFields.append({
                  fullName: "",
                  ownershipPercentage: 25,
                  relationship: "",
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add beneficial owner
            </Button>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold">Ownership hierarchy</h4>
            <p className="text-sm text-muted-foreground">
              Use the tool below to describe the ownership structure of the applying entity. Add
              intermediate entities between the applying entity and any 25% or greater beneficial
              owner. If a trust directly or indirectly owns 25% or more of the applying entity, add
              the trustee for the trust below.
            </p>
          </div>

          {intermediateEntityFields.fields.map((fieldItem, index) => (
            <div key={fieldItem.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end rounded-md border p-4">
              <FormField
                control={form.control}
                name={`${beneficialOwnershipBasePath}.intermediateEntities.${index}.entityName` as any}
                render={({ field }) => (
                  <FormItem className="sm:col-span-4">
                    <div className="flex flex-row gap-2 items-center">
                      <FormLabel>Intermediate entity</FormLabel>
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
                name={`${beneficialOwnershipBasePath}.intermediateEntities.${index}.parentEntity` as any}
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Owned by</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} value={field.value ?? ""} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`${beneficialOwnershipBasePath}.intermediateEntities.${index}.ownershipPercentage` as any}
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Ownership %</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        placeholder=""
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`${beneficialOwnershipBasePath}.intermediateEntities.${index}.relationship` as any}
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} value={field.value ?? ""} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="sm:col-span-1"
                onClick={() => intermediateEntityFields.remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              intermediateEntityFields.append({
                entityName: "",
                parentEntity: "",
                ownershipPercentage: null,
                relationship: "",
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add intermediate entity
          </Button>
        </div>

        <div className="space-y-4">
          {trusteeFields.fields.map((fieldItem, index) => (
            <div key={fieldItem.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end rounded-md border p-4">
              <FormField
                control={form.control}
                name={`${beneficialOwnershipBasePath}.trustees.${index}.trustName` as any}
                render={({ field }) => (
                  <FormItem className="sm:col-span-4">
                    <div className="flex flex-row gap-2 items-center">
                      <FormLabel>Trust name</FormLabel>
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
                name={`${beneficialOwnershipBasePath}.trustees.${index}.trusteeName` as any}
                render={({ field }) => (
                  <FormItem className="sm:col-span-4">
                    <div className="flex flex-row gap-2 items-center">
                      <FormLabel>Trustee name</FormLabel>
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
                name={`${beneficialOwnershipBasePath}.trustees.${index}.ownershipPercentage` as any}
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Trust ownership %</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        placeholder=""
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="sm:col-span-1"
                onClick={() => trusteeFields.remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              trusteeFields.append({
                trustName: "",
                trusteeName: "",
                ownershipPercentage: null,
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add trustee
          </Button>
        </div>
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

        <h4 className="text-lg font-semibold pt-4">{t('apply.account.account_holder_info.contact_information')}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="space-y-2 pt-4">
            <Label>{t('apply.account.account_holder_info.referrer')}</Label>
            <Input
              value={referrer ?? ''}
              onChange={(e) => setReferrer(e.target.value === '' ? null : e.target.value)}
              placeholder=""
            />
          </div>
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

          <div className="space-y-4">
            {associatedIndividualFields.fields.map((fieldItem, index) => (
              <div key={fieldItem.id} className="space-y-2">
                {renderAccountHolderFields(
                  `${associatedIndividualsBasePath}.${index}`,
                  index === 0
                    ? "Associated Individual Details"
                    : `Associated Individual ${index + 1} Details`
                )}
                {index > 0 && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => associatedIndividualFields.remove(index)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove associated individual
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => associatedIndividualFields.append(createAssociatedIndividualDefaults())}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add associated individual
            </Button>
          </div>

          {renderInstitutionalOwnershipFields()}
          
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
