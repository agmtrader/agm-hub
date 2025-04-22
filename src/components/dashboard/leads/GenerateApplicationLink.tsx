import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { ReadAdvisors } from '@/utils/entities/advisor'
import { Advisor } from '@/lib/entities/advisor'
import { Lead } from '@/lib/entities/lead'
type AccountType = 'br' | 'ad'
type Language = 'en' | 'es'

interface Props {
    lead: Lead
}

const GenerateApplicationLink = ({ lead }: Props) => {

    const [accountType, setAccountType] = React.useState<AccountType>('br')
    const [advisorNumber, setAdvisorNumber] = React.useState('1')
    const [language, setLanguage] = React.useState<Language>('en')
    const [isOpen, setIsOpen] = useState(false)
    const [advisors, setAdvisors] = useState<Advisor[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchAdvisors = async () => {
            try {
                setIsLoading(true)
                const advisors = await ReadAdvisors()
                console.log(advisors)
                setAdvisors(advisors)
            } catch (error) {
                toast({
                    title: 'Error fetching advisors',
                    description: 'Please try again later',
                    variant: 'destructive'
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (isOpen) {
            fetchAdvisors()
        }
    }, [isOpen])

    const generateUrl = () => {
        const baseUrl = `https://agmtechnology.com/${language}/apply`
        const maParam = accountType === 'br' ? 'br' : 'ad'
        return `${baseUrl}?ma=${maParam}&ad=${advisorNumber}&ld=${lead.LeadID}`
    }

    async function handleCopyLink() {
        try {
            const url = generateUrl()
            await navigator.clipboard.writeText(url)
            toast({
                title: 'Link copied to clipboard',
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button disabled={lead.Status !== 'Waiting for Application'} className='bg-primary text-background hover:bg-primary/90'>
                    <Plus className='h-4 w-4 mr-2' />
                    Generate Application Link
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Application Link</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium'>Language</label>
                        <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium'>Account Type</label>
                        <Select value={accountType} onValueChange={(value: AccountType) => setAccountType(value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="br">Broker Account</SelectItem>
                                <SelectItem value="ad">Advisor Account</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium'>Advisor</label>
                        <Select value={advisorNumber} onValueChange={setAdvisorNumber}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {isLoading ? (
                                    <SelectItem value="loading" disabled>Loading advisors...</SelectItem>
                                ) : (
                                    advisors.map((advisor) => (
                                        <SelectItem key={advisor.AdvisorCode} value={advisor.AdvisorCode.toString()}>
                                            {advisor.AdvisorName}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <Card className='p-4 bg-muted'>
                        <p className='text-sm font-mono break-all'>{generateUrl()}</p>
                    </Card>

                    <Button onClick={handleCopyLink}>
                        Copy Link
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default GenerateApplicationLink