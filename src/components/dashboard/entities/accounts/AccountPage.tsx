'use client'
import React, { useEffect, useState } from 'react';
import { Account as AccountFromDB } from '@/lib/entities/account';

// --- Account Details Types ---

export interface AccountDetails {
  account: Account;
  associatedPersons: AssociatedPerson[];
  financialInformation: FinancialInformation;
  sourcesOfWealth: SourceOfWealth[];
  documents?: any[];
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

// --- End Account Details Types ---

import DashboardPage from '@/components/misc/DashboardPage';
import LoadingComponent from '@/components/misc/LoadingComponent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Added CardDescription
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Receipt,
  User,
  Users,            
  Info,             
  DollarSign,       
  CandlestickChart, 
  BarChartBig,      
  ShieldAlert,      
  Briefcase,        
  CalendarDays,     
  Mail,             
  Building,         
  Landmark,         
  FileBadge,        
  BookUser,         
  CircleDollarSign, 
  TrendingUp,       
  ShieldCheck,      
  ListTree,         
  Package,
  AlertTriangle,    
  ListChecks,      
  ClipboardList
} from 'lucide-react';
import { ReadAccountByAccountID, ReadAccountDetailsByAccountID } from '@/utils/entities/account';
import { toast } from '@/hooks/use-toast';
import { AccountPendingTasks } from './AccountPendingTasks';
import { AccountRegistrationTasks } from './AccountRegistrationTasks';
import AccountDocumentsCard from './AccountDocumentsCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, Edit, Save, X } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { formatURL } from '@/utils/language/lang';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  accountId: string;
};

export const DetailItem = ({ label, value, icon: Icon }: { label: string; value?: React.ReactNode; icon?: React.ElementType }) => {
  if (value === null || typeof value === 'undefined' || value === '') return null;
  return (
    <div className="flex flex-col py-1">
      <p className="text-md text-foreground flex items-center">
        {Icon && <Icon className="h-3 w-3 mr-1.5" />} 
        {label}
      </p>
      {typeof value === 'string' || typeof value === 'number' ? (
        <p className="text-sm text-subtitle">{value}</p>
      ) : (
        value
      )}
    </div>
  );
};

export const EditableDetailItem = ({ 
  label, 
  value, 
  field, 
  isEditing, 
  editValue, 
  isUpdating, 
  onStartEdit, 
  onCancelEdit, 
  onSaveEdit, 
  onEditValueChange,
  type = "text",
  icon: Icon 
}: { 
  label: string; 
  value?: string | null; 
  field: string;
  isEditing: boolean;
  editValue: string;
  isUpdating: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditValueChange: (value: string) => void;
  type?: string;
  icon?: React.ElementType;
}) => {
  return (
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <span className="font-medium text-foreground min-w-[140px] flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        {label}:
      </span>
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            type={type}
            value={editValue}
            onChange={(e) => onEditValueChange(e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            className="w-[200px] h-8"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={onSaveEdit}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancelEdit}
            disabled={isUpdating}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-subtitle">
            {value || "—"}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={onStartEdit}
            className="h-auto p-1"
          >
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

const AccountPage = ({ accountId }: Props) => {
  const router = useRouter();
  const { lang } = useTranslationProvider();

  const [internalAccount, setInternalAccount] = useState<AccountFromDB | null>(null)
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
  
  // State for editing internal account data
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const [isUpdating, setIsUpdating] = useState<{ [key: string]: boolean }>({});

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

  const handleStartEdit = (field: string, currentValue: string | null) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
    setEditValues(prev => ({ ...prev, [field]: currentValue || '' }));
  };

  const handleCancelEdit = (field: string) => {
    setIsEditing(prev => ({ ...prev, [field]: false }));
    setEditValues(prev => ({ ...prev, [field]: '' }));
  };

  const handleSaveEdit = async (field: string) => {
    if (!internalAccount) return;
    
    const newValue = editValues[field];
    
    try {
      setIsUpdating(prev => ({ ...prev, [field]: true }));
      
      // Create the full account payload with updated field
      const accountPayload = {
        ibkr_account_number: field === 'ibkr_account_number' ? (newValue || null) : internalAccount.ibkr_account_number,
        ibkr_username: field === 'ibkr_username' ? (newValue || null) : internalAccount.ibkr_username,
        ibkr_password: field === 'ibkr_password' ? (newValue || null) : internalAccount.ibkr_password,
        temporal_email: field === 'temporal_email' ? (newValue || null) : internalAccount.temporal_email,
        temporal_password: field === 'temporal_password' ? (newValue || null) : internalAccount.temporal_password,
      };
      
      //await UpdateAccountByID(internalAccount.id, accountPayload);
      
      // Update local state
      setInternalAccount(prev => prev ? {
        ...prev,
        [field]: newValue || null
      } : null);
      
      setIsEditing(prev => ({ ...prev, [field]: false }));
      setEditValues(prev => ({ ...prev, [field]: '' }));
      
      toast({
        title: "Account Updated",
        description: `${field.replace('_', ' ')} has been updated successfully.`,
        variant: "success",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update ${field.replace('_', ' ')}.`,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(prev => ({ ...prev, [field]: false }));
    }
  };



  useEffect(() => {
    refreshAccountDetails()
  }, [accountId])

  if (!accountDetails) return <LoadingComponent className='w-full h-full' />;

  const { 
    account,
    associatedPersons,
    financialInformation,
    sourcesOfWealth,
  } = accountDetails;

  if (!account) return <LoadingComponent className='w-full h-full' />;

  return (
    <div>
      {/* Account Summary Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-bold">
            <Briefcase className="h-5 w-5 mr-2 text-primary" />
            Account Summary
          </CardTitle>
          <CardDescription>{account.subType}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          <DetailItem label="Account ID" value={account.accountId} icon={Info} />
          <DetailItem label="Master Account ID" value={account.masterAccountId} icon={Info} />
          <DetailItem label="Account Title" value={account.accountTitle} icon={User} />
          <DetailItem label="Email Address" value={account.emailAddress} icon={Mail} />
          <DetailItem label="Base Currency" value={account.baseCurrency} icon={CircleDollarSign} />
          <DetailItem label="Margin Type" value={account.margin} icon={Landmark} /> 
          <DetailItem label="Applicant Type" value={account.applicantType} icon={User} />
          <DetailItem label="Clearing Status" value={account.clearingStatusDescription} icon={ShieldCheck} />
          <DetailItem label="Date Application Began" value={new Date(account.dateBegun).toLocaleDateString()} icon={CalendarDays} />
          <DetailItem label="MIFID Category" value={account.mifidCategory} icon={FileBadge} />
          <DetailItem label="Process Type" value={account.processType} icon={ListTree} />
          <DetailItem label="External ID" value={account.externalId} icon={FileBadge} />
        </CardContent>
      </Card>

      {/* Internal Account Data Card */}
      {internalAccount && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-bold">
              <Info className="h-5 w-5 mr-2 text-primary" />
              Internal Account Data
            </CardTitle>
            <CardDescription>Editable internal account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <EditableDetailItem
                  label="IBKR Account Number"
                  value={internalAccount.ibkr_account_number}
                  field="ibkr_account_number"
                  isEditing={isEditing.ibkr_account_number || false}
                  editValue={editValues.ibkr_account_number || ''}
                  isUpdating={isUpdating.ibkr_account_number || false}
                  onStartEdit={() => handleStartEdit('ibkr_account_number', internalAccount.ibkr_account_number)}
                  onCancelEdit={() => handleCancelEdit('ibkr_account_number')}
                  onSaveEdit={() => handleSaveEdit('ibkr_account_number')}
                  onEditValueChange={(value) => setEditValues(prev => ({ ...prev, ibkr_account_number: value }))}
                  icon={Briefcase}
                />

                <EditableDetailItem
                  label="IBKR Username"
                  value={internalAccount.ibkr_username}
                  field="ibkr_username"
                  isEditing={isEditing.ibkr_username || false}
                  editValue={editValues.ibkr_username || ''}
                  isUpdating={isUpdating.ibkr_username || false}
                  onStartEdit={() => handleStartEdit('ibkr_username', internalAccount.ibkr_username)}
                  onCancelEdit={() => handleCancelEdit('ibkr_username')}
                  onSaveEdit={() => handleSaveEdit('ibkr_username')}
                  onEditValueChange={(value) => setEditValues(prev => ({ ...prev, ibkr_username: value }))}
                  icon={User}
                />

                <EditableDetailItem
                  label="IBKR Password"
                  value={internalAccount.ibkr_password ? "••••••••" : null}
                  field="ibkr_password"
                  isEditing={isEditing.ibkr_password || false}
                  editValue={editValues.ibkr_password || ''}
                  isUpdating={isUpdating.ibkr_password || false}
                  onStartEdit={() => handleStartEdit('ibkr_password', '')}
                  onCancelEdit={() => handleCancelEdit('ibkr_password')}
                  onSaveEdit={() => handleSaveEdit('ibkr_password')}
                  onEditValueChange={(value) => setEditValues(prev => ({ ...prev, ibkr_password: value }))}
                  type="password"
                  icon={ShieldCheck}
                />

                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <span className="font-medium text-foreground min-w-[140px] flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Fee Template:
                  </span>
                  <span className="text-subtitle">
                    {internalAccount.fee_template || "—"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <EditableDetailItem
                  label="Temporal Email"
                  value={internalAccount.temporal_email}
                  field="temporal_email"
                  isEditing={isEditing.temporal_email || false}
                  editValue={editValues.temporal_email || ''}
                  isUpdating={isUpdating.temporal_email || false}
                  onStartEdit={() => handleStartEdit('temporal_email', internalAccount.temporal_email)}
                  onCancelEdit={() => handleCancelEdit('temporal_email')}
                  onSaveEdit={() => handleSaveEdit('temporal_email')}
                  onEditValueChange={(value) => setEditValues(prev => ({ ...prev, temporal_email: value }))}
                  type="email"
                  icon={Mail}
                />

                <EditableDetailItem
                  label="Temporal Password"
                  value={internalAccount.temporal_password ? "••••••••" : null}
                  field="temporal_password"
                  isEditing={isEditing.temporal_password || false}
                  editValue={editValues.temporal_password || ''}
                  isUpdating={isUpdating.temporal_password || false}
                  onStartEdit={() => handleStartEdit('temporal_password', '')}
                  onCancelEdit={() => handleCancelEdit('temporal_password')}
                  onSaveEdit={() => handleSaveEdit('temporal_password')}
                  onEditValueChange={(value) => setEditValues(prev => ({ ...prev, temporal_password: value }))}
                  type="password"
                  icon={ShieldCheck}
                />

                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <span className="font-medium text-foreground min-w-[140px] flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Application ID:
                  </span>
                  {internalAccount.application_id ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-primary hover:text-primary/80"
                      onClick={() => redirect(formatURL(`/dashboard/applications/${internalAccount.application_id}`, lang))}
                    >
                      {internalAccount.application_id}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  ) : (
                    <span className="text-subtitle">—</span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <span className="font-medium text-foreground min-w-[140px] flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Account ID:
                  </span>
                  <span className="font-mono text-sm text-subtitle">{internalAccount.id}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="persons" className="w-full">
        <TabsList className="mb-4 w-fit overflow-x-auto whitespace-nowrap justify-start sm:justify-center">
          <TabsTrigger value="persons"><Users className="mr-2 h-4 w-4" />Associated Persons ({associatedPersons?.length || 0})</TabsTrigger>
          {account.clearingStatus === 'O' && (
            <>
              <TabsTrigger value="financial"><DollarSign className="mr-2 h-4 w-4" />Financial Profile</TabsTrigger>
              <TabsTrigger value="trading"><CandlestickChart className="mr-2 h-4 w-4" />Trading</TabsTrigger>
              <TabsTrigger value="documents"><FileText className="mr-2 h-4 w-4" />Documents</TabsTrigger>
            </>
          )}
          <TabsTrigger value="registrationTasks"><ListChecks className="mr-2 h-4 w-4" />Registration Tasks</TabsTrigger>
          <TabsTrigger value="pendingTasks"><ClipboardList className="mr-2 h-4 w-4" />Pending Tasks</TabsTrigger>
        </TabsList>

        {/* Associated Persons Tab */}
        <TabsContent value="persons">
          {associatedPersons?.map((person, idx) => (
            <Card key={person.entityId || idx} className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center"> 
                  <User className="h-5 w-5 mr-2 text-primary" /> 
                  {person.firstName} {person.lastName} ({person.associations?.join(', ') || 'No association'})
                </CardTitle>
                <CardDescription>
                  {person.username ? `Username: ${person.username}` : 'No username'} 
                  {person.userStatus ? ` | Status: ${person.userStatus}` : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-3">
                
                <div>
                  <div className="flex flex-col">
                    <p className="text-md font-semibold text-foreground">Personal Information</p>
                    <DetailItem label="Email" value={person.email} icon={Mail} />
                    <DetailItem label="Date of Birth" value={new Date(person.dateOfBirth).toLocaleDateString()} icon={CalendarDays} />
                    <DetailItem label="Country of Birth" value={person.countryOfBirth} />
                    <DetailItem label="Number of Dependents" value={person.numberOfDependents?.toString()} />
                    <DetailItem label="Commercial" value={person.commercial} />
                    <DetailItem label="User Status (Trading)" value={person.userStatusTrading} icon={ShieldCheck} />
                    {person.phones?.mobile && <DetailItem label="Mobile Phone" value={person.phones.mobile} />}
                  </div>
                </div>

                {person.employmentDetails && (
                  <div className="flex flex-col">
                    <p className="text-md font-semibold text-foreground">Employment ({person.employmentType})</p>
                    <DetailItem label="Employer" value={person.employmentDetails.Employer} icon={Building} />
                    <DetailItem label="Occupation" value={person.employmentDetails.Occupation} />
                  </div>
                )}

                {person.identityDocuments?.length > 0 && (
                  <div className="flex flex-col">
                    <p className="text-md font-semibold text-foreground">Identity Documents</p>
                    {person.identityDocuments.map(doc => (
                        <p key={doc.id}>{doc.name} ({doc.country}): {doc.id}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {(!associatedPersons || associatedPersons.length === 0) && <p className="text-muted-foreground">No associated persons found for this account.</p>}
        </TabsContent>

        {/* Financial Profile Tab - Only for open accounts */}
        {account.clearingStatus === 'O' && (
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><TrendingUp className="h-5 w-5 mr-2 text-primary"/>Financial Profile</CardTitle>
                <CardDescription>Currency: {financialInformation.currency}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">

                <div className="flex flex-col justify-start items-start">
                  <p className="text-lg font-semibold text-foreground">Worths</p>
                  <DetailItem label="Net Worth" value={financialInformation.netWorth} icon={DollarSign}/>
                  <DetailItem label="Liquid Net Worth" value={financialInformation.liquidNetWorth} icon={DollarSign}/>
                  <DetailItem label="Annual Net Income" value={financialInformation.annualNetIncome} icon={DollarSign}/>
                </div>
                
                <div className="flex flex-col justify-start items-start">
                  <p className="text-lg font-semibold text-foreground">Investment Experience</p>
                  {financialInformation.investmentExperience?.STK && (
                    <div>
                      <p className="text-sm font-semibold">Stocks</p>
                      <DetailItem label="Knowledge Level" value={financialInformation.investmentExperience.STK.knowledgeLevel} />
                      <DetailItem label="Years Trading" value={financialInformation.investmentExperience.STK.yearsTrading} />
                      <DetailItem label="Trades Per Year" value={financialInformation.investmentExperience.STK.tradesPerYear} />
                    </div>
                  )}
                  {financialInformation.investmentExperience?.BOND && (
                    <div>
                      <p className="text-sm font-semibold">Bonds</p>
                      <DetailItem label="Knowledge Level" value={financialInformation.investmentExperience.BOND.knowledgeLevel} />
                      <DetailItem label="Years Trading" value={financialInformation.investmentExperience.BOND.yearsTrading} />
                      <DetailItem label="Trades Per Year" value={financialInformation.investmentExperience.BOND.tradesPerYear} />
                    </div>
                  )}
                  {(!financialInformation.investmentExperience?.STK && !financialInformation.investmentExperience?.BOND) && (
                    <p className="text-sm text-muted-foreground">No investment experience information available.</p>
                  )}
                </div>

                {sourcesOfWealth?.length > 0 && (
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold text-foreground">Sources of Wealth</p>
                    <div className="flex flex-wrap gap-1">
                      {sourcesOfWealth.map(source => (
                        <p key={source.label}>
                          {source.label} - {source.annual_percentage}%
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Trading Tab - Only for open accounts */}
        {account.clearingStatus === 'O' && (
          <TabsContent value="trading">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Package className="h-5 w-5 mr-2 text-primary"/>Trading Permissions & Bundles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailItem label="Limited Option Trading" value={account.limitedOptionTrading} icon={AlertTriangle}/>
                <div>
                  <p className="text-md font-semibold mb-1 text-muted-foreground">Capabilities</p>
                  <div className="space-y-2 mt-1">
                    {account.capabilities.approved?.length > 0 && (
                      <DetailItem label="Approved" value={account.capabilities.approved.map(c => <p key={c}>{c}</p>)} />
                    )}
                    {account.capabilities.requested?.length > 0 && (
                      <DetailItem label="Requested" value={account.capabilities.requested.map(c => <p key={c}>{c}</p>)} />
                    )}
                    {account.capabilities.activated?.length > 0 && (
                      <DetailItem label="Activated" value={account.capabilities.activated.map(c => <p key={c}>{c}</p>)} />
                    )}
                    {(!account.capabilities.approved?.length && !account.capabilities.requested?.length && !account.capabilities.activated?.length) && (
                      <p className="text-sm text-muted-foreground">No capabilities information available.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Documents Tab - Only for open accounts */}
        {account.clearingStatus === 'O' && (
          <TabsContent value="documents">
            <AccountDocumentsCard 
              documents={(accountDetails as any).documents || []}
              accountId={internalAccount?.id || null}
              accountTitle={account.accountTitle}
              onRefresh={refreshAccountDetails}
            />
          </TabsContent>
        )}

        {/* Registration Tasks Tab */}
        <TabsContent value="registrationTasks">
          <AccountRegistrationTasks accountId={accountId} />
        </TabsContent>

        {/* Pending Tasks Tab */}
        <TabsContent value="pendingTasks">
          <AccountPendingTasks accountId={account.accountId} accountTitle={account.accountTitle} />
        </TabsContent>

      </Tabs>
    </div>
  )
}

export default AccountPage