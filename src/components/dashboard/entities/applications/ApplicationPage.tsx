"use client";
import React, { useEffect, useState } from "react";
import { ReadApplicationByID, SendApplicationToIBKR, UpdateApplicationByID } from "@/utils/entities/application";
import { Account, AccountHolderDetails, Customer, FinancialInformation, IndividualApplicant, InternalApplication, RegulatoryInformation, User } from "@/lib/entities/application";
import LoadingComponent from "@/components/misc/LoadingComponent";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DollarSign, ShieldCheck, Info, Users, Briefcase, Building } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CreateAccount, UploadAccountDocument } from "@/utils/entities/account";
import { InternalAccount } from "@/lib/entities/account";
import { useSession } from "next-auth/react";
import LoaderButton from "@/components/misc/LoaderButton";
import { formatDateFromTimestamp, formatTimestamp } from "@/utils/dates";
import { ReadAdvisors } from "@/utils/entities/advisor";
import { Advisor } from "@/lib/entities/advisor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApplicationDocuments from "./ApplicationDocuments";
import AccountHolderCard from "./AccountHolderCard";
import LabelValue from "@/components/misc/LabelValue";
import OrganizationCard from "./OrganizationCard";
import { Separator } from "@/components/ui/separator";
import ResultDialog from "./ResultDialog";
import { Button } from "@/components/ui/button";
import { sendCredentialsEmail } from "@/utils/tools/email";

interface Props {
  applicationId: string;
}

const ApplicationPage: React.FC<Props> = ({ applicationId }) => {
    
  const {data:session} = useSession()

  // Application
  const [application, setApplication] = useState<InternalApplication | null>(null);
  const [submitting, setSubmitting] = useState(false)  

  // Advisor
  const [advisors, setAdvisors] = useState<Advisor[] | null>(null);

  // Result dialog state
  const [resultData, setResultData] = useState<any | null>(null)

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
        const fetchedAdvisors = await ReadAdvisors();
        setAdvisors(fetchedAdvisors);
      } catch (error) {
        toast({
          title: "Error fetching advisors",
          description: "Please try again later",
          variant: "destructive",
        });
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
    }
  }

  async function handleUpdateMasterAccount(masterAccountId: string) {

    if (!application) return;
    
    const newMasterAccountId = masterAccountId === "none" ? null : masterAccountId;
    
    try {
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
    }
  }

  // Ensure we have the full IBKR application payload before rendering
  if (!application || !application.application || !advisors) return <LoadingComponent className="w-full h-full" />;

  // --- Customer Section ---
  const customer:Customer = application.application.customer;

  const isJointAccount = customer.type === 'JOINT';
  const isOrgAccount = customer.type === 'ORG';

  // Individual accounts
  const accountHolder:IndividualApplicant = customer.accountHolder || {
    accountHolderDetails: [],
    financialInformation: [],
    regulatoryInformation: []
  };
  const accountHolderDetails:AccountHolderDetails = accountHolder?.accountHolderDetails?.[0];
  const financialInfo:FinancialInformation = accountHolder?.financialInformation?.[0];
  const regulatoryInfo:RegulatoryInformation = accountHolder?.regulatoryInformation?.[0];

  // Joint accounts
  const jointHolders = customer.jointHolders;
  const firstHolderDetails = isJointAccount ? (jointHolders?.firstHolderDetails?.[0] ?? accountHolder?.accountHolderDetails?.[0]) : undefined;
  const secondHolderDetails = isJointAccount ? (jointHolders?.secondHolderDetails?.[0] ?? accountHolder?.accountHolderDetails?.[1]) : undefined;
  const jointFinancialInfo = isJointAccount ? (jointHolders?.financialInformation?.[0] ?? accountHolder?.financialInformation?.[0]) : undefined;
  const jointRegulatoryInfo = isJointAccount ? (jointHolders?.regulatoryInformation?.[0] ?? accountHolder?.regulatoryInformation?.[0]) : undefined;

  // Organization accounts
  const organizationIdents = isOrgAccount ? customer.organization?.identifications || [] : [];
  const organizationAccountSupport = isOrgAccount ? customer.organization?.accountSupport : undefined;
  const associatedIndividuals = isOrgAccount ? customer.organization?.associatedEntities?.associatedIndividuals || [] : [];
  const organizationFinancialInfo = isOrgAccount ? customer.organization?.financialInformation?.[0] : undefined;
  const organizationRegulatoryInfo = isOrgAccount ? customer.organization?.regulatoryInformation?.[0] : undefined;

  // Accounts
  const accounts:Account[] = application.application.accounts || [];

  // Users
  const users:User[] = application.application.users || [];

  // Documents
  const documents = application.application.documents || [];

  return (
    <div className="flex flex-col gap-5"> 

      <h1 className="text-sm text-foreground">{application.date_sent_to_ibkr ? 'Sent to IBKR on ' + formatDateFromTimestamp(application.date_sent_to_ibkr) : 'Not Sent'}</h1>

      {/* Accounts and users Section */}
      <div className="flex gap-6 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary"/> Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {accounts.map((account, idx) => (
              <div key={idx} className="flex flex-col gap-2"> 
                <p className="text-lg font-semibold text-foreground">Account #{idx+1}</p>
                <LabelValue label="Margin" value={account.margin} />
                <LabelValue label="Currency" value={account.baseCurrency} />
                <Separator />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary"/> Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {users.map((user, idx) => (
                <div key={idx} className="flex flex-col gap-2"> 
                  <p className="text-lg font-semibold text-foreground">User #{idx+1}</p>
                  <LabelValue label="Prefix" value={user.prefix} />
                </div>
              ))}
              <Separator />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Holder Details */}
      {isJointAccount ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AccountHolderCard title="First Account Holder" details={firstHolderDetails} />
          {secondHolderDetails ? <AccountHolderCard title="Second Account Holder" details={secondHolderDetails} /> : <div></div>}
        </div>
      ) : (
        <div className="mb-8">
          <AccountHolderCard title="Account Holder Details" details={accountHolderDetails} />
        </div>
      )}

      {/* Organization Details & Associated Individuals */}
      {isOrgAccount && (
        <>
          <div className="mb-8">
            <OrganizationCard customer={customer} organizationAccountSupport={organizationAccountSupport} organizationIdents={organizationIdents} />
          </div>
          {associatedIndividuals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {associatedIndividuals.map((ind:any, idx:number) => (
                <AccountHolderCard key={idx} title={`Associated Individual ${idx+1}`} details={ind} />
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
                <div className="flex flex-col gap-4">
                  {regInfo.regulatoryDetails.map((rd: any, idx: any) => (
                    <div key={rd.code || idx} className="flex gap-2">
                      <p className="text-sm text-foreground font-medium">{rd.code}: <span className="text-subtitle font-normal">{rd.details || rd.detail}</span></p>
                    </div>
                  ))}
                </div>
              ) : <span className="text-muted-foreground">No regulatory details</span>;
            })()}
          </CardContent>
        </Card>
      </div>

      <ApplicationDocuments
        documents={documents}
      />

      {/* Application Metadata Section */}
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
                value={application.lead_id}
              />

              <LabelValue 
                label="User ID"
                value={
                  application.user_id ? (
                    application.user_id
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
                    disabled={false}
                  >
                    <SelectTrigger className="w-[200px] h-8">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No master account</SelectItem>
                      <SelectItem value="br">Broker Account</SelectItem>
                      <SelectItem value="ad">Advisor Account</SelectItem>
                    </SelectContent>
                  </Select>
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
                    disabled={!advisors}
                  >
                    <SelectTrigger className="w-[200px] h-8">
                      <SelectValue placeholder="Select advisor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No advisor</SelectItem>
                      {advisors &&
                        advisors.map((advisor) => (
                          <SelectItem key={advisor.id} value={advisor.code}>
                            {advisor.name} ({advisor.code})
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

            </div>
          </div>

        </CardContent>
      </Card>

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
            <Button 
              onClick={() => {}} 
              className="w-fit" 
            >
              Send IBKR credentials
            </Button>
          )
        }
      </div>

      {resultData && <ResultDialog resultData={resultData} isResultDialogOpen={resultData !== null} setIsResultDialogOpen={() => setResultData(null)} />}

    </div>
  );
};



export default ApplicationPage;
