import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useFieldArray } from "react-hook-form";
import CountriesFormField from "@/components/ui/CountriesFormField";
import { Application } from "@/lib/entities/application";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { phone_types as getPhoneTypes, id_type as getIdTypes, investment_objectives as getInvestmentObjectives, products_complete as getProductsComplete, source_of_wealth as getSourceOfWealth, marital_status as getMaritalStatus, asset_classes, knowledge_levels } from '@/lib/public/form';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { createW8FormDocument } from '@/utils/form';
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { format as formatDateFns } from "date-fns";
import { Trash2, Plus } from "lucide-react";

interface AccountHolderInfoStepProps {
  form: UseFormReturn<Application>;
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};


const AccountHolderInfoStep = ({ form }: AccountHolderInfoStepProps) => {

  const { t } = useTranslationProvider();
  const phoneTypeOptions = getPhoneTypes(t);
  const idTypeOptions = getIdTypes(t);
  const investmentObjectivesOptions = getInvestmentObjectives(t);
  const productsCompleteOptions = getProductsComplete(t);
  const sourceOfWealthOptions = getSourceOfWealth(t);
  const maritalStatusOptions = getMaritalStatus(t);

  const accountType = form.watch("customer.type");

  // ensure multiCurrency is always true
  React.useEffect(() => {
    form.setValue("accounts.0.multiCurrency", true, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [form]);
  
  // Generate external IDs if not already set
  const externalIdRef = React.useRef<string>(generateUUID())
  React.useEffect(() => {
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
        form.setValue("customer.jointHolders.secondHolderDetails.0.externalId", externalIdRef.current);
      }
    }

    // Generate account external ID
    const accountExternalId = form.getValues("accounts.0.externalId");
    if (!accountExternalId) {
      form.setValue("accounts.0.externalId", externalIdRef.current);
    }

    // Generate user external IDs
    const userExternalId = form.getValues("users.0.externalUserId");
    if (!userExternalId) {
      form.setValue("users.0.externalUserId", externalIdRef.current);
    }
    const userIndividualId = form.getValues("users.0.externalIndividualId");
    if (!userIndividualId) {
      form.setValue("users.0.externalIndividualId", externalIdRef.current);
    }
  }, [accountType, form]);

  // Simple function to update W8 documents with proper signatures
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
      const firstHolder = form.getValues('customer.jointHolders.firstHolderDetails.0');
      const secondHolder = form.getValues('customer.jointHolders.secondHolderDetails.0');
      
      if (firstHolder?.name?.first && firstHolder?.name?.last) {
        const holderName = `${firstHolder.name.first} ${firstHolder.name.last}`;
        newDocs.push(createW8FormDocument(holderName, 'first'));
      }
      
      if (secondHolder?.name?.first && secondHolder?.name?.last) {
        const holderName = `${secondHolder.name.first} ${secondHolder.name.last}`;
        newDocs.push(createW8FormDocument(holderName, 'second'));
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

  // Simplified form watchers for essential syncing
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Sync customer prefix with user prefix
      if (name === "customer.prefix") {
        const customerPrefix = value.customer?.prefix;
        if (customerPrefix) {
          form.setValue("users.0.prefix", customerPrefix);
        }
      }

      // Sync customer email with primary holder's email (first holder for joint / associated individual for org)
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
          updateW8BenForm("customer.accountHolder.accountHolderDetails.0", firstName, lastName);
        }
        if (name?.includes("customer.accountHolder.accountHolderDetails.0.taxResidencies.0.tin")) {
          const tin = value.customer?.accountHolder?.accountHolderDetails?.[0]?.taxResidencies?.[0]?.tin;
          updateW8BenForm("customer.accountHolder.accountHolderDetails.0", undefined, undefined, tin);
        }
      } else if (accountType === 'JOINT') {
        // First holder
        if (name?.includes("customer.jointHolders.firstHolderDetails.0.name.first") || 
            name?.includes("customer.jointHolders.firstHolderDetails.0.name.last")) {
          const firstName = value.customer?.jointHolders?.firstHolderDetails?.[0]?.name?.first;
          const lastName = value.customer?.jointHolders?.firstHolderDetails?.[0]?.name?.last;
          updateW8BenForm("customer.jointHolders.firstHolderDetails.0", firstName, lastName);
        }
        if (name?.includes("customer.jointHolders.firstHolderDetails.0.taxResidencies.0.tin")) {
          const tin = value.customer?.jointHolders?.firstHolderDetails?.[0]?.taxResidencies?.[0]?.tin;
          updateW8BenForm("customer.jointHolders.firstHolderDetails.0", undefined, undefined, tin);
        }
        
        // Second holder
        if (name?.includes("customer.jointHolders.secondHolderDetails.0.name.first") || 
            name?.includes("customer.jointHolders.secondHolderDetails.0.name.last")) {
          const firstName = value.customer?.jointHolders?.secondHolderDetails?.[0]?.name?.first;
          const lastName = value.customer?.jointHolders?.secondHolderDetails?.[0]?.name?.last;
          updateW8BenForm("customer.jointHolders.secondHolderDetails.0", firstName, lastName);
        }
        if (name?.includes("customer.jointHolders.secondHolderDetails.0.taxResidencies.0.tin")) {
          const tin = value.customer?.jointHolders?.secondHolderDetails?.[0]?.taxResidencies?.[0]?.tin;
          updateW8BenForm("customer.jointHolders.secondHolderDetails.0", undefined, undefined, tin);
        }
      } else if (accountType === 'ORG') {
        if (name?.includes("customer.organization.associatedEntities.associatedIndividuals.0.name.first") || 
            name?.includes("customer.organization.associatedEntities.associatedIndividuals.0.name.last")) {
          const firstName = value.customer?.organization?.associatedEntities?.associatedIndividuals?.[0]?.name?.first;
          const lastName = value.customer?.organization?.associatedEntities?.associatedIndividuals?.[0]?.name?.last;
          updateW8BenForm("customer.organization.associatedEntities.associatedIndividuals.0", firstName, lastName);
        }
        if (name?.includes("customer.organization.associatedEntities.associatedIndividuals.0.taxResidencies.0.tin")) {
          const tin = value.customer?.organization?.associatedEntities?.associatedIndividuals?.[0]?.taxResidencies?.[0]?.tin;
          updateW8BenForm("customer.organization.associatedEntities.associatedIndividuals.0", undefined, undefined, tin);
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

  // Initialize W8 documents when account type changes
  React.useEffect(() => {
    updateW8Documents();
  }, [accountType]);

  // Ensure customer.email is initialized/synced with the appropriate holder email when account type changes
  React.useEffect(() => {
    let email: string | undefined;

    if (accountType === 'INDIVIDUAL') {
      email = form.getValues("customer.accountHolder.accountHolderDetails.0.email");
    } else if (accountType === 'JOINT') {
      email = form.getValues("customer.jointHolders.firstHolderDetails.0.email");
    } else if (accountType === 'ORG') {
      email = form.getValues("customer.organization.associatedEntities.associatedIndividuals.0.email");
    }

    if (email) {
      form.setValue("customer.email", email);
    }
  }, [accountType, form]);

  // Reusable address fields component
  const renderAddressFields = (basePath: string) => (
    <>
      <FormField
        control={form.control}
        name={`${basePath}.street1` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address 1</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${basePath}.street2` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address 2 (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.city` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePath}.state` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>State/Province/Region</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.postalCode` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CountriesFormField
          form={form}
          element={{
            name: `${basePath}.country`,
            title: "Country"
          }}
        />
      </div>
    </>
  );

  // Financial Information Section
  const renderFinancialInformation = (basePath: string) => (
    <Card className="p-6 space-y-6">
      <CardHeader>
        <CardTitle>Financial Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
      
      {/* Net Worth */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.0.netWorth` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Net Worth (USD)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePath}.0.liquidNetWorth` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Liquid Net Worth (USD)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePath}.0.annualNetIncome` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Net Income (USD)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Investment Objectives are selected in the Account Setup section and automatically synced here. */}
      <FormField
        control={form.control}
        name={`${basePath}.0.investmentObjectives` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Investment Objectives</FormLabel>
            <div className="flex flex-wrap gap-2">
              {((field.value as string[]) || []).map((obj) => {
                const label = investmentObjectivesOptions.find((o) => o.id === obj)?.label || obj;
                return (
                  <span key={obj} className="px-2 py-1 rounded bg-muted text-sm">
                    {label}
                  </span>
                );
              })}
              {!(field.value && field.value.length) && (
                <span className="text-subtitle text-sm">(Selections are made in Account Setup)</span>
              )}
            </div>
          </FormItem>
        )}
      />

      {/* Investment Experience */}
      <h4 className="text-lg font-semibold">Investment Experience</h4>
      <InvestmentExperienceFields basePath={basePath} />

      {/* Source of Wealth */}
      <h4 className="text-lg font-semibold">Source of Wealth</h4>
      <SourcesOfWealthFields basePath={basePath} />
      </CardContent>
    </Card>
  );

  // --- Sub-component: dynamic Sources of Wealth list ---
  const SourcesOfWealthFields = ({ basePath }: { basePath: string }) => {
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: `${basePath}.0.sourcesOfWealth` as any,
    });

    return (
      <div className="space-y-4">
        {fields.map((fieldItem, index) => (
          <div key={fieldItem.id} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
            {/* Source Type */}
            <FormField
              control={form.control}
              name={`${basePath}.0.sourcesOfWealth.${index}.sourceType` as any}
              render={({ field }) => (
                <FormItem className="col-span-3">
                  {index === 0 && (
                    <>
                      <FormLabel>Source Type</FormLabel>
                      <FormDescription>
                        If employment type is "Employed", include "Income" as one of your sources.
                      </FormDescription>
                    </>
                  )}
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sourceOfWealthOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Percentage */}
            <FormField
              control={form.control}
              name={`${basePath}.0.sourcesOfWealth.${index}.percentage` as any}
              render={({ field }) => (
                <FormItem>
                  {index === 0 && <FormLabel>Percentage (%)</FormLabel>}
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value === "" ? null : parseInt(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Remove button */}
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ sourceType: "", percentage: 0 })}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Source
        </Button>
      </div>
    );
  };

  // --- Sub-component: dynamic Investment Experience list ---
  const InvestmentExperienceFields = ({ basePath }: { basePath: string }) => {
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: `${basePath}.0.investmentExperience` as any,
    });


    return (
      <div className="space-y-4">
        {fields.map((fieldItem, index) => (
          <div key={fieldItem.id} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
            {/* Asset Class */}
            <FormField
              control={form.control}
              name={`${basePath}.0.investmentExperience.${index}.assetClass` as any}
              render={({ field }) => (
                <FormItem>
                  {index === 0 && <FormLabel>Asset Class</FormLabel>}
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {asset_classes.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Years Trading */}
            <FormField
              control={form.control}
              name={`${basePath}.0.investmentExperience.${index}.yearsTrading` as any}
              render={({ field }) => (
                <FormItem>
                  {index === 0 && <FormLabel>Years Trading</FormLabel>}
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value === "" ? null : parseInt(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Trades per Year */}
            <FormField
              control={form.control}
              name={`${basePath}.0.investmentExperience.${index}.tradesPerYear` as any}
              render={({ field }) => (
                <FormItem>
                  {index === 0 && <FormLabel>Trades / Year</FormLabel>}
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value === "" ? null : parseInt(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Knowledge Level */}
            <FormField
              control={form.control}
              name={`${basePath}.0.investmentExperience.${index}.knowledgeLevel` as any}
              render={({ field }) => (
                <FormItem>
                  {index === 0 && <FormLabel>Knowledge Level</FormLabel>}
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {knowledge_levels.map((lvl) => (
                        <SelectItem key={lvl.value} value={lvl.value}>{lvl.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Remove button */}
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ assetClass: "", yearsTrading: 0, tradesPerYear: 0, knowledgeLevel: "" })}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Experience
        </Button>
      </div>
    );
  };

  // Account Information Section
  const renderAccountInformation = () => (
    <Card className="p-6 space-y-6">
      <CardHeader>
        <CardTitle>Account Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="accounts.0.baseCurrency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Currency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select base currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="accounts.0.margin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Cash">Cash Account</SelectItem>
                  <SelectItem value="Margin">Margin Account</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="accounts.0.investmentObjectives"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Investment Objectives</FormLabel>
            <FormDescription>Select all that apply to this account</FormDescription>
            <div className="flex flex-col space-y-2">
              {investmentObjectivesOptions.map((option) => {
                const checked = (field.value || []).includes(option.id);
                return (
                  <label key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(isChecked) => {
                        let newValue: string[] = Array.isArray(field.value) ? [...field.value] : [];
                        if (isChecked) {
                          if (!newValue.includes(option.id)) newValue.push(option.id);
                        } else {
                          newValue = newValue.filter((v) => v !== option.id);
                        }
                        field.onChange(newValue);
                      }}
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Trading Permissions */}
      <h4 className="text-lg font-semibold">Trading Permissions</h4>
      <p className="text-subtitle text-sm mb-4">
        Specify which markets and products you want permission to trade
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="accounts.0.tradingPermissions.0.country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Trading Market</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select market" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="UNITED STATES">United States</SelectItem>
                  <SelectItem value="CANADA">Canada</SelectItem>
                  <SelectItem value="UNITED KINGDOM">United Kingdom</SelectItem>
                  <SelectItem value="GERMANY">Germany</SelectItem>
                  <SelectItem value="JAPAN">Japan</SelectItem>
                  <SelectItem value="AUSTRALIA">Australia</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="accounts.0.tradingPermissions.0.product"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Types</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select products" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {productsCompleteOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      </CardContent>
    </Card>
  );

  // ORGANIZATION FIELDS
  const renderOrganizationFields = () => (
    <Card className="p-6 space-y-6">
      <CardHeader>
        <CardTitle>Organization Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
      <FormField
        control={form.control}
        name={`customer.organization.identifications.0.name` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Organization Name</FormLabel>
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
            <FormLabel>Business Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Describe your business activities and operations" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`customer.organization.accountSupport.type` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Organization Type</FormLabel>
            <FormControl>
              <Input placeholder="LLC, CORPORATION" {...field} />
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
            <FormLabel>Organization Identification Number</FormLabel>
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
            <FormLabel>Owners Reside in US?</FormLabel>
            <Select onValueChange={(val)=>field.onChange(val==='true')} defaultValue={field.value?.toString() ?? 'false'}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <h4 className="text-lg font-semibold pt-4">Place of Business Address</h4>
      {renderAddressFields('customer.organization.identifications.0.placeOfBusinessAddress')}
      </CardContent>
    </Card>
  );

  // Render form fields for a single account holder
  const renderAccountHolderFields = (basePath: string, title: string) => {
    // Watch the selected ID type to decide which identification field to bind
    const idTypeValue = form.watch(`${basePath}.identificationType` as any)
    const idFieldMapping: Record<string, string> = {
      Passport: 'passport',
      'Driver License': 'driversLicense',
      'National ID Card': 'nationalCard',
    }
    const idNumberField = `${basePath}.identification.${idFieldMapping[idTypeValue] || 'passport'}` as any

    return (
    <Card className="p-6 space-y-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.name.first` as any}
          render={({ field }) => (
            <FormItem>
              <div className='flex flex-row gap-2 items-center'>
                <FormLabel>First Name</FormLabel>
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
                <FormLabel>Last Name</FormLabel>
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
              <FormLabel>Email</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <Input type="email" placeholder="" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Date of Birth and Country of Birth */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.dateOfBirth` as any}
          render={({ field }) => (
            <FormItem>
              <div className='flex flex-row gap-2 items-center'>
                <FormLabel>Date of Birth</FormLabel>
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
            title: "Country of Birth"
          }}
        />
      </div>

      {/* Personal Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.maritalStatus` as any}
          render={({ field }) => (
            <FormItem>
              <div className='flex flex-row gap-2 items-center'>
                <FormLabel>Marital Status</FormLabel>
                <FormMessage />
              </div>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {maritalStatusOptions.map((option: { label: string; value: string }) => (
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
                <FormLabel>Number of Dependents</FormLabel>
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

      <h4 className="text-lg font-semibold pt-4">Residence Address</h4>
      {renderAddressFields(`${basePath}.residenceAddress`)}

      <h4 className="text-lg font-semibold pt-4">Contact Information (Primary Phone)</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.phones.0.type` as any}
          render={({ field }) => (
            <FormItem>
              <div className='flex flex-row gap-2 items-center'>
                <FormLabel>Phone Type</FormLabel>
                <FormMessage />
              </div>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {phoneTypeOptions.map((option: { label: string; value: string }) => (
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
            title: "Phone Country Code"
          }}
        />
        <FormField
          control={form.control}
          name={`${basePath}.phones.0.number` as any}
          render={({ field }) => (
            <FormItem>
              <div className='flex flex-row gap-2 items-center'>
                <FormLabel>Phone Number</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <h4 className="text-lg font-semibold pt-4">Identification</h4>

      {/* ID Type Selection */}
      <FormField
        control={form.control}
        name={`${basePath}.identificationType` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {idTypeOptions.map((option) => (
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
                <FormLabel>ID Number</FormLabel>
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
                <FormLabel>Expiration Date</FormLabel>
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
            title: "Issuing Country"
          }}
        />
        <CountriesFormField
          form={form}
          element={{
            name: `${basePath}.identification.citizenship`,
            title: "Citizenship"
          }}
        />
      </div>

      <h4 className="text-lg font-semibold pt-4">Tax Residencies</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CountriesFormField
          form={form}
          element={{
            name: `${basePath}.taxResidencies.0.country`,
            title: "Tax Residence Country"
          }}
        />
        <FormField
          control={form.control}
          name={`${basePath}.taxResidencies.0.tin` as any}
          render={({ field }) => (
            <FormItem>
              <div className='flex flex-row gap-2 items-center'>
                <FormLabel>Tax Identification Number (TIN)</FormLabel>
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
          name={`${basePath}.taxResidencies.0.tinType` as any}
          render={({ field }) => (
            <FormItem>
              <div className='flex flex-row gap-2 items-center'>
                <FormLabel>TIN Type</FormLabel>
                <FormMessage />
              </div>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select TIN type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SSN">SSN</SelectItem>
                  <SelectItem value="EIN">EIN</SelectItem>
                  <SelectItem value="NonUS_NationalId">Non-US National ID</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>

      <h4 className="text-lg font-semibold pt-4">Employment Details</h4>
      <FormField
        control={form.control}
        name={`${basePath}.employmentType` as any}
        render={({ field }) => (
          <FormItem>
            <div className='flex flex-row gap-2 items-center'>
              <FormLabel>Employment Type</FormLabel>
              <FormMessage />
            </div>
            <FormDescription>
              <strong>Important:</strong> If you select "Employed", you must include "Income" as one of your sources of wealth in the Financial Information section.
            </FormDescription>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {[{ value: 'EMPLOYED', label: 'Employed' }, { value: 'SELF_EMPLOYED', label: 'Self-employed' }, { value: 'UNEMPLOYED', label: 'Unemployed' }, { value: 'STUDENT', label: 'Student' }, { value: 'RETIREE', label: 'Retiree' }, { value: 'OTHER', label: 'Other' }].map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.employmentDetails.employer` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employer</FormLabel>
              <FormControl>
                <Input placeholder="Enter employer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePath}.employmentDetails.occupation` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupation</FormLabel>
              <FormControl>
                <Input placeholder="Enter occupation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name={`${basePath}.employmentDetails.employerBusiness` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employer Business</FormLabel>
            <FormControl>
              <Input placeholder="Enter employer business" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <h5 className="text-md font-semibold pt-4">Employer Address</h5>
      {renderAddressFields(`${basePath}.employmentDetails.employerAddress`)}
      </CardContent>
    </Card>
    );
  }

  return (
    <div className="space-y-6">

      {/* NEW: Primary applicant contact credentials */}
      <Card className="p-6 space-y-6">
        <CardHeader>
          <CardTitle>Primary Contact Credentials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name={"customer.prefix" as any}
          render={({ field }) => (
            <FormItem>
              <div className='flex flex-row gap-2 items-center'>
                <FormLabel>Username</FormLabel>
                <FormMessage />
              </div>
              <FormDescription>Your desired username (3–6 characters).</FormDescription>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <CountriesFormField
          form={form}
          element={{
            name: "customer.legalResidenceCountry",
            title: "Legal Residence Country"
          }}
        />
        </CardContent>
      </Card>

      {accountType === 'JOINT' ? (
        <div className="space-y-6">
          {/* Joint Account Type Selection */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Joint Account Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="customer.jointHolders.type"
              render={({ field }) => (
                <FormItem>
                  <div className='flex flex-row gap-2 items-center'>
                    <FormLabel>Joint Account Type</FormLabel>
                    <FormMessage />
                  </div>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select joint account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="community">Community Property</SelectItem>
                      <SelectItem value="joint_tenants">Joint Tenants with Rights of Survivorship</SelectItem>
                      <SelectItem value="tenants_common">Tenants in Common</SelectItem>
                      <SelectItem value="tbe">Tenants by the Entirety</SelectItem>
                      <SelectItem value="au_joint_account">AU Joint Account</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            </CardContent>
          </Card>

          {/* First Holder */}
          {renderAccountHolderFields("customer.jointHolders.firstHolderDetails.0", "First Account Holder")}
          
          {/* Second Holder */}
          {renderAccountHolderFields("customer.jointHolders.secondHolderDetails.0", "Second Account Holder")}
          
          {/* Financial and Regulatory Information for Joint Account */}
          {renderFinancialInformation("customer.jointHolders.financialInformation")}
        </div>

      ) : accountType === 'ORG' ? (
        <div className="space-y-6">
          {renderOrganizationFields()}

          {/* Associated Individual (first entry) */}
          {renderAccountHolderFields(
            "customer.organization.associatedEntities.associatedIndividuals.0",
            "Associated Individual Details"
          )}
          
          {/* Financial and Regulatory Information for Organization */}
          {renderFinancialInformation("customer.organization.financialInformation")}
        </div>
      ) : (
        // Individual Account
        <div className="space-y-6">
          {renderAccountHolderFields("customer.accountHolder.accountHolderDetails.0", "Account Holder Information")}
          {renderFinancialInformation("customer.accountHolder.financialInformation")}
        </div>
      )}

      {/* Account Information - Required for all account types */}
      {renderAccountInformation()}
    </div>
  );
};

export default AccountHolderInfoStep;
