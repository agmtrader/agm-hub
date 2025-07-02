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
import CountriesFormField from "@/components/ui/CountriesFormField";
import { Application } from "@/lib/entities/application";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { phone_types as getPhoneTypes, id_type as getIdTypes, investment_objectives as getInvestmentObjectives, products as getProducts, source_of_wealth as getSourceOfWealth, marital_status as getMaritalStatus } from '@/lib/public/form';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { createW8FormDocument } from '@/utils/form';

interface AccountHolderInfoStepProps {
  form: UseFormReturn<Application>;
}

// Generate UUIDv4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Fake data generator for development/testing
const generateFakeData = (accountType: string) => {
  const fakeNames = ['Carlos', 'Maria', 'Jose', 'Ana', 'Luis', 'Sofia', 'Diego', 'Carmen', 'Ricardo', 'Elena'];
  const fakeLastNames = ['Rodriguez', 'Gonzalez', 'Martinez', 'Lopez', 'Hernandez', 'Perez', 'Sanchez', 'Ramirez', 'Torres', 'Flores'];
  const fakeCompanies = ['AGM Technology', 'Costa Rica Tech', 'Central Valley Solutions', 'Pura Vida Systems', 'Pacific Coast Industries'];
  const fakeOccupations = ['Software Engineer', 'Financial Analyst', 'Product Manager', 'Business Consultant', 'Investment Advisor'];
  const fakeCities = ['San Jose', 'Cartago', 'Alajuela', 'Heredia', 'Puntarenas', 'Escazu'];
  const fakeStates = ['CR-SJ', 'CR-C', 'CR-A', 'CR-H', 'CR-P', 'CR-G', 'CR-L'];
  const fakeStreets = ['Valle del Sol', 'Hype Way', 'Avenida Central', 'Calle Real', 'Paseo Colon', 'Avenida Escazu'];
  
  const randomChoice = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomDate = () => {
    const start = new Date(1985, 0, 1);
    const end = new Date(2005, 11, 31);
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  };

  const basePersonData: any = {
    name: {
      first: randomChoice(fakeNames),
      last: randomChoice(fakeLastNames),
      salutation: randomChoice(['Mr.', 'Ms.', 'Mrs.'])
    },
    email: `${randomChoice(fakeNames).toLowerCase()}.${randomChoice(fakeLastNames).toLowerCase()}@example.com`,
    dateOfBirth: randomDate(),
    countryOfBirth: 'CRI',
    maritalStatus: randomChoice(['S', 'M', 'D']),
    numDependents: randomNumber(0, 3),
    residenceAddress: {
      street1: randomChoice(fakeStreets),
      street2: randomNumber(1, 10) > 7 ? `Apartamento ${randomNumber(1, 100)}` : '',
      city: randomChoice(fakeCities),
      state: randomChoice(fakeStates),
      postalCode: '10301',
      country: 'CRI'
    },
    phones: [{
      type: 'Mobile',
      country: 'CRI',
      number: `8${randomNumber(1000000, 9999999)}`
    }],
    identification: {
      passport: `${randomNumber(100000000, 999999999)}`,
      expirationDate: '2030-12-31',
      issuingCountry: 'CRI',
      citizenship: 'CRI'
    },
    taxResidencies: [{
      country: 'CRI',
      tin: `${randomNumber(100000000, 999999999)}`,
      tinType: 'NonUS_NationalId'
    }],
    employmentType: 'EMPLOYED',
    employmentDetails: {
      employer: randomChoice(fakeCompanies),
      occupation: randomChoice(fakeOccupations),
      employerBusiness: randomChoice(['Technology', 'Finance', 'Consulting', 'Manufacturing', 'Services']),
      employerAddress: {
        street1: randomChoice(fakeStreets),
        street2: '',
        city: randomChoice(fakeCities),
        state: randomChoice(fakeStates),
        postalCode: '10301',
        country: 'CRI'
      }
    },
    gender: randomChoice(['M', 'F']),
    sameMailAddress: true,
    titles: [{
      code: "Account Holder",
      value: "Account Holder"
    }]
  };

      // W8 form will be automatically generated with proper signature

  const baseFinancialData = {
    netWorth: randomNumber(50000, 2000000),
    liquidNetWorth: randomNumber(25000, 500000),
    annualNetIncome: randomNumber(30000, 250000),
    investmentExperience: [{
      assetClass: randomChoice(['STK']),
      yearsTrading: randomNumber(1, 15),
      tradesPerYear: randomNumber(5, 200),
      knowledgeLevel: randomChoice(['Limited', 'Good', 'Extensive'])
    }],
    investmentObjectives: [randomChoice(['Growth', 'Trading', 'Income'])],
    sourcesOfWealth: [{
      sourceType: 'SOW-IND-Income', // Always use income for employed people to meet IBKR requirements
      percentage: 100
    }]
  };

  const baseRegulatoryData = {
    regulatoryDetails: [
      {
        code: 'AFFILIATION',
        status: false,
        details: 'Not affiliated with Interactive Brokers'
      },
      {
        code: 'EmployeePubTrade',
        status: false,
        details: 'Employee is not trading publicly'
      },
      {
        code: 'ControlPubTraded',
        status: false,
        details: 'Controlled trading is not allowed'
      }
    ]
  };

  if (accountType === 'INDIVIDUAL') {
    return {
      customer: {
        type: 'INDIVIDUAL',
        email: basePersonData.email,
        prefix: `${basePersonData.name.first.toLowerCase()}${randomNumber(100, 999)}`,
        legalResidenceCountry: 'CRI',
        mdStatusNonPro: true,
        meetAmlStandard: 'true',
        directTradingAccess: true,
        accountHolder: {
          accountHolderDetails: [basePersonData],
          financialInformation: [baseFinancialData],
          regulatoryInformation: [baseRegulatoryData]
        }
      },
      accounts: [{
        baseCurrency: 'USD',
        margin: randomChoice(['Cash', 'Margin']),
        multiCurrency: true,
        alias: 'AGM',
        investmentObjectives: [randomChoice(['Growth', 'Trading', 'Income'])],
        tradingPermissions: [{
          country: 'UNITED STATES',
          product: randomChoice(['STOCKS'])
        }]
      }]
    };
  } else if (accountType === 'JOINT') {
    const secondPerson: any = {
      ...basePersonData,
      name: {
        first: randomChoice(fakeNames),
        last: basePersonData.name.last, // Same last name for joint
        salutation: randomChoice(['Ms.', 'Mrs.'])
      },
      email: `${randomChoice(fakeNames).toLowerCase()}.${basePersonData.name.last.toLowerCase()}@example.com`
    };

    // W8 form will be automatically generated with proper signature

    return {
      customer: {
        type: 'JOINT',
        email: basePersonData.email,
        prefix: `${basePersonData.name.first.toLowerCase()}${randomNumber(100, 999)}`,
        legalResidenceCountry: 'CRI',
        mdStatusNonPro: true,
        meetAmlStandard: 'true',
        directTradingAccess: true,
        jointHolders: {
          type: randomChoice(['joint_tenants', 'tenants_common']),
          firstHolderDetails: [basePersonData],
          secondHolderDetails: [secondPerson],
          financialInformation: [baseFinancialData],
          regulatoryInformation: [baseRegulatoryData]
        }
      },
      accounts: [{
        baseCurrency: 'USD',
        margin: randomChoice(['Cash', 'Margin']),
        multiCurrency: true,
        alias: 'AGM',
        investmentObjectives: [randomChoice(['Growth', 'Trading', 'Income'])],
        tradingPermissions: [{
          country: 'UNITED STATES',
          product: randomChoice(['STOCKS', 'BONDS'])
        }]
      }]
    };
  } else if (accountType === 'ORG') {
    return {
      customer: {
        type: 'ORG',
        email: basePersonData.email,
        prefix: `org${randomNumber(100, 999)}`,
        legalResidenceCountry: 'CRI',
        mdStatusNonPro: true,
        meetAmlStandard: 'true',
        directTradingAccess: true,
        organization: {
          identifications: [{
            name: randomChoice(fakeCompanies),
            businessDescription: 'Technology services and software development',
            identification: `${randomNumber(100000000, 999999999)}`,
            placeOfBusinessAddress: {
              street1: randomChoice(fakeStreets),
              street2: '',
              city: randomChoice(fakeCities),
              state: randomChoice(fakeStates),
              postalCode: '10301',
              country: 'CRI'
            }
          }],
          accountSupport: {
            type: randomChoice(['LLC', 'CORPORATION', 'PARTNERSHIP']),
            businessDescription: 'Technology services and software development',
            ownersResideUS: false
          },
          associatedEntities: {
            associatedIndividuals: [basePersonData]
          },
          financialInformation: [baseFinancialData],
          regulatoryInformation: [baseRegulatoryData]
        }
      },
      accounts: [{
        baseCurrency: 'USD',
        margin: randomChoice(['Cash', 'Margin']),
        multiCurrency: true,
        alias: 'AGM',
        investmentObjectives: [randomChoice(['Growth', 'Trading', 'Income'])],
        tradingPermissions: [{
          country: 'UNITED STATES',
          product: randomChoice(['STOCKS', 'BONDS'])
        }]
      }]
    };
  }

  return {};
};

const AccountHolderInfoStep = ({ form }: AccountHolderInfoStepProps) => {
  const { t } = useTranslationProvider();
  const phoneTypeOptions = getPhoneTypes(t);
  const idTypeOptions = getIdTypes(t);
  const investmentObjectivesOptions = getInvestmentObjectives(t);
  const productsOptions = getProducts(t);
  const sourceOfWealthOptions = getSourceOfWealth(t);
  const maritalStatusOptions = getMaritalStatus(t);

  const accountType = form.watch("customer.type");

  // Function to fill form with fake data
  const fillWithFakeData = () => {
    // Preserve existing W8Ben forms before overwriting with fake data
    let existingW8Ben: any = {};
    if (accountType === 'INDIVIDUAL') {
      existingW8Ben.individual = form.getValues("customer.accountHolder.accountHolderDetails.0.w8Ben");
    } else if (accountType === 'JOINT') {
      existingW8Ben.first = form.getValues("customer.jointHolders.firstHolderDetails.0.w8Ben"); 
      existingW8Ben.second = form.getValues("customer.jointHolders.secondHolderDetails.0.w8Ben");
    } else if (accountType === 'ORG') {
      existingW8Ben.individual = form.getValues("customer.organization.associatedEntities.associatedIndividuals.0.w8Ben");
    }

    const fakeData = generateFakeData(accountType);

    // Populate all form fields with fake data
    Object.entries(fakeData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.setValue(key as any, value);
      }
    });

    // Restore W8Ben forms with preserved defaults
    if (accountType === 'INDIVIDUAL' && existingW8Ben.individual) {
      const holderDetails = form.getValues("customer.accountHolder.accountHolderDetails.0");
      if (holderDetails?.name?.first && holderDetails?.name?.last) {
        const restoredW8Ben = {
          ...existingW8Ben.individual,
          name: `${holderDetails.name.first} ${holderDetails.name.last}`,
          foreignTaxId: holderDetails.taxResidencies?.[0]?.tin || existingW8Ben.individual.foreignTaxId
        };
        form.setValue("customer.accountHolder.accountHolderDetails.0.w8Ben", restoredW8Ben);
      }
    } else if (accountType === 'JOINT') {
      // First holder
      if (existingW8Ben.first) {
        const firstHolder = form.getValues("customer.jointHolders.firstHolderDetails.0");
        if (firstHolder?.name?.first && firstHolder?.name?.last) {
          const restoredW8Ben = {
            ...existingW8Ben.first,
            name: `${firstHolder.name.first} ${firstHolder.name.last}`,
            foreignTaxId: firstHolder.taxResidencies?.[0]?.tin || existingW8Ben.first.foreignTaxId
          };
          form.setValue("customer.jointHolders.firstHolderDetails.0.w8Ben", restoredW8Ben);
        }
      }
      // Second holder  
      if (existingW8Ben.second) {
        const secondHolder = form.getValues("customer.jointHolders.secondHolderDetails.0");
        if (secondHolder?.name?.first && secondHolder?.name?.last) {
          const restoredW8Ben = {
            ...existingW8Ben.second,
            name: `${secondHolder.name.first} ${secondHolder.name.last}`,
            foreignTaxId: secondHolder.taxResidencies?.[0]?.tin || existingW8Ben.second.foreignTaxId
          };
          form.setValue("customer.jointHolders.secondHolderDetails.0.w8Ben", restoredW8Ben);
        }
      }
    } else if (accountType === 'ORG' && existingW8Ben.individual) {
      const associatedIndividual = form.getValues("customer.organization.associatedEntities.associatedIndividuals.0");
      if (associatedIndividual?.name?.first && associatedIndividual?.name?.last) {
        const restoredW8Ben = {
          ...existingW8Ben.individual,
          name: `${associatedIndividual.name.first} ${associatedIndividual.name.last}`,
          foreignTaxId: associatedIndividual.taxResidencies?.[0]?.tin || existingW8Ben.individual.foreignTaxId
        };
        form.setValue("customer.organization.associatedEntities.associatedIndividuals.0.w8Ben", restoredW8Ben);
      }
    }

    // Generate ONE external ID to use everywhere
    const externalId = generateUUID();

    // Set the same external ID everywhere it's needed
    form.setValue("customer.externalId", externalId);
    form.setValue("accounts.0.externalId", externalId);

    // Set account holder external IDs based on type (all using same ID)
    if (accountType === 'INDIVIDUAL') {
      form.setValue("customer.accountHolder.accountHolderDetails.0.externalId", externalId);
    } else if (accountType === 'JOINT') {
      form.setValue("customer.jointHolders.firstHolderDetails.0.externalId", externalId);
      form.setValue("customer.jointHolders.secondHolderDetails.0.externalId", externalId);
    } else if (accountType === 'ORG') {
      form.setValue("customer.organization.associatedEntities.associatedIndividuals.0.externalId", externalId);
    }

    // Set up complete users array (using same external ID)
    const customerPrefix = form.getValues("customer.prefix");
    form.setValue("users", [{
      externalUserId: externalId,
      externalIndividualId: externalId,
      prefix: customerPrefix || `user${Math.floor(Math.random() * 1000)}`
    }]);

    // Force form to re-render with new values
    form.trigger();

    // W8 documents will be automatically updated by the form watchers
  };

  // Generate external IDs if not already set
  React.useEffect(() => {
    const currentCustomerExternalId = form.getValues("customer.externalId");
    if (!currentCustomerExternalId) {
      form.setValue("customer.externalId", generateUUID());
    }

    if (accountType === 'INDIVIDUAL') {
      const currentAccountHolderExternalId = form.getValues("customer.accountHolder.accountHolderDetails.0.externalId");
      if (!currentAccountHolderExternalId) {
        form.setValue("customer.accountHolder.accountHolderDetails.0.externalId", generateUUID());
      }
    } else if (accountType === 'JOINT') {
      const firstHolderExternalId = form.getValues("customer.jointHolders.firstHolderDetails.0.externalId");
      if (!firstHolderExternalId) {
        form.setValue("customer.jointHolders.firstHolderDetails.0.externalId", generateUUID());
      }
      const secondHolderExternalId = form.getValues("customer.jointHolders.secondHolderDetails.0.externalId");
      if (!secondHolderExternalId) {
        form.setValue("customer.jointHolders.secondHolderDetails.0.externalId", generateUUID());
      }
    }

    // Generate account external ID
    const accountExternalId = form.getValues("accounts.0.externalId");
    if (!accountExternalId) {
      form.setValue("accounts.0.externalId", generateUUID());
    }

    // Generate user external IDs
    const userExternalId = form.getValues("users.0.externalUserId");
    if (!userExternalId) {
      form.setValue("users.0.externalUserId", generateUUID());
    }
    const userIndividualId = form.getValues("users.0.externalIndividualId");
    if (!userIndividualId) {
      form.setValue("users.0.externalIndividualId", generateUUID());
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
      
      // Sync business description for organizations
      if (name === "customer.organization.identifications.0.businessDescription") {
        const businessDescription = value.customer?.organization?.identifications?.[0]?.businessDescription;
        if (businessDescription) {
          form.setValue("customer.organization.accountSupport.businessDescription", businessDescription);
        }
      }
      
      // Sync investment objectives between account setup and financial information
      if (name === "accounts.0.investmentObjectives.0") {
        const investmentObjective = value.accounts?.[0]?.investmentObjectives?.[0];
        if (investmentObjective) {
          const accountType = value.customer?.type;
          if (accountType === 'INDIVIDUAL') {
            form.setValue("customer.accountHolder.financialInformation.0.investmentObjectives.0", investmentObjective);
          } else if (accountType === 'JOINT') {
            form.setValue("customer.jointHolders.financialInformation.0.investmentObjectives.0", investmentObjective);
          } else if (accountType === 'ORG') {
            form.setValue("customer.organization.financialInformation.0.investmentObjectives.0", investmentObjective);
          }
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
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Initialize W8 documents when account type changes
  React.useEffect(() => {
    updateW8Documents();
  }, [accountType]);

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
      <div className="grid grid-cols-2 gap-4">
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
      <div className="grid grid-cols-2 gap-4">
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
      <h3 className="text-xl font-semibold">Financial Information</h3>
      
      {/* Net Worth */}
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.0.netWorth` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Net Worth (USD)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="1000000" 
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
                  type="number" 
                  placeholder="500000" 
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
                  type="number" 
                  placeholder="100000" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Investment Objectives */}
      <FormField
        control={form.control}
        name={`${basePath}.0.investmentObjectives.0` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Investment Objective</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select investment objective" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {investmentObjectivesOptions.map((option) => (
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

      {/* Investment Experience */}
      <h4 className="text-lg font-semibold">Investment Experience</h4>
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.0.investmentExperience.0.assetClass` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Class</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="STK">Stocks</SelectItem>
                  <SelectItem value="OPT">Options</SelectItem>
                  <SelectItem value="FUT">Futures</SelectItem>
                  <SelectItem value="FX">Foreign Exchange</SelectItem>
                  <SelectItem value="BOND">Bonds</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePath}.0.investmentExperience.0.yearsTrading` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years Trading Experience</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="5" 
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
          name={`${basePath}.0.investmentExperience.0.tradesPerYear` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trades Per Year</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="100" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name={`${basePath}.0.investmentExperience.0.knowledgeLevel` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Investment Knowledge Level</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select knowledge level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Limited">Limited</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Extensive">Extensive</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Source of Wealth */}
      <h4 className="text-lg font-semibold">Source of Wealth</h4>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.0.sourcesOfWealth.0.sourceType` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Source Type</FormLabel>
              <FormDescription>
                <strong>Note:</strong> If your employment type is "Employed", you must select "Income" as your source of wealth.
              </FormDescription>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source type" />
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePath}.0.sourcesOfWealth.0.percentage` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Percentage (%)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="100" 
                  max="100" 
                  min="0" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );

  // Regulatory Information Section
  const renderRegulatoryInformation = (basePath: string) => (
    <Card className="p-6 space-y-6">
      <h3 className="text-xl font-semibold">Regulatory Information</h3>
      
      <FormField
        control={form.control}
        name={`${basePath}.0.regulatoryDetails.0.code` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Regulatory Code</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select regulatory code" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="PEP">Politically Exposed Person (PEP)</SelectItem>
                <SelectItem value="INSIDER">Corporate Insider</SelectItem>
                <SelectItem value="BROKER">Broker/Dealer Employee</SelectItem>
                <SelectItem value="EXCHANGE">Exchange Employee</SelectItem>
                <SelectItem value="NONE">None of the Above</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`${basePath}.0.regulatoryDetails.0.status` as any}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Applies to me</FormLabel>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`${basePath}.0.regulatoryDetails.0.details` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Details (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Provide additional details if applicable"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Card>
  );

  // Account Information Section
  const renderAccountInformation = () => (
    <Card className="p-6 space-y-6">
      <h3 className="text-xl font-semibold">Account Setup</h3>
      
      <div className="grid grid-cols-2 gap-4">
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
        name="accounts.0.investmentObjectives.0"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Investment Objective</FormLabel>
            <FormDescription>
              Select your primary investment goal for this account
            </FormDescription>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select investment objective" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {investmentObjectivesOptions.map((option) => (
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

      {/* Trading Permissions */}
      <h4 className="text-lg font-semibold">Trading Permissions</h4>
      <p className="text-subtitle text-sm mb-4">
        Specify which markets and products you want permission to trade
      </p>
      <div className="grid grid-cols-2 gap-4">
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
                  {productsOptions.map((option) => (
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
    </Card>
  );

  // ORGANIZATION FIELDS
  const renderOrganizationFields = () => (
    <Card className="p-6 space-y-6">
      <h3 className="text-xl font-semibold">Organization Information</h3>
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
    </Card>
  );

  // Render form fields for a single account holder
  const renderAccountHolderFields = (basePath: string, title: string) => (
    <Card className="p-6 space-y-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.name.first` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePath}.name.last` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
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
        name={`${basePath}.email` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Date of Birth and Country of Birth */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.dateOfBirth` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth (YYYY-MM-DD)</FormLabel>
              <FormControl>
                <Input type="date" placeholder="YYYY-MM-DD" {...field} />
              </FormControl>
              <FormMessage />
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
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.maritalStatus` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marital Status</FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePath}.numDependents` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Dependents</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="0" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <h4 className="text-lg font-semibold pt-4">Residence Address</h4>
      {renderAddressFields(`${basePath}.residenceAddress`)}

      <h4 className="text-lg font-semibold pt-4">Contact Information (Primary Phone)</h4>
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.phones.0.type` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Type</FormLabel>
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
              <FormMessage />
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <h4 className="text-lg font-semibold pt-4">Identification</h4>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${basePath}.identification.passport` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Number</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePath}.identification.expirationDate` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiration Date (YYYY-MM-DD)</FormLabel>
              <FormControl>
                <Input type="date" placeholder="YYYY-MM-DD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
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
      <div className="grid grid-cols-3 gap-4">
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
              <FormLabel>Tax Identification Number (TIN)</FormLabel>
              <FormControl>
                <Input placeholder="Enter TIN" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePath}.taxResidencies.0.tinType` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>TIN Type</FormLabel>
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
              <FormMessage />
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
            <FormLabel>Employment Type</FormLabel>
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
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
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
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Account Holder Information</h2>
        <p className="text-subtitle">
          {accountType === 'JOINT' 
            ? 'Please provide information for both account holders' 
            : accountType === 'ORG' ? 'Provide organization information' : 'Please provide your account holder information'
          }
        </p>
        
        {/* Development Button - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="pt-4">
            <Button 
              type="button"
              variant="outline"
              onClick={fillWithFakeData}
              className="text-xs px-3 py-1"
            >
              🎲 Fill with Fake Data (Dev Only)
            </Button>
          </div>
        )}
      </div>

      {/* NEW: Primary applicant contact credentials */}
      <Card className="p-6 space-y-6">
        <h3 className="text-xl font-semibold">Primary Contact Credentials</h3>
        <FormField
          control={form.control}
          name={"customer.email" as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"customer.prefix" as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username (Prefix)</FormLabel>
              <FormDescription>Your desired username (3–6 characters).</FormDescription>
              <FormControl>
                <Input placeholder="e.g. agm123" {...field} />
              </FormControl>
              <FormMessage />
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
      </Card>

      {accountType === 'JOINT' ? (
        <div className="space-y-6">
          {/* Joint Account Type Selection */}
          <Card className="p-6">
            <FormField
              control={form.control}
              name="customer.jointHolders.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Joint Account Type</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
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
