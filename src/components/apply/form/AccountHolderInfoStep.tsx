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
            <FormLabel>{t('apply.account.account_holder_info.street_address_1')}</FormLabel>
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
            <FormLabel>{t('apply.account.account_holder_info.street_address_2')}</FormLabel>
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
              <FormLabel>{t('apply.account.account_holder_info.city')}</FormLabel>
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
              <FormLabel>{t('apply.account.account_holder_info.state')}</FormLabel>
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
              <FormLabel>{t('apply.account.account_holder_info.zip')}</FormLabel>
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
            title: t('apply.account.account_holder_info.country')
          }}
        />
      </div>
    </>
  );

  // Financial Information Section
  const renderFinancialInformation = (basePath: string) => (
    <Card className="p-6 space-y-6">
      <CardHeader>
        <CardTitle>{t('apply.account.account_holder_info.financial_information')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
      
      {/* Net Worth */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.0.netWorth` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('apply.account.account_holder_info.net_worth')}</FormLabel>
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
              <FormLabel>{t('apply.account.account_holder_info.liquid_net_worth')}</FormLabel>
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
              <FormLabel>{t('apply.account.account_holder_info.annual_net_income')}</FormLabel>
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
            <FormLabel>{t('apply.account.account_holder_info.investment_objectives')}</FormLabel>
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
                <span className="text-subtitle text-sm">{t('apply.account.account_holder_info.investment_objectives_description')}</span>
              )}
            </div>
          </FormItem>
        )}
      />

      {/* Investment Experience */}
      <h4 className="text-lg font-semibold">{t('apply.account.account_holder_info.investment_experience')}</h4>
      <InvestmentExperienceFields basePath={basePath} />

      {/* Source of Wealth */}
      <h4 className="text-lg font-semibold">{t('apply.account.account_holder_info.source_of_wealth')}</h4>
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
                      <FormLabel>{t('apply.account.account_holder_info.source_type')}</FormLabel>
                      <FormDescription>
                        If employment type is "Employed", include "Income" as one of your sources.
                      </FormDescription>
                    </>
                  )}
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
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
                  {index === 0 && <FormLabel>{t('apply.account.account_holder_info.percentage')}</FormLabel>}
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
          <Plus className="h-4 w-4 mr-2" /> {t('apply.account.account_holder_info.add_source')}
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
                  {index === 0 && <FormLabel>{t('apply.account.account_holder_info.asset_class')}</FormLabel>}
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
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
                  {index === 0 && <FormLabel>{t('apply.account.account_holder_info.years_trading')}</FormLabel>}
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
                  {index === 0 && <FormLabel>{t('apply.account.account_holder_info.trades_per_year')}</FormLabel>}
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
                  {index === 0 && <FormLabel>{t('apply.account.account_holder_info.knowledge_level')}</FormLabel>}
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
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
          <Plus className="h-4 w-4 mr-2" /> {t('apply.account.account_holder_info.add_experience')}
        </Button>
      </div>
    );
  };

  // Account Information Section
  const renderAccountInformation = () => (
    <Card className="p-6 space-y-6">
      <CardHeader>
        <CardTitle>{t('apply.account.account_holder_info.account_setup')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="accounts.0.baseCurrency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('apply.account.account_holder_info.base_currency')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USD">{t('apply.account.account_holder_info.usd')}</SelectItem>
                  <SelectItem value="EUR">{t('apply.account.account_holder_info.eur')}</SelectItem>
                  <SelectItem value="GBP">{t('apply.account.account_holder_info.gbp')}</SelectItem>
                  <SelectItem value="CAD">{t('apply.account.account_holder_info.cad')}</SelectItem>
                  <SelectItem value="AUD">{t('apply.account.account_holder_info.aud')}</SelectItem>
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
              <FormLabel>{t('apply.account.account_holder_info.account_type')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Cash">{t('apply.account.account_holder_info.cash_account')}</SelectItem>
                  <SelectItem value="Margin">{t('apply.account.account_holder_info.margin_account')}</SelectItem>
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
            <FormLabel>{t('apply.account.account_holder_info.investment_objectives')}</FormLabel>
            <FormDescription>{t('apply.account.account_holder_info.investment_objectives_description')}</FormDescription>
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
      <h4 className="text-lg font-semibold">{t('apply.account.account_holder_info.trading_permissions')}</h4>
      <p className="text-subtitle text-sm mb-4">
        {t('apply.account.account_holder_info.trading_permissions_description')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="accounts.0.tradingPermissions.0.country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('apply.account.account_holder_info.primary_trading_market')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="UNITED STATES">{t('apply.account.account_holder_info.united_states')}</SelectItem>
                  <SelectItem value="CANADA">{t('apply.account.account_holder_info.canada')}</SelectItem>
                  <SelectItem value="UNITED KINGDOM">{t('apply.account.account_holder_info.united_kingdom')}</SelectItem>
                  <SelectItem value="GERMANY">{t('apply.account.account_holder_info.germany')}</SelectItem>
                  <SelectItem value="JAPAN">{t('apply.account.account_holder_info.japan')}</SelectItem>
                  <SelectItem value="AUSTRALIA">{t('apply.account.account_holder_info.australia')}</SelectItem>
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
              <FormLabel>{t('apply.account.account_holder_info.product_types')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
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

      {/* Date of Birth and Country of Birth */}
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

      {/* Personal Details */}
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

      {/* ID Type Selection */}
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

      <h4 className="text-lg font-semibold pt-4">{t('apply.account.account_holder_info.tax_residencies')}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CountriesFormField
          form={form}
          element={{
            name: `${basePath}.taxResidencies.0.country`,
            title: t('apply.account.account_holder_info.tax_residence_country')
          }}
        />
        <FormField
          control={form.control}
          name={`${basePath}.taxResidencies.0.tin` as any}
          render={({ field }) => (
            <FormItem>
              <div className='flex flex-row gap-2 items-center'>
                <FormLabel>{t('apply.account.account_holder_info.tax_identification_number')}</FormLabel>
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
                <FormLabel>{t('apply.account.account_holder_info.tin_type')}</FormLabel>
                <FormMessage />
              </div>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SSN">{t('apply.account.account_holder_info.ssn')}</SelectItem>
                  <SelectItem value="EIN">{t('apply.account.account_holder_info.ein')}</SelectItem>
                  <SelectItem value="NonUS_NationalId">{t('apply.account.account_holder_info.non_us_national_id')}</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
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
            <FormDescription>
              <strong>{t('apply.account.account_holder_info.important')}</strong> {t('apply.account.account_holder_info.employment_type_description')}
            </FormDescription>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="" />
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
          name={`${basePath}.employmentDetails.occupation` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('apply.account.account_holder_info.occupation')}</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
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
            <FormLabel>{t('apply.account.account_holder_info.employer_business')}</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <h5 className="text-md font-semibold pt-4">{t('apply.account.account_holder_info.employer_address')}</h5>
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
          <CardTitle>{t('apply.account.account_holder_info.primary_contact_credentials')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name={"customer.prefix" as any}
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
        <CountriesFormField
          form={form}
          element={{
            name: "customer.legalResidenceCountry",
            title: t('apply.account.account_holder_info.legal_residence_country')
          }}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          {renderAccountHolderFields("customer.accountHolder.accountHolderDetails.0", t('apply.account.account_holder_info.account_holder_information'))}
          {renderFinancialInformation("customer.accountHolder.financialInformation")}
        </div>
      )}

      {/* Account Information - Required for all account types */}
      {renderAccountInformation()}
    </div>
  );
};

export default AccountHolderInfoStep;
