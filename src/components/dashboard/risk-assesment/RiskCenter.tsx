"use client"
import { useEffect, useState } from "react"
import RiskProfile from "@/components/dashboard/risk-assesment/RiskProfile"
import { RiskProfile as RiskProfileType } from "@/lib/entities/risk-profile"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import LoadingComponent from "@/components/misc/LoadingComponent"
import DashboardPage from "@/components/misc/DashboardPage"
import { ReadAccountByAccountNumber } from "@/utils/entities/account"
import { Account } from "@/lib/entities/account"
import { ReadRiskProfiles } from "@/utils/entities/risk-profile"

const RiskCenter = () => {

  const [riskProfiles, setRiskProfiles] = useState<any[] | null>(null)
  const [selectedProfileID, setSelectedProfileID] = useState<string | null>(null)

  const [riskProfile, setRiskProfile] = useState<RiskProfileType | null>(null)
  const [account, setAccount] = useState<Account | null>(null)

  const { toast } = useToast()

  // Fetch all risk profiles
  useEffect(() => {

    async function fetchData () {

      const riskProfiles = await ReadRiskProfiles()
      setRiskProfiles(riskProfiles)
    }

    fetchData()

  }, [])

  // Query an account that belongs to the selected risk profile
  useEffect(() => {
    async function QueryAccountBelongingToProfile () {
      if (!selectedProfileID || !riskProfiles) return

      const selectedProfile = riskProfiles.find(
        (profile: any) => profile.RiskProfileID === selectedProfileID
      )

      try {

        const account = await ReadAccountByAccountNumber(selectedProfile.AccountNumber)
        setAccount(account)
    
      } catch (error:any) {
    
      toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      }
      setRiskProfile(selectedProfile.RiskProfile)
    }
    QueryAccountBelongingToProfile()
  }, [selectedProfileID])

  if (!riskProfiles) return <LoadingComponent className="h-full w-full"/>

  return (

    <DashboardPage title='Risk Center' description='View risk profiles and associated accounts'>

    <div className="flex flex-col gap-20">
      <div className="flex w-full gap-x-5">

        <Select onValueChange={setSelectedProfileID} value={selectedProfileID || ''}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Select a risk profile" />
          </SelectTrigger>
          <SelectContent>

            {riskProfiles?.map((profile) => (
              profile.RiskProfileID &&
                <SelectItem key={profile.RiskProfileID} value={profile.RiskProfileID}>
                  {profile.AccountNumber} {profile.ClientName}
                </SelectItem>
            ))}

          </SelectContent>
        </Select>
        </div>

        {riskProfile && (
          <RiskProfile riskProfile={riskProfile} account={account}/>
        )}

      </div>

    </DashboardPage>  

  )
  
}

export default RiskCenter