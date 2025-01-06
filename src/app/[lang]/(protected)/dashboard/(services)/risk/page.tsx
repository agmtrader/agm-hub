"use client"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import RiskProfile from "@/components/dashboard/risk-assesment/RiskProfile"
import { accessAPI } from "@/utils/api"

import { motion } from "framer-motion"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ReloadIcon } from "@radix-ui/react-icons"
import { SearchIcon, X } from "lucide-react"
import LoadingComponent from "@/components/misc/LoadingComponent"
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog"

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

  if (!riskProfiles) return <LoadingComponent/>

  return (
    <div className="w-full h-full justify-start items-center flex gap-y-20 flex-col">
      {!riskProfile && (
        <div className="flex flex-col items-center gap-y-5">
          <h1 className="text-7xl text-foreground font-bold">Risk Profiles</h1>
          
          <div className="w-full flex flex-col gap-y-5 justify-center items-center">
            <p className="text-lg text-subtitle">Select a risk profile to view</p>
            
            <div className="flex w-full gap-x-5">
              <Select onValueChange={setSelectedProfileID} value={selectedProfileID || ''}>
                <SelectTrigger className="w-full">
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
              
              {
                loading ?
                  <Button disabled className="flex gap-x-2">
                    <ReloadIcon className="w-4 h-4 animate-spin" />
                    Searching...
                  </Button>
                  :
                  <Button onClick={onSubmit} disabled={!selectedProfileID} className="flex gap-x-2">
                    <SearchIcon className="w-4 h-4" />
                    Search
                  </Button>
              }

            </div>
          </div>
        </div>
      )}

      {riskProfile && (
        <Dialog open={!!riskProfile} onOpenChange={setRiskProfile}>
        <DialogContent className="max-w-fit w-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="w-full h-full flex flex-col gap-y-5 justify-center items-center"
          >
            <DialogClose className="absolute right-4 top-4" asChild>
              <Button type="button" variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <RiskProfile riskProfile={riskProfile} account={account}/>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
      )}
    </div>
  )
  
}

export default page