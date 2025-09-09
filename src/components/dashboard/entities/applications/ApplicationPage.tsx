"use client";
import React, { useEffect, useState } from "react";
import { ReadApplicationByID, SendApplicationToIBKR, UpdateApplicationByID } from "@/utils/entities/application";
import { InternalApplication } from "@/lib/entities/application";
import LoadingComponent from "@/components/misc/LoadingComponent";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, ShieldCheck, Info, Users, Briefcase, Loader2, Building } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { CreateAccount, UploadAccountDocument } from "@/utils/entities/account";
import { InternalAccount } from "@/lib/entities/account";
import { useSession } from "next-auth/react";
import LoaderButton from "@/components/misc/LoaderButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { account_schema } from "@/lib/entities/schemas/account";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatTimestamp } from "@/utils/dates";
import { ReadAdvisors } from "@/utils/entities/advisor";
import { Advisor } from "@/lib/entities/advisor";
import LeadDialog from "../leads/LeadDialog";
import UserDialog from "../users/UserDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/misc/DataTable";
import ApplicationDocuments from "./ApplicationDocuments";
import UserCard from "../users/UserCard";

interface Props {
  applicationId: string;
}

const ApplicationPage: React.FC<Props> = ({ applicationId }) => {
    
  const {data:session} = useSession()

  // Application
  const [application, setApplication] = useState<InternalApplication | null>(null);
  const [submitting, setSubmitting] = useState(false)  

  // Result dialog state
  const [resultData, setResultData] = useState<any | null>(null)
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false)

  // Manual Account
  const [isManualAccountDialogOpen, setIsManualAccountDialogOpen] = useState(false);
  const [isManualAccountSubmitting, setIsManualAccountSubmitting] = useState(false);
  const manualAccountForm = useForm({
    resolver: zodResolver(account_schema),
    defaultValues: {
      ibkr_account_number: "",
      ibkr_username: "",
      ibkr_password: "",
      temporal_email: "",
      temporal_password: "",
    }
  });
  useEffect(() => {
    if (application && session?.user?.id) {
      manualAccountForm.reset({
        ibkr_account_number: "",
        ibkr_username: "",
        ibkr_password: "",
        temporal_email: "",
        temporal_password: "",
      });
    }
  }, [application, session?.user?.id, manualAccountForm]);
  async function handleCreateManualAccount() {
    if (!application) return;
    setIsManualAccountDialogOpen(true);
  }
  async function handleManualAccountSubmit(values: any) {
    if (!application) return;

    if (!session?.user?.id) {
      throw new Error('User not found');
    }

    try {
      setIsManualAccountSubmitting(true);

      // Construct full Account object by combining form values with application/session data
      const account:InternalAccount = {
        ibkr_account_number: values.ibkr_account_number,
        ibkr_username: values.ibkr_username,
        ibkr_password: values.ibkr_password,
        temporal_email: values.temporal_email,
        temporal_password: values.temporal_password,
        application_id: application.id,
        fee_template: null,
        user_id: session?.user?.id
      };

      await CreateAccount(account);

      await UpdateApplicationByID(applicationId, { date_sent_to_ibkr: formatTimestamp(new Date()) })
      
      toast({
        title: "Account Created",
        description: "Manual account created successfully.",
        variant: "success",
      });

      setIsManualAccountDialogOpen(false);
      manualAccountForm.reset();

    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Error creating manual account, please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsManualAccountSubmitting(false);
    }
  }

  // Advisor
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [isLoadingAdvisors, setIsLoadingAdvisors] = useState(false);
  const [isUpdatingAdvisor, setIsUpdatingAdvisor] = useState(false);

  // Master Account
  const [isUpdatingMasterAccount, setIsUpdatingMasterAccount] = useState(false);

  // Lead
  const [selectedLeadID, setSelectedLeadID] = useState<string | null>(null)

  // User
  const [selectedUserID, setSelectedUserID] = useState<string | null>(null)

  console.log(application)

  // Fetch application details
  useEffect(() => {
    async function fetchApplication() {
      try {
        const application = await ReadApplicationByID(applicationId);
        console.log(application)
        if (!application) throw new Error("Application not found");
        setApplication(application);
      } catch (e) {
        toast({
          title: "Error",
          description: e instanceof Error ? e.message : "Error fetching application details",
          variant: "destructive",
        });
      }
    }
    fetchApplication();
  }, [applicationId]);

  // Fetch advisors
  useEffect(() => {
    async function fetchAdvisors() {
      try {
        setIsLoadingAdvisors(true);
        const fetchedAdvisors = await ReadAdvisors();
        setAdvisors(fetchedAdvisors);
      } catch (error) {
        toast({
          title: "Error fetching advisors",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoadingAdvisors(false);
      }
    }
    fetchAdvisors();
  }, []);

  async function handleCreateAccount() {

    if (!application || !application.application) return;

    if (!session?.user?.id) {
      throw new Error('User not found');
    }

    try {
      setSubmitting(true)

      const applicationResponse = await SendApplicationToIBKR(application.application)
      console.log(applicationResponse)

      // Store response and open result dialog
      setResultData(applicationResponse)
      setIsResultDialogOpen(true)

      const status = applicationResponse.fileData.data.application.status
      if (status !== 'Success') {
        // If not successful, skip account creation flow
        return
      }

      const accountNumber = applicationResponse.fileData.data.application.accounts[0].value
      if (!accountNumber) {
        throw new Error('Error creating account, please try again later.');
      }

      const account: InternalAccount = {
        ibkr_account_number: accountNumber,
        ibkr_username: null,
        ibkr_password: null,
        temporal_email: null,
        temporal_password: null,
        application_id: application.id,
        fee_template: null,
        user_id: session?.user?.id
      }

      const accountResponse = await CreateAccount(account)
      if (!accountResponse.id) {
        throw new Error('Error creating internal account, please try again later.');
      }

      for (const document of application.application.documents || []) {
        if (document && document.attachedFile) {  
          await UploadAccountDocument(
            accountResponse.id, 
            document.attachedFile?.fileName, 
            document.attachedFile?.fileLength, 
            document.attachedFile?.sha1Checksum, 
            document.payload?.mimeType || '', 
            document.payload?.data || ''
          )
        }
      }

      await UpdateApplicationByID(applicationId, { date_sent_to_ibkr: formatTimestamp(new Date()) })

      toast({
        title: "Application Sent",
        description: "Application sent to IBKR successfully.",
        variant: "success",
      });

    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Error creating account, please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false)
    }

  }

  async function handleUpdateAdvisorCode(advisorCode: string) {
    if (!application) return;
    
    const newAdvisorCode = advisorCode === "none" ? null : advisorCode;
    
    try {
      setIsUpdatingAdvisor(true);
      await UpdateApplicationByID(application.id, {
        advisor_code: newAdvisorCode,
      });
      
      // Update local state
      setApplication(prev => prev ? {
        ...prev,
        advisor_code: newAdvisorCode,
      } : null);
      
      toast({
        title: "Advisor Updated",
        description: "Advisor code has been updated successfully.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update advisor code.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingAdvisor(false);
    }
  }

  async function handleUpdateMasterAccount(masterAccountId: string) {
    if (!application) return;
    
    const newMasterAccountId = masterAccountId === "none" ? null : masterAccountId;
    
    try {
      setIsUpdatingMasterAccount(true);
      await UpdateApplicationByID(application.id, {
        master_account_id: newMasterAccountId,
      });
      
      // Update local state
      setApplication(prev => prev ? {
        ...prev,
        master_account_id: newMasterAccountId,
      } : null);
      
      toast({
        title: "Master Account Updated",
        description: "Master account ID has been updated successfully.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update master account ID.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingMasterAccount(false);
    }
  }

  // Ensure we have the full IBKR application payload before rendering
  if (!application || !application.application) return <LoadingComponent className="w-full h-full" />;

  // --- Customer Section ---
  const customer = application.application.customer;
  const isJointAccount = customer.type === 'JOINT';
  const isOrgAccount = customer.type === 'ORG';
  
  // Handle individual vs joint account structures
  const accountHolder = customer.accountHolder;
  const jointHolders = customer.jointHolders;
  
  // For individual accounts
  const accountHolderDetails = accountHolder?.accountHolderDetails?.[0];
  const financialInfo = accountHolder?.financialInformation?.[0];
  const regulatoryInfo = accountHolder?.regulatoryInformation?.[0];
  
  // For joint accounts – gracefully handle cases where `jointHolders` is undefined (legacy payloads)
  const firstHolderDetails = isJointAccount
    ? (jointHolders?.firstHolderDetails?.[0] ?? accountHolder?.accountHolderDetails?.[0])
    : undefined;

  const secondHolderDetails = isJointAccount
    ? (jointHolders?.secondHolderDetails?.[0] ?? accountHolder?.accountHolderDetails?.[1])
    : undefined;

  const jointFinancialInfo = isJointAccount
    ? (jointHolders?.financialInformation?.[0] ?? accountHolder?.financialInformation?.[0])
    : undefined;

  const jointRegulatoryInfo = isJointAccount
    ? (jointHolders?.regulatoryInformation?.[0] ?? accountHolder?.regulatoryInformation?.[0])
    : undefined;
  
  // --- Organization (ORG) Section ---
  const organizationIdents = isOrgAccount ? customer.organization?.identifications || [] : [];
  const organizationAccountSupport = isOrgAccount ? customer.organization?.accountSupport : undefined;
  const associatedIndividuals = isOrgAccount ? customer.organization?.associatedEntities?.associatedIndividuals || [] : [];
  const organizationFinancialInfo = isOrgAccount ? customer.organization?.financialInformation?.[0] : undefined;
  const organizationRegulatoryInfo = isOrgAccount ? customer.organization?.regulatoryInformation?.[0] : undefined;

  // --- Accounts Section ---
  const accounts = application.application.accounts || [];
  // --- Users Section ---
  const users = application.application.users || [];

  // --- Documents Section ---
  const documents = application.application.documents || [];

  const renderAccountHolderCard = (
    title: string, 
    details: any, 
    isFirst: boolean = true
  ) => {
    if (!details) return null;
    
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary"/> 
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <LabelValue label="Name" value={details?.name ? `${details.name.first} ${details.name.last}` : undefined} />
          <LabelValue label="Email" value={details?.email} />
          <LabelValue label="Country of Birth" value={details?.countryOfBirth} />
          <LabelValue label="Date of Birth" value={details?.dateOfBirth} />
          <LabelValue label="Employment Type" value={details?.employmentType} />
          <LabelValue label="External ID" value={details?.externalId} />
          <LabelValue label="Same Mail Address" value={<Badge variant={details?.sameMailAddress ? 'success' : 'outline'}>{details?.sameMailAddress ? 'Yes' : 'No'}</Badge>} />
          <LabelValue label="Phones" value={details?.phones?.map((p: any) => `${p.type}: +${p.country} ${p.number}`).join(', ')} />
          <LabelValue label="Address" value={details?.residenceAddress ? `${details.residenceAddress.street1}, ${details.residenceAddress.city}, ${details.residenceAddress.state}, ${details.residenceAddress.country} ${details.residenceAddress.postalCode}` : undefined} />
          <LabelValue label="Employer" value={details?.employmentDetails?.employer} />
          <LabelValue label="Occupation" value={details?.employmentDetails?.occupation} />
          <LabelValue label="Employer Business" value={details?.employmentDetails?.employerBusiness} />
          <LabelValue label="Employer Address" value={details?.employmentDetails?.employerAddress ? `${details.employmentDetails.employerAddress.street1}, ${details.employmentDetails.employerAddress.city}, ${details.employmentDetails.employerAddress.state}, ${details.employmentDetails.employerAddress.country} ${details.employmentDetails.employerAddress.postalCode}` : undefined} />
          <LabelValue label="Passport" value={details?.identification?.passport} />
          <LabelValue label="Passport Country" value={details?.identification?.issuingCountry} />
          <LabelValue label="Citizenship" value={details?.identification?.citizenship} />
          <LabelValue label="National Card" value={details?.identification?.nationalCard} />
          <LabelValue label="National Card Expiration" value={details?.identification?.expirationDate} />
          <LabelValue label="Marital Status" value={details?.maritalStatus} />
          <LabelValue label="Dependents" value={details?.numDependents !== undefined ? details.numDependents.toString() : undefined} />
          <LabelValue label="Tax Residencies" value={details?.taxResidencies?.map((tr: any) => `${tr.country} (${tr.tinType}): ${tr.tin}`).join('; ')} />
          {details?.w8Ben && (
            <>
              <LabelValue label="W8Ben Name" value={details.w8Ben.name} />
              <LabelValue label="W8Ben Cert" value={<Badge variant={details.w8Ben.cert ? 'success' : 'outline'}>{details.w8Ben.cert ? 'Yes' : 'No'}</Badge>} />
              <LabelValue label="Foreign Tax ID" value={details.w8Ben.foreignTaxId} />
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  // Render Organization card
  const renderOrganizationCard = () => {
    if (!isOrgAccount) return null;

    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary"/>
            Organization Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {/* General Customer Fields */}
          <LabelValue label="Customer Prefix" value={customer.prefix} />
          <LabelValue label="Customer External ID" value={customer.externalId} />
          <LabelValue label="Customer Email" value={customer.email} />
          <LabelValue label="Legal Residence Country" value={customer.legalResidenceCountry} />
          <LabelValue label="Direct Trading Access" value={<Badge variant={customer.directTradingAccess ? 'success' : 'outline'}>{customer.directTradingAccess ? 'Yes' : 'No'}</Badge>} />
          <LabelValue label="Meets AML Standard" value={customer.meetAmlStandard} />
          <LabelValue label="MD Status Non-Pro" value={<Badge variant={customer.mdStatusNonPro ? 'success' : 'outline'}>{customer.mdStatusNonPro ? 'Yes' : 'No'}</Badge>} />

          {/* Account Support */}
          {organizationAccountSupport && (
            <>
              <LabelValue label="Owners Reside US" value={<Badge variant={organizationAccountSupport.ownersResideUS ? 'success' : 'outline'}>{organizationAccountSupport.ownersResideUS ? 'Yes' : 'No'}</Badge>} />
              <LabelValue label="Business Description" value={organizationAccountSupport.businessDescription} />
            </>
          )}

          {/* Identifications (may be multiple) */}
          {organizationIdents.map((ident:any, idx:number) => {
            const businessAddress = ident.placeOfBusinessAddress;
            return (
              <React.Fragment key={idx}>
                <LabelValue label={`Identification Name ${idx+1}`} value={ident.name} />
                <LabelValue label={`Identification ID ${idx+1}`} value={ident.identification} />
                <LabelValue label={`Identification Description ${idx+1}`} value={ident.businessDescription} />
                <LabelValue label={`Business Address ${idx+1}`} value={businessAddress ? `${businessAddress.street1}, ${businessAddress.city}, ${businessAddress.state}, ${businessAddress.country} ${businessAddress.postalCode}` : undefined} />
              </React.Fragment>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  // --- render result dialog ---
  const renderResultDialog = () => {
    if (!resultData) return null;
    const status = resultData.fileData?.data?.application?.status
    const errors = resultData.fileData?.data?.application?.error || []
    const account = resultData.fileData?.data?.application?.accounts?.[0]

    return (
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}> 
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{status === 'Success' ? 'Successfully Sent to IBKR' : 'Rejected'}</DialogTitle>
        </DialogHeader>
        {status === 'Success' ? (
          <div className="space-y-4">
            <p className="text-sm text-success">Successfully Sent to IBKR</p>
            <p className="text-sm text-foreground">Account Number: {account?.value}</p>
            <Button>Send email with credentials to user</Button>
          </div>
          ) : (
          <div className="space-y-4">
            <p className="text-sm text-error">Rejected</p>
            <p className="text-sm text-foreground">The following errors occurred:</p>
            <DataTable
              data={errors}
              columns={[{ header: 'Error', accessorKey: 'value' }]}
            />
          </div>
          )}
      </DialogContent> 
      </Dialog>
    )
  }

  return (
    <div className="flex flex-col"> 

      {/* Application Metadata Section */}
      <div className="mb-8">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary"/> 
              Application Internals
            </CardTitle>
            <CardDescription>Internal application tracking information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
              <LabelValue 
                  label="Application ID" 
                  value={application.id}
                />
                <LabelValue 
                  label="Lead ID"
                  value={
                    application.lead_id ? (
                      <Button variant="outline" size="sm" onClick={() => setSelectedLeadID(application.lead_id)} className="w-fit">
                        {application.lead_id}
                      </Button>
                    ) : (
                      '-'
                    )
                  }
                />

                <LabelValue 
                  label="User ID"
                  value={
                    application.user_id ? (
                      <Button variant="outline" size="sm" onClick={() => setSelectedUserID(application.user_id)} className="w-fit">
                        {application.user_id}
                      </Button>
                    ) : (
                      '-'
                    )
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <span className="font-medium text-foreground min-w-[140px] flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Master Account ID:
                  </span>
                  <div className="flex items-center gap-2">
                    <Select
                      value={application.master_account_id || "none"}
                      onValueChange={handleUpdateMasterAccount}
                      disabled={isUpdatingMasterAccount}
                    >
                      <SelectTrigger className="w-[200px] h-8">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No master account</SelectItem>
                        <SelectItem value="br">Broker Account (br)</SelectItem>
                        <SelectItem value="ad">Advisor Account (ad)</SelectItem>
                      </SelectContent>
                    </Select>
                    {isUpdatingMasterAccount && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <span className="font-medium text-foreground min-w-[140px] flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Advisor Code:
                  </span>
                  <div className="flex items-center gap-2">
                    <Select
                      value={application.advisor_code || "none"}
                      onValueChange={handleUpdateAdvisorCode}
                      disabled={isLoadingAdvisors || isUpdatingAdvisor}
                    >
                      <SelectTrigger className="w-[200px] h-8">
                        <SelectValue placeholder="Select advisor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No advisor</SelectItem>
                        {isLoadingAdvisors ? (
                          <SelectItem value="loading" disabled>Loading advisors...</SelectItem>
                        ) : (
                          advisors.map((advisor) => (
                            <SelectItem key={advisor.id} value={advisor.code}>
                              {advisor.name} ({advisor.code})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {isUpdatingAdvisor && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </div>

                <LabelValue 
                  label="Sent to IBKR"
                  value={
                    <Badge variant={application.date_sent_to_ibkr ? 'success' : 'outline'}>
                      {application.date_sent_to_ibkr ? 'Sent' : 'Not Sent'}
                    </Badge>
                  }
                />

              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Accounts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary"/> Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <DataTable
              data={accounts}
              columns={[
                {
                  header: 'External ID',
                  accessorKey: 'externalId',
                },
                {
                  header: 'Margin',
                  accessorKey: 'margin',
                },
                {
                  header: 'Base Currency',
                  accessorKey: 'baseCurrency',
                },
                {
                  header: 'Multi-Currency',
                  accessorKey: 'multiCurrency',
                },
                {
                  header: 'Objectives',
                  accessorKey: 'investmentObjectives',
                },
                {
                  header: 'Trading Permissions',
                  accessorKey: 'tradingPermissions',
                },
              ]}
            />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary"/> Users</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={users}
              columns={[
                {
                  header: 'Prefix',
                  accessorKey: 'prefix',
                },
                {
                  header: 'External User ID',
                  accessorKey: 'externalUserId',
                },
                {
                  header: 'External Individual ID',
                  accessorKey: 'externalIndividualId',
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Account Holder Details */}
      {isJointAccount ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {renderAccountHolderCard("First Account Holder", firstHolderDetails, true)}
          {secondHolderDetails ? renderAccountHolderCard("Second Account Holder", secondHolderDetails, false) : <div></div>}
        </div>
      ) : (
        <div className="mb-8">
          {renderAccountHolderCard("Account Holder Details", accountHolderDetails, true)}
        </div>
      )}
      {/* Organization Details & Associated Individuals */}
      {isOrgAccount && (
        <>
          <div className="mb-8">
            {renderOrganizationCard()}
          </div>
          {associatedIndividuals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {associatedIndividuals.map((ind:any, idx:number) => (
                renderAccountHolderCard(`Associated Individual ${idx+1}`, ind, idx===0)
              ))}
            </div>
          )}
        </>
      )}

      {/* Financial Information and Regulatory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary"/> Financial Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(() => {
              const finInfo = isJointAccount ? jointFinancialInfo : (isOrgAccount ? organizationFinancialInfo : financialInfo);
              return (
                <>
                  <LabelValue label="Net Worth" value={finInfo?.netWorth} />
                  <LabelValue label="Liquid Net Worth" value={finInfo?.liquidNetWorth} />
                  <LabelValue label="Annual Net Income" value={finInfo?.annualNetIncome} />
                  <LabelValue label="Objectives" value={finInfo?.investmentObjectives?.join(', ')} />
                  <LabelValue label="Sources of Wealth" value={finInfo?.sourcesOfWealth?.map((sow: any) => `${sow.sourceType}${sow.description ? ` (${sow.description})` : ''}: ${sow.percentage ?? '-'}%`).join('; ')} />
                  <LabelValue label="Investment Experience" value={finInfo?.investmentExperience?.map((exp: any) => `${exp.assetClass}: ${exp.yearsTrading} years, ${exp.tradesPerYear} trades/year, ${exp.knowledgeLevel}`).join('; ')} />
                </>
              );
            })()}
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary"/> Regulatory Information</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const regInfo = isJointAccount ? jointRegulatoryInfo : (isOrgAccount ? organizationRegulatoryInfo : regulatoryInfo);
              return regInfo?.regulatoryDetails?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regInfo.regulatoryDetails.map((rd: any, idx: any) => (
                      <TableRow key={rd.code || idx}>
                        <TableCell>{rd.code}</TableCell>
                        <TableCell><Badge variant={rd.status ? 'success' : 'destructive'}>{rd.status ? 'Yes' : 'No'}</Badge></TableCell>
                        <TableCell>{rd.details || rd.detail}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : <span className="text-muted-foreground">No regulatory details</span>;
            })()}
          </CardContent>
        </Card>
      </div>

      <ApplicationDocuments
        documents={documents}
      />

      {/* Buttons Section */}
      <div className="flex gap-4">
        <LoaderButton 
          onClick={handleCreateAccount} 
          isLoading={submitting} 
          disabled={application.date_sent_to_ibkr !== null} 
          text="Send Application to IBKR" className="w-fit"
        />

        {
          application.date_sent_to_ibkr !== null && (
            <LoaderButton 
              onClick={() => {}} 
              isLoading={false}
              disabled={!application.date_sent_to_ibkr} 
              text="Send email with credentials to user" className="w-fit"
            />
          )
        }
        
        {
          /*
          <Button onClick={handleCreateManualAccount} variant="outline" className="w-fit">
            Create Manual Account
          </Button>
          */
        }
      </div>

      <Dialog open={isManualAccountDialogOpen} onOpenChange={setIsManualAccountDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Manual Account</DialogTitle>
          </DialogHeader>
          <Form {...manualAccountForm}>
            <form onSubmit={manualAccountForm.handleSubmit(handleManualAccountSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={manualAccountForm.control}
                  name="ibkr_account_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IBKR Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter IBKR account number" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={manualAccountForm.control}
                  name="ibkr_username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IBKR Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter IBKR username" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={manualAccountForm.control}
                  name="ibkr_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IBKR Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter IBKR password" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={manualAccountForm.control}
                  name="temporal_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temporal Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter temporal email" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={manualAccountForm.control}
                  name="temporal_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temporal Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter temporal password" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={isManualAccountSubmitting}
                  className="bg-primary text-background hover:bg-primary/90"
                >
                  {isManualAccountSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={isManualAccountSubmitting}
                  onClick={() => setIsManualAccountDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <LeadDialog 
        leadID={selectedLeadID}
        isOpen={!!selectedLeadID}
        onOpenChange={() => setSelectedLeadID(null)}
      />
      
      <UserDialog 
        userID={selectedUserID}
        isOpen={!!selectedUserID}
        onOpenChange={() => setSelectedUserID(null)}
      />

      {renderResultDialog()}

    </div>
  );
};

export const LabelValue = ({ label, value }: { label: string, value?: React.ReactNode }) => {
  if (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    return null;
  }
  return (
    <div className="flex select-text items-center gap-2 text-muted-foreground text-sm">
      <span className="font-medium text-foreground min-w-[140px]">{label}:</span> {value}
    </div>
  );
};

export default ApplicationPage;
