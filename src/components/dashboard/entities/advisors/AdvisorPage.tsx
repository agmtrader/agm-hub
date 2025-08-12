'use client'
import React, { useEffect, useState } from 'react'
import { Advisor } from '@/lib/entities/advisor'
import { ReadAdvisorByID } from '@/utils/entities/advisor'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { Card } from '@/components/ui/card'
import AdvisorApplicationLinks from './AdvisorApplicationLinks'

type Props = {
  advisorId: string
}

const InfoRow = ({ label, value }: { label: string, value?: string }) => (
  <div>
    <p className="text-foreground font-medium text-md">{label}</p>
    <p className="text-subtitle text-sm">{value || '-'}</p>
  </div>
)

const AdvisorPage = ({ advisorId }: Props) => {
  const [advisor, setAdvisor] = useState<Advisor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const fetchAdvisor = async () => {
      try {
        const data = await ReadAdvisorByID(advisorId)
        if (isMounted) setAdvisor(data)
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Failed to load advisor')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    fetchAdvisor()
    return () => { isMounted = false }
  }, [advisorId])

  if (isLoading) return <LoadingComponent className="w-full h-full" />
  if (error) return <div className="text-destructive text-sm">{error}</div>
  if (!advisor) return <div className="text-subtitle text-sm">Advisor not found</div>

  return (
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
  )
}

export default AdvisorPage

