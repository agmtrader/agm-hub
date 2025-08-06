"use client";
import React, { useEffect, useState } from "react";
import { ReadApplicationByID, SendApplicationToIBKR, UpdateApplicationByID } from "@/utils/entities/application";
import { InternalApplication } from "@/lib/entities/application";
import LoadingComponent from "@/components/misc/LoadingComponent";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, User, DollarSign, ShieldCheck, Info, Users, Briefcase, FileText, Eye, Loader2, ExternalLink, UserCheck, Building, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { CreateAccount, UploadAccountDocument } from "@/utils/entities/account";
import { InternalAccount } from "@/lib/entities/account";
import { useSession } from "next-auth/react";
import LoaderButton from "@/components/misc/LoaderButton";
import DocumentViewer from "./DocumentViewer";
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
import { formatTimestamp, formatDateFromTimestamp } from "@/utils/dates";
import { redirect, useRouter } from "next/navigation";
import { useTranslationProvider } from "@/utils/providers/TranslationProvider";
import { formatURL } from "@/utils/language/lang";
import { ReadAdvisors } from "@/utils/entities/advisor";
import { Advisor } from "@/lib/entities/advisor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  applicationId: string;
}

const ApplicationPage: React.FC<Props> = ({ applicationId }) => {
  const router = useRouter();
  const { lang } = useTranslationProvider();

  const DOCUMENT_TYPE_MAP: { [key: number]: string } = {
    5001: 'W8 Form',
    8001: 'Proof of Identity',
    8002: 'Proof of Address',
  };

  const getDocumentName = (formNumber: number) => {
    return DOCUMENT_TYPE_MAP[formNumber] || 'Unknown Document';
  };

  const [application, setApplication] = useState<InternalApplication | null>(null);
  const [submitting, setSubmitting] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
  const [isManualAccountDialogOpen, setIsManualAccountDialogOpen] = useState(false);
  const [isManualAccountSubmitting, setIsManualAccountSubmitting] = useState(false);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [isLoadingAdvisors, setIsLoadingAdvisors] = useState(false);
  const [isUpdatingAdvisor, setIsUpdatingAdvisor] = useState(false);
  const [isUpdatingMasterAccount, setIsUpdatingMasterAccount] = useState(false);
  const {data:session} = useSession()

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
    async function fetchApplication() {
      try {
        const application = await ReadApplicationByID(applicationId);
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

  // Update form defaults when application data loads
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

  if (!application) return <LoadingComponent className="w-full h-full" />;

  async function handleCreateAccount() {

    if (!application) return;

    if (!session?.user?.id) {
      throw new Error('User not found');
    }

    try {
      setSubmitting(true)

      const applicationResponse = await SendApplicationToIBKR(application.application)
      console.log(applicationResponse)
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
        fee_template: null
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
        fee_template: null
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

  console.log(application)

  // --- Customer Section ---
  const customer = application.application.customer;
  const isJointAccount = customer.type === 'JOINT';
  
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

  // --- Accounts Section ---
  const accounts = application.application.accounts || [];
  // --- Users Section ---
  const users = application.application.users || [];

  // --- Documents Section ---
  const documents = application.application.documents || [];

  const formatFileSize = (bytes?: number) => {
    if (bytes === undefined || bytes === null) return 'N/A';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
        <CardContent className="space-y-2">
          <LabelValue label="Name" value={details?.name ? `${details.name.first} ${details.name.last}` : undefined} />
          <LabelValue label="Email" value={details?.email} />
          <LabelValue label="Country of Birth" value={details?.countryOfBirth} />
          <LabelValue label="Date of Birth" value={formatDate(details?.dateOfBirth)} />
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
          <LabelValue label="National Card Expiration" value={formatDate(details?.identification?.expirationDate)} />
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

  return (
    <div className="flex flex-col"> 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Customer Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary"/> Customer</CardTitle>
            <CardDescription>ID: <span className="text-muted-foreground">{customer.externalId}</span></CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <LabelValue label="Name" value={
              isJointAccount 
                ? firstHolderDetails?.name ? `${firstHolderDetails.name.first} ${firstHolderDetails.name.last}` : undefined
                : accountHolderDetails?.name ? `${accountHolderDetails.name.first} ${accountHolderDetails.name.last}` : undefined
            } />
            <LabelValue label="Type" value={<Badge>{customer.type}</Badge>} />
            <LabelValue label="Email" value={<span className="flex items-center gap-1"><Mail className="h-4 w-4"/>{customer.email}</span>} />
            <LabelValue label="Legal Residence" value={customer.legalResidenceCountry} />
            <LabelValue label="AML Standard" value={<Badge variant={customer.meetAmlStandard === 'true' ? 'success' : 'destructive'}>{customer.meetAmlStandard === 'true' ? 'Yes' : 'No'}</Badge>} />
            <LabelValue label="Direct Trading Access" value={<Badge variant={customer.directTradingAccess ? 'success' : 'outline'}>{customer.directTradingAccess ? 'Yes' : 'No'}</Badge>} />
            <LabelValue label="Prefix" value={customer.prefix} />
            <LabelValue label="Non-Pro" value={<Badge variant={customer.mdStatusNonPro ? 'success' : 'outline'}>{customer.mdStatusNonPro ? 'Yes' : 'No'}</Badge>} />
          </CardContent>
        </Card>

        {/* Account Holder Details Card(s) */}
        {isJointAccount ? (
          renderAccountHolderCard("First Account Holder", firstHolderDetails, true)
        ) : (
          renderAccountHolderCard("Account Holder Details", accountHolderDetails, true)
        )}
      </div>

      {/* Second Account Holder for Joint Accounts */}
      {isJointAccount && secondHolderDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {renderAccountHolderCard("Second Account Holder", secondHolderDetails, false)}
          <div></div> {/* Empty div for grid spacing */}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Accounts Table */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary"/> Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>External ID</TableHead>
                  <TableHead>Margin</TableHead>
                  <TableHead>Base Currency</TableHead>
                  <TableHead>Multi-Currency</TableHead>
                  <TableHead>Objectives</TableHead>
                  <TableHead>Trading Permissions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No accounts</TableCell></TableRow>}
                {accounts.map((acc: any, idx: any) => (
                  <TableRow key={acc.externalId || idx}>
                    <TableCell>{acc.externalId}</TableCell>
                    <TableCell>{acc.margin}</TableCell>
                    <TableCell>{acc.baseCurrency}</TableCell>
                    <TableCell>{acc.multiCurrency ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{acc.investmentObjectives?.join(', ')}</TableCell>
                    <TableCell>{acc.tradingPermissions?.map((tp: any) => `${tp.product} (${tp.country})`).join(', ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary"/> Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prefix</TableHead>
                  <TableHead>External User ID</TableHead>
                  <TableHead>External Individual ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No users</TableCell></TableRow>}
                {users.map((user: any, idx: any) => (
                  <TableRow key={user.externalUserId || idx}>
                    <TableCell>{user.prefix}</TableCell>
                    <TableCell>{user.externalUserId}</TableCell>
                    <TableCell>{user.externalIndividualId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Financial Information Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary"/> Financial Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(() => {
              const finInfo = isJointAccount ? jointFinancialInfo : financialInfo;
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

        {/* Regulatory Information Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary"/> Regulatory Information</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const regInfo = isJointAccount ? jointRegulatoryInfo : regulatoryInfo;
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

      <div className="mb-8">
        {/* Documents Card */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/> Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No documents uploaded</TableCell></TableRow>}
                {documents.map((doc: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell>{getDocumentName(doc.formNumber)}</TableCell>
                    <TableCell>{doc.attachedFile?.fileName || 'N/A'}</TableCell>
                    <TableCell>{formatFileSize(doc.attachedFile?.fileLength)}</TableCell>
                    <TableCell>{doc.payload?.mimeType || 'N/A'}</TableCell>
                    <TableCell>
                      {doc.payload?.data && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDocument(doc);
                            setIsDocumentViewerOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Application Metadata Card */}
      <div className="mb-8">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary"/> 
              Application Metadata
            </CardTitle>
            <CardDescription>Internal application tracking information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <span className="font-medium text-foreground min-w-[140px] flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Lead ID:
                  </span>
                                     {application.lead_id ? (
                     <Button
                       variant="ghost"
                       size="sm"
                       className="h-auto p-1 text-primary hover:text-primary/80"
                       onClick={() => router.push(formatURL(lang, `/dashboard/leads/${application.lead_id}`))}
                     >
                       {application.lead_id}
                       <ExternalLink className="h-3 w-3 ml-1" />
                     </Button>
                   ) : (
                     <span className="text-subtitle">—</span>
                   )}
                </div>

                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <span className="font-medium text-foreground min-w-[140px] flex items-center gap-2">
                    <User className="h-4 w-4" />
                    User ID:
                  </span>
                  {application.user_id ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-primary hover:text-primary/80"
                      onClick={() => redirect(formatURL(`/dashboard/users/${application.user_id}`, lang))}
                    >
                      {application.user_id}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  ) : (
                    <span className="text-subtitle">—</span>
                  )}
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
                    <Calendar className="h-4 w-4" />
                    Sent to IBKR:
                  </span>
                  {application.date_sent_to_ibkr ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Sent</Badge>
                      <span className="text-sm">{formatDateFromTimestamp(application.date_sent_to_ibkr)}</span>
                    </div>
                  ) : (
                    <Badge variant="outline">Not Sent</Badge>
                  )}
                </div>

                <LabelValue 
                  label="Application ID" 
                  value={
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-mono text-sm">{application.id}</span>
                    </div>
                  } 
                />
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <LoaderButton onClick={handleCreateAccount} isLoading={submitting} disabled={application.date_sent_to_ibkr !== null} text="Send Application to IBKR" className="w-fit"/>
        <Button onClick={handleCreateManualAccount} variant="outline" className="w-fit">
          Create Manual Account
        </Button>
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

      <DocumentViewer 
        document={selectedDocument}
        documentName={selectedDocument ? getDocumentName(selectedDocument.formNumber) : ''}
        isOpen={isDocumentViewerOpen}
        onOpenChange={setIsDocumentViewerOpen}
      />

    </div>
  );
};

const LabelValue = ({ label, value }: { label: string, value?: React.ReactNode }) => (
  <div className="flex select-text items-center gap-2 text-muted-foreground text-sm"><span className="font-medium text-foreground min-w-[140px]">{label}:</span> {value ?? <span className="text-subtitle">—</span>}</div>
);

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  try { return new Date(dateStr).toLocaleDateString(); } catch { return dateStr; }
}

export default ApplicationPage;
