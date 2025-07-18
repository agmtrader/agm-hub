"use client"
import { useEffect, useState } from "react"
import RiskProfile from "@/components/dashboard/tools/risk/RiskProfile"
import { AccountRiskProfile, RiskProfile as RiskProfileType } from "@/lib/tools/risk-profile"
import { useToast } from "@/hooks/use-toast"
import LoadingComponent from "@/components/misc/LoadingComponent"
import DashboardPage from "@/components/misc/DashboardPage"
import { ListRiskProfiles, ReadAccountRiskProfiles } from "@/utils/tools/risk-profile"
//import { riskProfiles as riskProfilesDictionary } from "@/lib/tools/risk-profile"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Account } from "@/lib/entities/account"
import { ReadAccounts } from "@/utils/entities/account"

const RiskCenter = () => {

  const [accountRiskProfiles, setAccountRiskProfiles] = useState<AccountRiskProfile[] | null>(null)
  const [accounts, setAccounts] = useState<Account[] | null>(null)
  const [riskProfiles, setRiskProfiles] = useState<RiskProfileType[] | null>(null)

  const [accountRiskProfile, setAccountRiskProfile] = useState<AccountRiskProfile | null>(null)

  const { toast } = useToast()

  useEffect(() => {

    async function fetchData () {

      try {

        const riskProfiles = await ListRiskProfiles()
        const accountRiskProfiles = await ReadAccountRiskProfiles()
        const accounts = await ReadAccounts()
        setAccountRiskProfiles(accountRiskProfiles)
        setAccounts(accounts)
        setRiskProfiles(riskProfiles)

      } catch (error:any) {

        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })

      }

    }

    fetchData()

  }, [])

  if (!accountRiskProfiles || !accounts || !riskProfiles) return <LoadingComponent className="h-full w-full"/>

  return (

    <DashboardPage title='Risk Center' description='View risk profiles and associated accounts'>

    <div className="flex flex-col gap-20">
      <div className="flex w-96 gap-x-5">
        <Select
          value={accountRiskProfile?.id.toString()}
          onValueChange={(value) => {
            const selected = accountRiskProfiles.find((profile) => profile.id.toString() === value)
            setAccountRiskProfile(selected || null)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an account" />
          </SelectTrigger>
          <SelectContent>
            {accountRiskProfiles.map((accountRiskProfile) => (
              <SelectItem key={accountRiskProfile.id} value={accountRiskProfile.id.toString()}>
                {accounts.find((account) => account.id === accountRiskProfile.account_id)?.ibkr_account_number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {accountRiskProfile && (
        (() => {
          const riskProfile = riskProfiles?.find(profile => profile.id === parseInt(accountRiskProfile.risk_profile_id.toString()))
          return riskProfile ? <RiskProfile riskProfile={riskProfile} /> : (
            <div className="text-center text-subtitle">
              <p>Risk profile not found for ID: {accountRiskProfile.risk_profile_id}</p>
            </div>
          )
        })()
      )}

      </div>

    </DashboardPage>  

  )
  
}

export default RiskCenter