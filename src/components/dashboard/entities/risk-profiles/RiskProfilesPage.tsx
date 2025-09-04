'use client'
import React, { useEffect, useState } from 'react'
import { RiskProfile } from '@/lib/tools/risk-profile'
import { ReadRiskProfiles } from '@/utils/tools/risk-profile'
import { DataTable, ColumnDefinition } from '@/components/misc/DataTable'
import { Badge } from '@/components/ui/badge'
import { formatDateFromTimestamp } from '@/utils/dates'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { redirect } from 'next/navigation'
import { formatURL } from '@/utils/language/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { InvestmentProposal as InvestmentProposalType } from '@/lib/tools/investment-proposals'
import { ReadInvestmentProposalsByRiskProfile } from '@/utils/tools/investment_proposals'
import InvestmentProposal from '@/components/dashboard/tools/investment-center/InvestmentProposal'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'

const RiskProfilesPage = () => {

  const {lang} = useTranslationProvider()
  const [riskProfiles, setRiskProfiles] = useState<RiskProfile[] | null>(null)
  const [selectedRiskProfile, setSelectedRiskProfile] = useState<RiskProfile | null>(null)
  const [selectedInvestmentProposal, setSelectedInvestmentProposal] = useState<InvestmentProposalType | null>(null)
  
  const fetchRiskProfiles = async () => {
    const profiles = await ReadRiskProfiles()
    if (profiles) {
      // Sort by created date desc assuming created is yyyyMMddHHmmss string
      const sorted = [...profiles].sort((a, b) => b.created.localeCompare(a.created))
      setRiskProfiles(sorted)
    } else {
      setRiskProfiles([])
    }
  }

  useEffect(() => {
    fetchRiskProfiles()
  }, [])

  const columns: ColumnDefinition<RiskProfile>[] = [
    {
      header: 'Created',
      accessorKey: 'created',
      cell: ({ getValue }) => formatDateFromTimestamp(getValue()),
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Has Account?',
      accessorKey: 'account_id',
      cell: ({ getValue }) => {
        const val = getValue() as string
        return val ? (
          <Badge variant="success">Yes</Badge>
        ) : (
          <Badge variant="outline">No</Badge>
        )
      }
    },
    {
      header: 'Score',
      accessorKey: 'score',
      cell: ({ getValue }) => {
        const val = getValue() as number
        return <Badge variant={val >= 70 ? 'destructive' : val >= 40 ? 'warning' as any : 'success'}>{val}</Badge>
      }
    }
  ]

  const rowActions: any[] = [
    {
      label: 'View Account',
      onClick: (row: RiskProfile) => {
        redirect(formatURL(`/dashboard/accounts/${row.account_id}`, lang))
      }
    },
    {
      label: 'View Proposal',
      onClick: async (row: RiskProfile) => {
        try {
          setSelectedRiskProfile(row)
          const proposals = await ReadInvestmentProposalsByRiskProfile(row.id)
          if (!proposals || proposals.length === 0) {
            throw new Error('No proposal found for this profile')
          } else {
            setSelectedInvestmentProposal(proposals[0])
          }
        } catch (e) {
          toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed to fetch proposal', variant: 'destructive' })
        }   
      }
    }
  ]

  if (!riskProfiles) return <LoadingComponent className="w-full h-full" />

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Risk Profiles</h1>
      <DataTable
        data={riskProfiles}
        columns={columns}
        enableFiltering
        enableRowActions
        rowActions={rowActions}
      />
    {selectedInvestmentProposal && selectedRiskProfile && (
        <Dialog open={!!selectedInvestmentProposal} onOpenChange={(open) => {
                if (!open) setSelectedInvestmentProposal(null)
            }}>
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <InvestmentProposal riskProfile={selectedRiskProfile} investmentProposal={selectedInvestmentProposal} />
            </DialogContent>
        </Dialog>
    )}
    </div>
  )
}

export default RiskProfilesPage
