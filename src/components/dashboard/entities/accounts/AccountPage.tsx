'use client'
import React, { useEffect, useState } from 'react';
import { Account as AccountFromDB } from '@/lib/entities/account';

export interface MarketData {
  serviceId: string;
  serviceName: string;
  currency: string;
  monthlyFee: string;
}

export interface Restriction {
  id: number;
  name: string;
  byIB: boolean;
}

export interface AccountDetails {
  account: Account;
  associatedPersons: AssociatedPerson[];
  financialInformation: FinancialInformation;
  sourcesOfWealth: SourceOfWealth[];
  documents?: any[];
  marketData?: MarketData[];
  restrictions?: Restriction[];
  tradeBundles?: string[];
}

export interface Account {
  accountId: string;
  masterAccountId: string;
  clearingStatus: string;
  clearingStatusDescription: string;
  stateCode: string;
  baseCurrency: string;
  dateBegun: string; // ISO date string
  accountTitle: string;
  emailAddress: string;
  margin: string;
  applicantType: string;
  subType: string;
  stockYieldProgram?: Record<string, unknown>; // empty object or future fields
  feeTemplate: FeeTemplate;
  capabilities: Capabilities;
  limitedOptionTrading: string;
  investmentObjectives: string[];
  externalId: string;
  mifidCategory: string;
  processType: string;
  // Newly added optional fields from IBKR API
  equity?: number;
  riskScore?: number;
  dateApproved?: string;
  dateFunded?: string;
  dateOpened?: string;
}

export interface FeeTemplate {
  brokerFeeInfo: string;
}

export interface Capabilities {
  approved: string[];
  requested: string[];
  activated: string[];
}

export interface AssociatedPerson {
  entityId: number;
  externalCode: string;
  firstName: string;
  lastName: string;
  username: string;
  passwordDate: string; // ISO datetime string
  userStatus: string;
  userStatusTrading: string;
  email: string;
  countryOfBirth: string;
  dateOfBirth: string; // ISO date string
  numberOfDependents: number;
  commercial: string;
  phones: Phones;
  residence: Address;
  mailing: Address;
  associations: string[];
  identityDocuments: IdentityDocument[];
  employmentType: string;
  employmentDetails?: EmploymentDetails;
}

export interface Phones {
  mobile?: string;
  [key: string]: string | undefined;
}

export interface Address {
  street1: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface IdentityDocument {
  name: string;
  id: string;
  country: string;
}

export interface EmploymentDetails {
  Employer: string;
  Occupation: string;
  EmployerBusiness: string;
  EmployerAddress: Address;
}

export interface FinancialInformation {
  currency: string;
  netWorth: string;
  liquidNetWorth: string;
  annualNetIncome: string;
  investmentExperience: Record<string, InvestmentExperience>;
}

export interface InvestmentExperience {
  knowledgeLevel: string;
  yearsTrading: string;
  tradesPerYear: string;
}

export interface SourceOfWealth {
  label: string;
  annual_percentage: number;
}

import LoadingComponent from '@/components/misc/LoadingComponent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  User,
  Users,            
  Info,             
  DollarSign,       
  CandlestickChart, 
  Briefcase,        
  TrendingUp,             
  Package,
  ListChecks,      
  ClipboardList,
} from 'lucide-react';
import { ReadAccountByAccountID, ReadAccountDetailsByAccountID } from '@/utils/entities/account';
import { toast } from '@/hooks/use-toast';
import { AccountPendingTasks } from './AccountPendingTasks';
import { AccountRegistrationTasks } from './AccountRegistrationTasks';
import AccountDocumentsCard from './AccountDocumentsCard';
import UserDialog from '../users/UserDialog';
import { ReadRiskProfiles } from '@/utils/tools/risk-profile';
import { RiskProfile } from '@/lib/tools/risk-profile';
import { ReadInvestmentProposalsByRiskProfile, ReadInvestmentProposalsByAccount } from '@/utils/tools/investment_proposals';
import { InvestmentProposal as InvestmentProposalType } from '@/lib/tools/investment-proposals';
import InvestmentProposal from '../../tools/investment-center/InvestmentProposal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable, ColumnDefinition } from '@/components/misc/DataTable'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { LabelValue } from '@/components/misc/LabelValue';

type Props = {
  accountId: string;
};

const AccountPage = ({ accountId }: Props) => {

  // Account
  const [internalAccount, setInternalAccount] = useState<AccountFromDB | null>(null)
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>();

  // User
  const [selectedUserID, setSelectedUserID] = useState<string | null>(null)

  // Risk Profiles and Investment Proposal state
  const [riskProfiles, setRiskProfiles] = useState<RiskProfile[] | null>(null)
  const [investmentProposals, setInvestmentProposals] = useState<InvestmentProposalType[] | null>(null)
  const [selectedRiskProfile, setSelectedRiskProfile] = useState<string | null>(null)
  const [selectedInvestmentProposal, setSelectedInvestmentProposal] = useState<InvestmentProposalType | null>(null)

  const refreshAccountDetails = async () => {
    try {
      const account = await ReadAccountByAccountID(accountId)
      if (!account) throw new Error('Account not found')
      setInternalAccount(account)
      const details = await ReadAccountDetailsByAccountID(account.ibkr_account_number)
      if (!details) throw new Error('Account details not found')
      setAccountDetails(details)
    } catch (e) {
      toast({
        title: 'Error',
        description: e instanceof Error ? e.message : 'Error fetching account details',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    refreshAccountDetails()
  }, [accountId])

  useEffect(() => {
    async function fetchRiskProfiles() {
      try {
        const all = await ReadRiskProfiles()
        if (!all) { setRiskProfiles([]); return }
        const currentAccountId = internalAccount?.id
        if (!currentAccountId) { setRiskProfiles([]); return }
        setRiskProfiles(all.filter(rp => rp.account_id === currentAccountId))
      } catch (e) {
        toast({ title: 'Error', description: 'Failed to fetch risk profiles', variant: 'destructive' })
      }
    }
    if (internalAccount?.id) fetchRiskProfiles()
  }, [internalAccount?.id])

  useEffect(() => {
    if (!riskProfiles || riskProfiles.length === 0) return
    setSelectedRiskProfile(riskProfiles[0].id)
  }, [riskProfiles])

  useEffect(() => {
    async function fetchProposals() {
      try {
        setInvestmentProposals([])
        setSelectedInvestmentProposal(null)
        if (selectedRiskProfile) {
          const proposals = await ReadInvestmentProposalsByRiskProfile(selectedRiskProfile)
          if (proposals && proposals.length > 0) {
            setInvestmentProposals(proposals)
            return
          }
        }
        const accountId = internalAccount?.id
        if (!accountId) return
        const byAccount = await ReadInvestmentProposalsByAccount(accountId)
        if (byAccount && byAccount.length > 0) {
          setInvestmentProposals(byAccount)
        }
      } catch (e) {
        toast({ title: 'Error', description: 'Failed to fetch investment proposals', variant: 'destructive' })
      }
    }
    if (selectedRiskProfile || internalAccount?.id) fetchProposals()
  }, [selectedRiskProfile, internalAccount?.id])

  if (!accountDetails || !internalAccount) return <LoadingComponent className='w-full h-full' />;

  const currentRiskProfile = riskProfiles?.find(rp => rp.id === selectedRiskProfile) || null

  const proposalColumns: ColumnDefinition<InvestmentProposalType>[] = [
    {
      header: 'Created',
      accessorKey: 'created',
    },
  ]
  
  const { 
    account,
    associatedPersons,
    financialInformation,
    sourcesOfWealth,
  } = accountDetails;

  if (!internalAccount || !accountDetails) return <LoadingComponent className='w-full h-full' />;
  
  return (
    <div className="flex flex-col gap-6">

      {/* Account Summary Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-bold">
            <Briefcase className="h-5 w-5 mr-2 text-primary" />
            Account Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <LabelValue label="Account ID" value={account.accountId} />
          <LabelValue label="Master Account ID" value={account.masterAccountId} />
          <LabelValue label="Account Title" value={account.accountTitle} />
          <LabelValue label="Email Address" value={account.emailAddress} />
          <LabelValue label="Base Currency" value={account.baseCurrency} />
          <LabelValue label="Margin Type" value={account.margin} /> 
          <LabelValue label="Account Type" value={account.applicantType} />
          <LabelValue label="Status" value={account.clearingStatusDescription} />
          {account.dateApproved && <LabelValue label="Date Approved" value={new Date(account.dateApproved).toLocaleDateString()} />}
          {account.dateFunded && <LabelValue label="Date Funded" value={new Date(account.dateFunded).toLocaleDateString()} />}
          {account.dateOpened && <LabelValue label="Date Opened" value={new Date(account.dateOpened).toLocaleDateString()} />}
        </CardContent>
      </Card>
      
      {associatedPersons?.map((person, idx) => (
        <Card key={person.entityId || idx} className="flex flex-col gap-2">
          <CardHeader>
            <CardTitle className="flex items-center"> 
              <User className="h-5 w-5 mr-2 text-primary" /> 
              {person.firstName} {person.lastName} ({person.associations?.join(', ') || 'No association'})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <LabelValue label="Username" value={person.username} />
            <LabelValue label="Status" value={person.userStatus} />
            <LabelValue label="Email" value={person.email} />
            <LabelValue label="Date of Birth" value={new Date(person.dateOfBirth).toLocaleDateString()} />
            <LabelValue label="Country of Birth" value={person.countryOfBirth} />
            <LabelValue label="Dependents" value={person.numberOfDependents?.toString()} />
            {person.phones?.mobile && <LabelValue label="Mobile Phone" value={person.phones.mobile} />}
            {person.employmentDetails && (
              <>
                <LabelValue label="Employer" value={person.employmentDetails.Employer} />
                <LabelValue label="Occupation" value={person.employmentDetails.Occupation} />
              </>
            )}
            {person.identityDocuments.map(doc => (
                <LabelValue key={doc.id} label={doc.name} value={`${doc.id}`} />
            ))}
          </CardContent>
        </Card>
      ))}
      
      {/* Risk Profiles & Investment Proposals Tab */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-bold">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Risk Profiles & Investment Proposals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {(!riskProfiles || riskProfiles.length === 0) ? (
            <p className="text-subtitle">No risk profiles for this account.</p>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Select value={selectedRiskProfile || undefined} onValueChange={setSelectedRiskProfile}>
                  <SelectTrigger className="w-[260px]">
                    <SelectValue placeholder="Select risk profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {riskProfiles.map(rp => (
                      <SelectItem key={rp.id} value={rp.id}>
                        Score: {rp.score}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentRiskProfile && investmentProposals && (
                <div className="flex flex-col gap-2">
                  <DataTable
                    data={investmentProposals}
                    columns={proposalColumns as ColumnDefinition<any>[]}
                    enableRowActions
                    rowActions={[
                      {
                        label: 'View',
                        onClick: (row: InvestmentProposalType) => setSelectedInvestmentProposal(row),
                      },
                    ]}
                  />
                </div>
              )}

              {selectedInvestmentProposal && currentRiskProfile && (
                <Dialog open={!!selectedInvestmentProposal} onOpenChange={(open) => {
                      if (!open) setSelectedInvestmentProposal(null)
                    }}>
                  <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                    <InvestmentProposal riskProfile={currentRiskProfile} investmentProposal={selectedInvestmentProposal} />
                  </DialogContent>
                </Dialog>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Documents Tab */}
      <AccountDocumentsCard 
        documents={(accountDetails as any).documents || []}
        accountId={internalAccount?.id || null}
        accountTitle={account.accountTitle}
        onRefresh={refreshAccountDetails}
      />

      {/* Internal Account Data Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-bold">
            <Info className="h-5 w-5 mr-2 text-primary" />
            Account Internals
          </CardTitle>
          <CardDescription>Internal account tracking information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <LabelValue label="Internal Account ID" value={internalAccount.id} />
              <LabelValue label="Application ID" value={internalAccount.application_id} />
              <LabelValue label="User ID" value={internalAccount.user_id || '-'} />
              <LabelValue label="Fee Template" value={internalAccount.fee_template || '-'} />
            </div>

            <div className="space-y-3">
              <LabelValue label="IBKR Account Number" value={internalAccount.ibkr_account_number} />
              <LabelValue label="IBKR Username" value={internalAccount.ibkr_username || '-'} />
              <LabelValue label="IBKR Password" value={internalAccount.ibkr_password || '-'} />
              <LabelValue label="Temporal Email" value={internalAccount.temporal_email || '-'} />
              <LabelValue label="Temporal Password" value={internalAccount.temporal_password || '-'} />
            </div>
          </div>
        </CardContent>
      </Card>


        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-4 w-fit overflow-x-auto whitespace-nowrap justify-start sm:justify-center">
            <TabsTrigger value="pending"><Users className="mr-2 h-4 w-4" />Pending Tasks</TabsTrigger>
            {account.clearingStatus === 'O' && (
              <>
                <TabsTrigger value="financial"><DollarSign className="mr-2 h-4 w-4" />Financial Profile</TabsTrigger>
                <TabsTrigger value="trading"><CandlestickChart className="mr-2 h-4 w-4" />Trading</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="pending">
            <AccountPendingTasks accountId={account.accountId} accountTitle={account.accountTitle} />
          </TabsContent>

          {account.clearingStatus === 'O' && (
            <div>
              {/* Financial Profile Tab - Only for open accounts */}
              <TabsContent value="financial">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center"><TrendingUp className="h-5 w-5 mr-2 text-primary"/>Financial Profile</CardTitle>
                    <CardDescription>Currency: {financialInformation.currency}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-lg font-semibold text-foreground">Worths</p>
                      <LabelValue label="Net Worth" value={financialInformation.netWorth} />
                      <LabelValue label="Liquid Net Worth" value={financialInformation.liquidNetWorth} />
                      <LabelValue label="Annual Net Income" value={financialInformation.annualNetIncome} />
                    </div>
                      {financialInformation.investmentExperience?.STK && (
                        <div className="flex flex-col gap-2">
                          <p className="text-lg font-semibold text-foreground">Investment Experience</p>
                          <p className="text-sm font-semibold">Stocks</p>
                          <LabelValue label="Knowledge Level" value={financialInformation.investmentExperience.STK.knowledgeLevel} />
                          <LabelValue label="Years Trading" value={financialInformation.investmentExperience.STK.yearsTrading} />
                          <LabelValue label="Trades Per Year" value={financialInformation.investmentExperience.STK.tradesPerYear} />
                        </div>
                      )}
                      {financialInformation.investmentExperience?.BOND && (
                        <div className="flex flex-col gap-2">
                          <p className="text-sm font-semibold">Bonds</p>
                          <LabelValue label="Knowledge Level" value={financialInformation.investmentExperience.BOND.knowledgeLevel} />
                          <LabelValue label="Years Trading" value={financialInformation.investmentExperience.BOND.yearsTrading} />
                          <LabelValue label="Trades Per Year" value={financialInformation.investmentExperience.BOND.tradesPerYear} />
                        </div>
                      )}
                      {sourcesOfWealth?.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <p className="text-lg font-semibold text-foreground">Sources of Wealth</p>
                        <div className="flex flex-col gap-2">
                          {sourcesOfWealth.map(source => (
                            <LabelValue key={source.label} label={source.label} value={`${source.annual_percentage}%`} />
                          ))}
                        </div>
                      </div>
                    )}  
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Trading Tab - Only for open accounts */}
              <TabsContent value="trading">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center"><Package className="h-5 w-5 mr-2 text-primary"/>Trading Permissions & Bundles</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-lg font-semibold text-foreground">Capabilities</p>
                      {account.capabilities.approved?.length > 0 && (
                          <LabelValue label="Approved" value={account.capabilities.approved.join(', ')} />
                      )}
                      {account.capabilities.requested?.length > 0 && (
                        <LabelValue label="Requested" value={account.capabilities.requested.join(', ')} />
                      )}
                      {account.capabilities.activated?.length > 0 && (
                        <LabelValue label="Activated" value={account.capabilities.activated.join(', ')} />
                      )}
                    </div>

                    {/* Market Data Subscriptions */}
                    {accountDetails.marketData && accountDetails.marketData.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <p className="text-lg font-semibold text-foreground">Market Data Subscriptions</p>
                        {accountDetails.marketData.map(md => (
                          <p className="text-sm text-subtitle">{md.serviceName}</p>
                        ))}
                      </div>
                    )}

                    {/* Trade Bundles */}
                    {accountDetails.tradeBundles && accountDetails.tradeBundles.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <p className="text-lg font-semibold text-foreground">Trade Bundles</p>
                        <p className="text-sm text-subtitle">{accountDetails.tradeBundles.join(', ')}</p>
                      </div>
                    )}

                    {/* Restrictions */}
                    {accountDetails.restrictions && accountDetails.restrictions.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <p className="text-lg font-semibold text-foreground">Restrictions</p>
                        <div className="flex flex-col gap-2">
                          {accountDetails.restrictions.map(res => (
                            <p className="text-sm text-subtitle">{res.name}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          )}

        </Tabs>

      <UserDialog 
        userID={selectedUserID}
        isOpen={!!selectedUserID}
        onOpenChange={() => setSelectedUserID(null)}
      />
    </div>
  )
}

export default AccountPage