"use client";
import React, { useEffect, useState } from "react";
import { ReadApplicationByID, SendApplicationToIBKR } from "@/utils/entities/application";
import { InternalApplication } from "@/lib/entities/application";
import LoadingComponent from "@/components/misc/LoadingComponent";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, User, DollarSign, ShieldCheck, Info, Users, Briefcase } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { CreateAccount } from "@/utils/entities/account";
import { AccountPayload } from "@/lib/entities/account";
import { useSession } from "next-auth/react";

interface Props {
  applicationId: string;
}

const ApplicationPage: React.FC<Props> = ({ applicationId }) => {

  const [application, setApplication] = useState<InternalApplication | null>(null);

  const {data:session} = useSession()

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

  if (!application) return <LoadingComponent className="w-full h-full" />;

  async function handleCreateAccount() {

    if (!application) return;

    try {

      const account: AccountPayload = {
        advisor_id: application.advisor_id,
        user_id: session?.user?.id || "",
        lead_id: application.lead_id,
        master_account_id: application.master_account_id,
        status: "",
        account_type: "",
        ibkr_account_number: null,
      }

      const accountResponse = await CreateAccount(account) 
      const applicationResponse = await SendApplicationToIBKR(application.application)
      console.log('applicationResponse', applicationResponse)
      console.log('accountResponse', accountResponse)

      toast({
        title: "Account Created",
        description: "Account created successfully.",
        variant: "success",
      });

    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Error creating account",
        variant: "destructive",
      });
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
      </div>

      <Button onClick={handleCreateAccount} className="w-fit">
        Create Account with this Application Information
      </Button>
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
