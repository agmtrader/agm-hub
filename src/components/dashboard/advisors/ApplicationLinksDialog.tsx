import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Advisor } from '@/lib/entities/advisor'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

type Props = {
    advisor: Advisor | null
}

const ApplicationLinksDialog = ({ advisor }: Props) => {
    const { lang } = useTranslationProvider()

    async function handleStartBrokerAccount() {
        try {
            const brokerUrl = `https://agmtechnology.com/${lang}/apply?ad=${advisor?.AdvisorCode}&ma=br` // Replace with actual URL
            await navigator.clipboard.writeText(brokerUrl)
            toast({
                title: 'Broker account link copied to clipboard',
                description: 'You can now paste it into your browser'
            })
        } catch (err) {
            toast({
                title: 'Failed to copy link',
                description: 'Please try again'
            })
        }
    }

    async function handleStartAdvisorAccount() {
        try {
            const advisorUrl = `https://agmtechnology.com/en/apply?ad=${advisor?.AdvisorCode}&ma=ad` // Replace with actual URL
            await navigator.clipboard.writeText(advisorUrl)
            toast({
                title: 'Advisor account link copied to clipboard',
                description: 'You can now paste it into your browser'
            })
        } catch (err) {
            toast({
                title: 'Failed to copy link',
                description: 'Please try again'
            })
        }
    }

  return (
    <Dialog open={!!advisor} onOpenChange={() => {}}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Application Links</DialogTitle>
            </DialogHeader>
            <div className='flex flex-col gap-4'>
                 <Button onClick={handleStartBrokerAccount}>
                    Start a new Broker account
                </Button>
                <Button onClick={handleStartAdvisorAccount}>
                    Start a new Advisor account
                </Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default ApplicationLinksDialog