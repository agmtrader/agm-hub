import { DataTable } from '@/components/misc/DataTable'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { toast } from '@/hooks/use-toast'
import { InvestmentProposal as InvestmentProposalType } from '@/lib/tools/investment-proposals'
import { ReadInvestmentProposals } from '@/utils/tools/investment_proposals'
import React, { useEffect, useState } from 'react'
import InvestmentProposal from './InvestmentProposal'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const InvestmentProposals = () => {

    const [investmentProposals, setInvestmentProposals] = useState<InvestmentProposalType[]>([])
    const [selectedInvestmentProposal, setSelectedInvestmentProposal] = useState<InvestmentProposalType | null>(null)

    useEffect(() => {
        const fetchInvestmentProposals = async () => {
            try {
            const proposals = await ReadInvestmentProposals()
            if (!proposals) throw new Error('No proposals found')
            setInvestmentProposals(proposals)
            } catch (e) {
                toast({ 
                    title: 'Error', 
                    description: 'Failed to fetch investment proposals', 
                    variant: 'destructive' 
                })
            }
        }
        fetchInvestmentProposals()
    }, [])

    if (!investmentProposals) return <LoadingComponent className='h-full w-full'/>

    return (
        <div className='max-w-7xl h-full flex flex-col gap-5'>
            <DataTable data={investmentProposals} enableRowActions rowActions={[
                {
                    label: 'View',
                    onClick: (row: InvestmentProposalType) => setSelectedInvestmentProposal(row),
                }
            ]} />


            <Dialog open={!!selectedInvestmentProposal} onOpenChange={(open) => {
                if (!open) setSelectedInvestmentProposal(null)
            }}>
              <DialogContent className="max-w-7xl w-fit">
                <DialogHeader>
                  <DialogTitle>Investment Proposal</DialogTitle>
                </DialogHeader>
                {selectedInvestmentProposal && (
                    <InvestmentProposal investmentProposal={selectedInvestmentProposal} />
                )}
              </DialogContent>
            </Dialog>
            
        </div>
    )
}

export default InvestmentProposals