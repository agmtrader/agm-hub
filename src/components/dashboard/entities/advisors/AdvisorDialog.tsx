'use client'
import React from 'react'
import { Advisor } from '@/lib/entities/advisor'
import { Card } from '@/components/ui/card'
import AdvisorApplicationLinks from './AdvisorApplicationLinks'
import { Dialog, DialogContent } from '@/components/ui/dialog'

type Props = {
  advisor: Advisor | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const InfoRow = ({ label, value }: { label: string, value?: string }) => (
  <div>
    <p className="text-foreground font-medium text-md">{label}</p>
    <p className="text-subtitle text-sm">{value || '-'}</p>
  </div>
)

const AdvisorDialog = ({ advisor, isOpen, onOpenChange }: Props) => {
  if (!advisor) return null
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col gap-4 justify-center">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Name" value={advisor.name} />
              <InfoRow label="Code" value={advisor.code} />
              <InfoRow label="Agency" value={advisor.agency} />
              <InfoRow label="Hierarchy 1" value={advisor.hierarchy1} />
              <InfoRow label="Hierarchy 2" value={advisor.hierarchy2} />
              <InfoRow label="Contact ID" value={advisor.contact_id} />
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">System</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="ID" value={advisor.id} />
              <InfoRow label="Created" value={advisor.created} />
              <InfoRow label="Updated" value={advisor.updated} />
            </div>
          </Card>
          <AdvisorApplicationLinks advisor={advisor} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AdvisorDialog

