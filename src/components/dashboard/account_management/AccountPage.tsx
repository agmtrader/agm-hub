import DashboardPage from '@/components/misc/DashboardPage'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { Account } from '@/lib/entities/account'
import { ReadAccountByAccountNumber } from '@/utils/entities/account'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  BellRing, 
  Building2, 
  CreditCard,
  FileText, 
  FileBarChart, 
  FileCheck, 
  PiggyBank, 
  Receipt, 
  ShieldAlert,
  User,
  FileType,
  DollarSign,
  CalendarClock,
  ClipboardList,
  AlertCircle
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

type Props = {
  accountId: string
}

// Mock data for the dashboard
const pendingTasks = [
  { id: 1, title: 'Complete W-8BEN Form', due: '2023-12-15', priority: 'high' },
  { id: 2, title: 'Verify bank account details', due: '2023-12-10', priority: 'medium' },
  { id: 3, title: 'Review margin requirements', due: '2023-12-18', priority: 'low' },
]

const recentTransactions = [
  { id: 1, type: 'deposit', amount: 5000, date: '2023-12-01', status: 'completed' },
  { id: 2, type: 'withdrawal', amount: 2000, date: '2023-11-28', status: 'pending' },
  { id: 3, type: 'deposit', amount: 10000, date: '2023-11-15', status: 'completed' },
]

const availableForms = [
  { id: 1, name: 'W-8BEN', type: 'tax', status: 'pending' },
  { id: 2, name: 'W-9', type: 'tax', status: 'completed' },
  { id: 3, name: 'Form 1099', type: 'tax', status: 'available' },
  { id: 4, name: 'November Statement', type: 'statement', status: 'available' },
  { id: 5, name: 'October Statement', type: 'statement', status: 'available' },
  { id: 6, name: 'Q3 Fee Summary', type: 'commission', status: 'available' },
]

const bankAccounts = [
  { id: 1, name: 'Primary Checking', number: '****1234', type: 'ACH' },
  { id: 2, name: 'Savings Account', number: '****5678', type: 'Wire' },
]

const AccountPage = ({accountId}: Props) => {
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function handleFetchData() {
      try {
        const account = await ReadAccountByAccountNumber(accountId)
        if (!account) {
          throw new Error('Account not found')
        }
        setAccount(account)
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }
    handleFetchData()
  }, [accountId])

  if (loading || !account) return <LoadingComponent className='w-full h-full' />

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>
      case 'low':
        return <Badge variant="outline">Low</Badge>
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500">Completed</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'available':
        return <Badge variant="outline">Available</Badge>
      default:
        return null
    }
  }

  return (
    <DashboardPage 
      title="Account Management" 
      description={`Managing IBKR Account ${accountId}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Account Summary Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-medium">Account Summary</CardTitle>
            <User className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-subtitle">Account Number</p>
                <p className="text-lg font-semibold">{accountId}</p>
              </div>
              <div>
                <p className="text-sm text-subtitle">Account Type</p>
                <p className="text-lg font-semibold">Individual</p>
              </div>
              <div>
                <p className="text-sm text-subtitle">Status</p>
                <Badge className="bg-emerald-500">Active</Badge>
              </div>
              <div>
                <p className="text-sm text-subtitle">Email</p>
                <p className="text-lg font-semibold">{account?.TemporalEmail || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              View Account Details
            </Button>
          </CardFooter>
        </Card>

        {/* Pending Tasks Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-medium">Pending Tasks</CardTitle>
            <ClipboardList className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-subtitle">Due: {task.due}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(task.priority)}
                    <Button variant="outline" size="sm">
                      Complete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">
              <BellRing className="mr-2 h-4 w-4" />
              View All Notifications
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="funds" className="w-full">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="funds">
            <PiggyBank className="mr-2 h-4 w-4" />
            Funds & Banking
          </TabsTrigger>
          <TabsTrigger value="transfers">
            <CreditCard className="mr-2 h-4 w-4" />
            Deposits & Withdrawals
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Tax & Documents
          </TabsTrigger>
          <TabsTrigger value="commissions">
            <Receipt className="mr-2 h-4 w-4" />
            Commissions
          </TabsTrigger>
        </TabsList>

        {/* Funds & Banking Tab */}
        <TabsContent value="funds" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Fund Balances</CardTitle>
                <CardDescription>View your current balances and margin details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-subtitle">Net Liquidation Value</span>
                    <span className="font-semibold">$125,750.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-subtitle">Cash Balance</span>
                    <span className="font-semibold">$32,450.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-subtitle">Available for Trading</span>
                    <span className="font-semibold">$28,750.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-subtitle">Available for Withdrawal</span>
                    <span className="font-semibold">$28,750.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-subtitle">Maintenance Margin</span>
                    <span className="font-semibold">$15,200.00</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <FileBarChart className="mr-2 h-4 w-4" />
                  View Detailed Margin Report
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Linked Bank Accounts</CardTitle>
                <CardDescription>Manage your linked banking details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bankAccounts.map(bank => (
                    <div key={bank.id} className="p-3 bg-muted rounded-lg flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-secondary" />
                        <div>
                          <p className="font-medium">{bank.name}</p>
                          <p className="text-sm text-subtitle">{bank.number} • {bank.type}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Manage</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Building2 className="mr-2 h-4 w-4" />
                  Add New Bank Account
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Transfers Tab */}
        <TabsContent value="transfers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Transfer Funds</CardTitle>
                <CardDescription>Deposit or withdraw funds from your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="flex flex-col items-center justify-center py-6 h-auto">
                    <ArrowDownToLine className="h-8 w-8 mb-2" />
                    <span>Deposit Funds</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center py-6 h-auto">
                    <ArrowUpFromLine className="h-8 w-8 mb-2" />
                    <span>Withdraw Funds</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Transactions</CardTitle>
                <CardDescription>View your recent deposit and withdrawal activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map(tx => (
                    <div key={tx.id} className="p-3 bg-muted rounded-lg flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {tx.type === 'deposit' 
                          ? <ArrowDownToLine className="h-5 w-5 text-emerald-500" /> 
                          : <ArrowUpFromLine className="h-5 w-5 text-primary" />}
                        <div>
                          <p className="font-medium capitalize">{tx.type}</p>
                          <p className="text-sm text-subtitle">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${tx.amount.toLocaleString()}</p>
                        {getStatusBadge(tx.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  <CalendarClock className="mr-2 h-4 w-4" />
                  View Transaction History
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">Tax Forms</CardTitle>
                <FileCheck className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableForms.filter(form => form.type === 'tax').map(form => (
                    <div key={form.id} className="p-3 bg-muted rounded-lg flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <FileType className="h-5 w-5 text-secondary" />
                        <p className="font-medium">{form.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(form.status)}
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">Statements</CardTitle>
                <FileText className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableForms.filter(form => form.type === 'statement').map(form => (
                    <div key={form.id} className="p-3 bg-muted rounded-lg flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-secondary" />
                        <p className="font-medium">{form.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(form.status)}
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  View All Statements
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">Security</CardTitle>
                <ShieldAlert className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-subtitle mb-2">Enhance your account security</p>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">Login Notifications</p>
                    <p className="text-sm text-subtitle mb-2">Get notified of login attempts</p>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">Device Management</p>
                    <p className="text-sm text-subtitle">Manage trusted devices</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  Security Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Commissions Tab */}
        <TabsContent value="commissions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Commission Schedule</CardTitle>
                <CardDescription>View your current commission rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-subtitle">U.S. Stocks</span>
                    <span className="font-semibold">$0.005 per share</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-subtitle">Options</span>
                    <span className="font-semibold">$0.65 per contract</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-subtitle">Futures</span>
                    <span className="font-semibold">$0.85 per contract</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-subtitle">Forex</span>
                    <span className="font-semibold">0.20 basis points</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-subtitle">Mutual Funds</span>
                    <span className="font-semibold">$14.95 per trade</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Commission Summary</CardTitle>
                <CardDescription>Year-to-date commissions paid</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold">$3,245.75</p>
                    <p className="text-sm text-subtitle">Total commissions (YTD)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-subtitle">Stocks</span>
                      <span className="font-semibold">$1,865.32</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-subtitle">Options</span>
                      <span className="font-semibold">$962.80</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-subtitle">Futures</span>
                      <span className="font-semibold">$417.63</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <DollarSign className="mr-2 h-4 w-4" />
                  View Detailed Commission Report
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Commission History</CardTitle>
              <CardDescription>View commissions by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableForms.filter(form => form.type === 'commission').map(form => (
                  <div key={form.id} className="p-3 bg-muted rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Receipt className="h-5 w-5 text-secondary" />
                      <p className="font-medium">{form.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(form.status)}
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardPage>
  )
}

export default AccountPage