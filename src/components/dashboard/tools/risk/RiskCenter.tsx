"use client"
import { useEffect, useState } from "react"
import RiskProfile from "@/components/dashboard/tools/risk/RiskProfile"
import { AccountRiskProfile, RiskProfile as RiskProfileType } from "@/lib/tools/risk-profile"
import { useToast } from "@/hooks/use-toast"
import LoadingComponent from "@/components/misc/LoadingComponent"
import DashboardPage from "@/components/misc/DashboardPage"
import { ListRiskProfiles, ReadAccountRiskProfiles } from "@/utils/tools/risk-profile"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"

const RiskCenter = () => {

  const [accountRiskProfiles, setAccountRiskProfiles] = useState<AccountRiskProfile[] | null>(null)
  const [riskProfiles, setRiskProfiles] = useState<RiskProfileType[] | null>(null)

  const [accountRiskProfile, setAccountRiskProfile] = useState<AccountRiskProfile | null>(null)

  const { toast } = useToast()
  
  useEffect(() => {

    async function fetchData () {

      try {

        const riskProfiles = await ListRiskProfiles()
        const accountRiskProfiles = await ReadAccountRiskProfiles()
        setRiskProfiles(riskProfiles)
        setAccountRiskProfiles(accountRiskProfiles)

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

  if (!accountRiskProfiles || !riskProfiles) return <LoadingComponent className="h-full w-full"/>

  return (

    <DashboardPage title='Risk Center' description='View risk profiles and associated accounts'>

    <div className="flex flex-col gap-20">
      <div className="flex w-96 gap-x-5">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {accountRiskProfile ? accountRiskProfile.name : "Select a risk profile"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandList>
                <CommandInput placeholder="Search risk profiles..." />
                <CommandEmpty>No risk profiles found.</CommandEmpty>
                <CommandGroup>
                  {accountRiskProfiles.map((profile) => (
                    <CommandItem
                      key={profile.id}
                      value={profile.name ?? ''}
                      onSelect={() => {
                        setAccountRiskProfile(profile)
                      }}
                    >
                      {profile.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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