'use client'
import React, { useEffect, useState } from 'react'
import { GenerateInvestmentProposal } from '@/utils/tools/investment_proposals'
import { DataTable, ColumnDefinition } from '@/components/misc/DataTable'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'

interface Bond {
  [key: string]: any
}

interface ProposalGroup {
  name: string
  equivalents: string[]
  bonds: Bond[]
}

const bondColumns: ColumnDefinition<Bond>[] = [
  { accessorKey: 'Description', header: 'Bond' },
  { accessorKey: 'Company Name', header: 'Company' },
  { accessorKey: 'Coupon', header: 'Coupon' },
  { accessorKey: 'Current Yield', header: 'Current Yield' },
  { accessorKey: 'YTM', header: 'YTM' },
  { accessorKey: 'Price', header: 'Price' },
  { accessorKey: 'Maturity', header: 'Maturity' },
]

const InvestmentProposals = () => {
  const [proposalGroups, setProposalGroups] = useState<ProposalGroup[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchProposal() {
      try {
        const data = await GenerateInvestmentProposal()
        // Assume API returns the exact structure provided in the sample JSON
        setProposalGroups(data as ProposalGroup[])
      } catch (error) {
        console.error('Failed to fetch investment proposal', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProposal()
  }, [])

  if (isLoading) {
    return (
      <div className="flex w-full justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!proposalGroups || proposalGroups.length === 0) {
    return <p className="text-center text-muted">No investment proposal available.</p>
  }

  return (
    <div className="flex flex-col gap-10">
      {proposalGroups.map((group) => (
        <Card key={group.name} className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {group.name.toUpperCase()} &nbsp;
              <span className="text-muted text-sm">({group.equivalents.join(', ')})</span>
            </h2>
          </div>

          <Separator />

          <DataTable
            data={group.bonds}
            columns={bondColumns}
            enablePagination
            pageSize={10}
            enableFiltering
          />
        </Card>
      ))}
    </div>
  )
}

export default InvestmentProposals