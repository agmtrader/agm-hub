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

const page = () => {

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

  // Show a specific risk profile and account
  const onSubmit = async () => {

    setLoading(true)

    if (!selectedProfileID || !riskProfiles) return

    // Find the selected risk profile from existing data
    const selectedProfile = riskProfiles.find(
      (profile: any) => profile.RiskProfileID === selectedProfileID
    )

    if (!selectedProfile) {
      toast({
        title: 'Error',
        description: 'No risk profile found',
      })
      throw new Error('No risk profile found')
    }

    // Fetch account associated with risk profile
    const response = await accessAPI('/database/read', 'POST', {
      'path': 'db/clients/accounts',
      'query': { 'AccountNumber': selectedProfile.AccountNumber }
    })
    
    if (response['status'] === 'success') {
      if (response['content'].length === 1) {
        setAccount(response['content'][0])
      } else if (response['content'].length === 0) {
        toast({
          title: 'Warning',
          description: 'No account found',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Multiple accounts found',
        })
        throw new Error('Multiple accounts found')
      }
    } else {
      toast({
        title: 'Error',
        description: 'Error fetching account',
      })
      throw new Error('Error fetching account')
    }

    setLoading(false)
    setRiskProfile(selectedProfile.RiskProfile)

  }

  if (!riskProfiles) return <LoadingComponent/>

  return (
    <div className="w-full h-full justify-start items-center flex gap-y-20 flex-col">
      {!riskProfile && (
        <div className="flex flex-col items-center gap-y-5">
          <h1 className="text-7xl text-agm-dark-blue font-bold">Risk Profiles</h1>
          
          <div className="w-full flex flex-col gap-y-5 justify-center items-center">
            <p className="text-agm-white font-bold">Risk profile</p>
            
            <div className="flex w-full gap-x-5">
              <Select onValueChange={setSelectedProfileID} value={selectedProfileID || ''}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a risk profile" />
                </SelectTrigger>
                <SelectContent>
                  {riskProfiles?.map((profile) => (
                    profile.RiskProfileID && (
                      <SelectItem key={profile.RiskProfileID} value={profile.RiskProfileID}>
                        {profile.AccountNumber + ' ' + profile.ClientName}
                      </SelectItem>
                    )
                  ))}
                </SelectContent>
              </Select>
              
              {
                loading ? (
                  <Button disabled className="flex gap-x-2">
                    <ReloadIcon className="w-4 h-4 animate-spin" />
                    Searching...
                  </Button>
                ) : (
                  <Button onClick={onSubmit} disabled={!selectedProfileID} className="flex gap-x-2">
                    <SearchIcon className="w-4 h-4" />
                    Search
                  </Button>
                )
              }
            </div>
          </div>
        </div>
      )}

      {riskProfile && (
        <RiskProfile riskProfile={riskProfile} account={account}/>
      )}
    </div>
  )
  
}

export default page