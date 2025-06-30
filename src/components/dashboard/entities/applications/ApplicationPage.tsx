"use client";
import React, { useEffect, useState } from "react";
import { ReadApplicationByID, SendApplicationToIBKR } from "@/utils/entities/application";
import { Application, InternalApplication } from "@/lib/entities/application";
import LoadingComponent from "@/components/misc/LoadingComponent";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, User, DollarSign, ShieldCheck, Info, Users, Briefcase, FileText, Eye, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { CreateAccount } from "@/utils/entities/account";
import { AccountPayload } from "@/lib/entities/account";
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
  DialogTitle,
  DialogTrigger 
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
  const {data:session} = useSession()

  const manualAccountForm = useForm({
    resolver: zodResolver(account_schema),
    defaultValues: {
      advisor_id: application?.advisor_id || null,
      user_id: session?.user?.id || "",
      lead_id: application?.lead_id || null,
      master_account_id: application?.master_account_id || null,
      status: "",
      account_type: "",
      ibkr_account_number: null,
      ibkr_username: null,
      ibkr_password: null,
      temporal_email: null,
      temporal_password: null,
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

  // Update form defaults when application data loads
  useEffect(() => {
    if (application && session?.user?.id) {
      manualAccountForm.reset({
        advisor_id: application.advisor_id || null,
        user_id: session.user.id,
        lead_id: application.lead_id || null,
        master_account_id: application.master_account_id || null,
        status: "",
        account_type: "",
        ibkr_account_number: null,
        ibkr_username: null,
        ibkr_password: null,
        temporal_email: null,
        temporal_password: null,
      });
    }
  }, [application, session?.user?.id, manualAccountForm]);

  if (!application) return <LoadingComponent className="w-full h-full" />;

  async function handleCreateAccount() {

    if (!application) return;

    try {
      setSubmitting(true)

      const account: AccountPayload = {
        advisor_id: application.advisor_id,
        user_id: session?.user?.id || "",
        lead_id: application.lead_id,
        master_account_id: application.master_account_id,
        status: "",
        account_type: "",
        ibkr_account_number: null,
        ibkr_username: null,
        ibkr_password: null,
        temporal_email: null,
        temporal_password: null,
      }
      console.log('account', account)
      console.log('application', application)
      
      const accountResponse = await CreateAccount(account)
      const applicationResponse = application ? await SendApplicationToIBKR(application.application) : null
      console.log('applicationResponse', applicationResponse)
      console.log('accountResponse', accountResponse)

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

    try {
      setIsManualAccountSubmitting(true);

      const account: AccountPayload = {
        advisor_id: values.advisor_id,
        user_id: values.user_id,
        lead_id: values.lead_id,
        master_account_id: values.master_account_id,
        status: values.status,
        account_type: values.account_type,
        ibkr_account_number: values.ibkr_account_number,
        ibkr_username: values.ibkr_username,
        ibkr_password: values.ibkr_password,
        temporal_email: values.temporal_email,
        temporal_password: values.temporal_password,
      };

      const accountResponse = await CreateAccount(account);
      
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

  // --- Customer Section ---
  const customer = application.application.customer;
  const accountHolder = customer.accountHolder;
  const accountHolderDetails = accountHolder.accountHolderDetails?.[0];
  const financialInfo = accountHolder.financialInformation?.[0];
  const regulatoryInfo = accountHolder.regulatoryInformation?.[0];

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
            <LabelValue label="Name" value={accountHolderDetails?.name ? `${accountHolderDetails.name.first} ${accountHolderDetails.name.last}` : undefined} />
            <LabelValue label="Type" value={<Badge>{customer.type}</Badge>} />
            <LabelValue label="Email" value={<span className="flex items-center gap-1"><Mail className="h-4 w-4"/>{customer.email}</span>} />
            <LabelValue label="Legal Residence" value={customer.legalResidenceCountry} />
            <LabelValue label="AML Standard" value={<Badge variant={customer.meetAmlStandard === 'true' ? 'success' : 'destructive'}>{customer.meetAmlStandard === 'true' ? 'Yes' : 'No'}</Badge>} />
            <LabelValue label="Direct Trading Access" value={<Badge variant={customer.directTradingAccess ? 'success' : 'outline'}>{customer.directTradingAccess ? 'Yes' : 'No'}</Badge>} />
            <LabelValue label="Prefix" value={customer.prefix} />
            <LabelValue label="Non-Pro" value={<Badge variant={customer.mdStatusNonPro ? 'success' : 'outline'}>{customer.mdStatusNonPro ? 'Yes' : 'No'}</Badge>} />
          </CardContent>
        </Card>

        {/* Account Holder Details Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary"/> Account Holder Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <LabelValue label="Country of Birth" value={accountHolderDetails?.countryOfBirth} />
            <LabelValue label="Date of Birth" value={formatDate(accountHolderDetails?.dateOfBirth)} />
            <LabelValue label="Email" value={accountHolderDetails?.email} />
            <LabelValue label="Employment Type" value={accountHolderDetails?.employmentType} />
            <LabelValue label="External ID" value={accountHolderDetails?.externalId} />
            <LabelValue label="Same Mail Address" value={<Badge variant={accountHolderDetails?.sameMailAddress ? 'success' : 'outline'}>{accountHolderDetails?.sameMailAddress ? 'Yes' : 'No'}</Badge>} />
            <LabelValue label="Phones" value={accountHolderDetails?.phones?.map((p: any) => `${p.type}: +${p.country} ${p.number}`).join(', ')} />
            <LabelValue label="Address" value={accountHolderDetails?.residenceAddress ? `${accountHolderDetails.residenceAddress.street1}, ${accountHolderDetails.residenceAddress.city}, ${accountHolderDetails.residenceAddress.state}, ${accountHolderDetails.residenceAddress.country} ${accountHolderDetails.residenceAddress.postalCode}` : undefined} />
            <LabelValue label="Employer" value={accountHolderDetails?.employmentDetails?.employer} />
            <LabelValue label="Occupation" value={accountHolderDetails?.employmentDetails?.occupation} />
            <LabelValue label="Employer Business" value={accountHolderDetails?.employmentDetails?.employerBusiness} />
            <LabelValue label="Employer Address" value={accountHolderDetails?.employmentDetails?.employerAddress ? `${accountHolderDetails.employmentDetails.employerAddress.street1}, ${accountHolderDetails.employmentDetails.employerAddress.city}, ${accountHolderDetails.employmentDetails.employerAddress.state}, ${accountHolderDetails.employmentDetails.employerAddress.country} ${accountHolderDetails.employmentDetails.employerAddress.postalCode}` : undefined} />
            <LabelValue label="Passport" value={accountHolderDetails?.identification?.passport} />
            <LabelValue label="Passport Country" value={accountHolderDetails?.identification?.issuingCountry} />
          </CardContent>
        </Card>
      </div>

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
            <LabelValue label="Net Worth" value={financialInfo?.netWorth} />
            <LabelValue label="Liquid Net Worth" value={financialInfo?.liquidNetWorth} />
            <LabelValue label="Annual Net Income" value={financialInfo?.annualNetIncome} />
            <LabelValue label="Objectives" value={financialInfo?.investmentObjectives?.join(', ')} />
            <LabelValue label="Sources of Wealth" value={financialInfo?.sourcesOfWealth?.map((sow: any) => `${sow.sourceType}${sow.description ? ` (${sow.description})` : ''}: ${sow.percentage ?? '-'}%`).join('; ')} />
            <LabelValue label="Investment Experience" value={financialInfo?.investmentExperience?.map((exp: any) => `${exp.assetClass}: ${exp.yearsTrading} years, ${exp.tradesPerYear} trades/year, ${exp.knowledgeLevel}`).join('; ')} />
          </CardContent>
        </Card>

        {/* Regulatory Information Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary"/> Regulatory Information</CardTitle>
          </CardHeader>
          <CardContent>
            {regulatoryInfo?.regulatoryDetails?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regulatoryInfo.regulatoryDetails.map((rd: any, idx: any) => (
                    <TableRow key={rd.code || idx}>
                      <TableCell>{rd.code}</TableCell>
                      <TableCell><Badge variant={rd.status ? 'success' : 'destructive'}>{rd.status ? 'Yes' : 'No'}</Badge></TableCell>
                      <TableCell>{rd.details || rd.detail}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : <span className="text-muted-foreground">No regulatory details</span>}
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

      <div className="flex gap-4">
        <LoaderButton onClick={handleCreateAccount} disabled={true} isLoading={submitting} text="Send Application to IBKR" className="w-fit"/>
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
                  name="advisor_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advisor ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter advisor ID" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={manualAccountForm.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter user ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={manualAccountForm.control}
                  name="lead_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter lead ID" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={manualAccountForm.control}
                  name="master_account_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Master Account ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter master account ID" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={manualAccountForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={manualAccountForm.control}
                  name="account_type"
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
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="joint">Joint</SelectItem>
                          <SelectItem value="corporate">Corporate</SelectItem>
                          <SelectItem value="trust">Trust</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
  <div className="flex items-center gap-2 text-muted-foreground text-sm"><span className="font-medium text-foreground min-w-[140px]">{label}:</span> {value ?? <span className="text-subtitle">—</span>}</div>
);

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  try { return new Date(dateStr).toLocaleDateString(); } catch { return dateStr; }
}

export default ApplicationPage;
