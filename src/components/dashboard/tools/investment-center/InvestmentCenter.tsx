'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { GenerateInvestmentProposal } from '@/utils/tools/investment_proposals'
import { ReadAccountRiskProfiles, ListRiskProfiles } from '@/utils/tools/risk-profile'
import { AccountRiskProfile, RiskProfile } from '@/lib/tools/risk-profile'
import LoadingComponent from '@/components/misc/LoadingComponent'
import DashboardPage from '@/components/misc/DashboardPage'
import { toast } from '@/hooks/use-toast'
import InvestmentProposal from './InvestmentProposal'
import { InvestmentProposal as InvestmentProposalType } from '@/lib/tools/investment-proposals'
import { Account } from '@/lib/entities/account'
import { ReadAccounts } from '@/utils/entities/account'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'

const InvestmentCenter = () => {

  const [accounts, setAccounts] = useState<Account[] | null>(null)

  const [accountRiskProfiles, setAccountRiskProfiles] = useState<AccountRiskProfile[] | null>(null)
  const [riskProfilesList, setRiskProfilesList] = useState<RiskProfile[] | null>(null)
  const [selectedRiskProfile, setSelectedRiskProfile] = useState<string | null>(null)

  const [generatingInvestmentProposal, setGeneratingInvestmentProposal] = useState(false)
  const [investmentProposal, setInvestmentProposal] = useState<InvestmentProposalType[] | null>(null)

  // Initial fetch for risk profiles only
  useEffect(() => {
    async function fetchRiskProfiles() {
      try {
        // Fetch both account risk profiles and the master risk profiles list
        const [accounts, accountProfiles, riskProfiles] = await Promise.all([
          ReadAccounts(),
          ReadAccountRiskProfiles(),
          ListRiskProfiles()
        ])

        setAccounts(accounts)
        setAccountRiskProfiles(accountProfiles)
        setRiskProfilesList(riskProfiles)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch risk profiles',
          variant: 'destructive',
        })
      }
    }

    fetchRiskProfiles()
  }, [])

  // Fetch investment proposals when a risk profile is selected
  useEffect(() => {
    if (!selectedRiskProfile) return

    async function fetchProposal() {
      try {
        setGeneratingInvestmentProposal(true)
        // Check if account risk profiles are loaded
        if (!accountRiskProfiles) throw new Error('Account risk profiles not found')

        // Find the selected account risk profile
        const selectedAccountProfile = accountRiskProfiles.find(
          profile => profile.id.toString() === selectedRiskProfile
        )

        // Check if the selected account risk profile is found
        if (!selectedAccountProfile) throw new Error('Selected account risk profile not found')

        // Find the matched risk profile
        const matchedRiskProfile = riskProfilesList?.find(
          riskProfile => riskProfile.id.toString() === selectedAccountProfile.risk_profile_id.toString()
        )

        if (!matchedRiskProfile) throw new Error('Matched risk profile not found')

        // Generate the investment proposal
        const data = await GenerateInvestmentProposal(matchedRiskProfile.id.toString())

        // Set the proposal groups
        setInvestmentProposal(data)
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to fetch investment proposal',
          variant: 'destructive',
        })
      } finally {
        setGeneratingInvestmentProposal(false)
      }
    }

    fetchProposal()
  }, [selectedRiskProfile, accountRiskProfiles, riskProfilesList])


  const accountOptions = useMemo(() => {
    if (!accounts || !accountRiskProfiles) return []

    const accountIdToNumber = new Map(accounts.map((a) => [a.id.toString(), a.ibkr_account_number]))
    return accountRiskProfiles
      .filter((arp) => arp.account_id)
      .map((arp) => ({
        value: arp.id.toString(),
        label: accountIdToNumber.get(arp.account_id as string) || `Account ${arp.account_id}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [accounts, accountRiskProfiles])

  const selectedLabel = useMemo(() => {
    return accountOptions.find((o) => o.value === (selectedRiskProfile || ''))?.label || ''
  }, [accountOptions, selectedRiskProfile])

  if (!accounts || !accountRiskProfiles || !riskProfilesList) return <LoadingComponent className="h-full w-full" />

  return (
    <DashboardPage title="Investment Center" description="Keep track of your investment portfolio and risk profile">
      
      <div className="space-y-4">
        <div className="w-full max-w-md">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="form"
                className="w-full mt-2"
                role="combobox"
                aria-expanded={false}
                disabled={!accountRiskProfiles || !riskProfilesList}
              >
                {selectedLabel || (!accountRiskProfiles || !riskProfilesList ? 'Loading accounts...' : 'Select an account')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandList>
                  <CommandInput placeholder="Search accounts..." />
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {accountOptions.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.label}
                        onSelect={() => setSelectedRiskProfile(opt.value)}
                      >
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {generatingInvestmentProposal ?
        <LoadingComponent className="h-full w-full" />
        : 
        investmentProposal &&
          <InvestmentProposal
            investmentProposal={investmentProposal}
          />
      }
    </DashboardPage>
  )
}

export default InvestmentCenter