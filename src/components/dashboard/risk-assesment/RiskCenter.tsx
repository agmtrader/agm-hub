"use client"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import RiskProfile from "@/components/dashboard/risk-assesment/RiskProfile"
import { accessAPI } from "@/utils/api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ReloadIcon } from "@radix-ui/react-icons"
import { SearchIcon } from "lucide-react"
import LoadingComponent from "@/components/misc/LoadingComponent"
import DashboardPage from "@/components/misc/DashboardPage"

const RiskCenter = () => {

  const [riskProfiles, setRiskProfiles] = useState<any[] | null>(null)
  const [selectedProfileID, setSelectedProfileID] = useState<string | null>(null)

  const [riskProfile, setRiskProfile] = useState<any | null>(null)
  const [account, setAccount] = useState<any | null>(null)

  const [loading, setLoading] = useState<boolean>(false)

  const { toast } = useToast()

  // Fetch all risk profiles
  useEffect(() => {

    async function fetchData () {

        let data = await accessAPI('/database/read','POST', {'path': 'db/clients/risk'})
        setRiskProfiles(data['content'])
    }

    fetchData()

  }, [])

  useEffect(() => {
    async function selectProfile () {

      setLoading(true)

      if (!selectedProfileID || !riskProfiles) return
  
      // Find the selected risk profile from existing data
      const selectedProfile = riskProfiles.find(
        (profile: any) => profile.RiskProfileID === selectedProfileID
      )
  
      // Fetch account associated with risk profile
      const response = await accessAPI('/database/read', 'POST', {
        'path': 'db/clients/accounts',
        'query': { 'AccountNumber': selectedProfile.AccountNumber }
      })
  
      try {
      
        if (response['status'] === 'success') {
          if (response['content'].length === 1) {
            setAccount(response['content'][0])
          } else if (response['content'].length === 0) {
            toast({
              title: 'Warning',
              description: 'No IBKR Account found',
              variant: 'warning',
            })
          } else {
            throw new Error('Multiple accounts found')
          }
        } else {
          throw new Error('Error fetching account')
        }
  
  
      } catch (error:any) {
  
      toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      }
  
      setLoading(false)
      setRiskProfile(selectedProfile.RiskProfile)
    }
    selectProfile()
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