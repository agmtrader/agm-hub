import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { ReadAdvisors } from '@/utils/entities/advisor'
import { Advisor } from '@/lib/entities/advisor'
import { AccountType, FollowUp, Language, Lead } from '@/lib/entities/lead'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { sendApplicationLinkEmail } from '@/utils/tools/email'
import { User } from 'next-auth'
import { UpdateLeadByID } from '@/utils/entities/lead'
import { formatTimestamp } from '@/utils/dates'

interface Props {
    lead: Lead
    followUps: FollowUp[]
    user: User
}

const GenerateApplicationLink = ({ lead, followUps, user }: Props) => {

    const [accountType, setAccountType] = useState<AccountType>('br')
    const [advisorCode, setAdvisorCode] = useState<string | null>(null)
    const [language, setLanguage] = useState<Language>('en')

    const [isOpen, setIsOpen] = useState(false)
    const [advisors, setAdvisors] = useState<Advisor[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const [isSendingEmail, setIsSendingEmail] = useState(false)

    console.log(user)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const advisors = await ReadAdvisors()
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
            fetchData()
        }
    }, [isOpen])

    const handleSendEmail = async () => {
        setIsSendingEmail(true)
        try {
            if (!user.email) {
                throw new Error('No contact email found')
            }
            await sendApplicationLinkEmail({'name': user.name, 'application_link': generateUrl()}, user.email, language)
            setIsSendingEmail(false)
        } catch (error: any) {
            toast({
                title: 'Failed to send email',
                description: error.message,
                variant: 'destructive'
            })
            setIsSendingEmail(false)
        }
    }

    const generateUrl = () => {
        const baseUrl = `https://agmtechnology.com/${language}/apply`
        const maParam = accountType === 'br' ? 'br' : 'ad'

        let string = `${baseUrl}?ma=${maParam}`
        if (advisorCode) {
            string += `&ad=${advisorCode}`
        }
        string += `&ld=${lead.id}`

        return string
    }

    async function handleCopyLink() {
        try {
            const url = generateUrl()
            await navigator.clipboard.writeText(url)
            await UpdateLeadByID(lead.id, {
                sent: formatTimestamp(new Date())
            })
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

    if (!advisors) return <LoadingComponent />

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button disabled={followUps.some(followUp => followUp.completed === false)} className='bg-primary text-background hover:bg-primary/90'>
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
                        <Select value={advisorCode || ''} onValueChange={setAdvisorCode}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {isLoading ? (
                                    <SelectItem value="loading" disabled>Loading advisors...</SelectItem>
                                ) : (
                                    advisors.map((advisor) => (
                                        <SelectItem key={advisor.id} value={advisor.code}>
                                            {advisor.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <Card className='p-4 bg-muted'>
                        <p className='text-sm font-mono break-all'>{generateUrl()}</p>
                    </Card>

                    <div className='flex gap-2'>
                        <Button onClick={handleCopyLink}>
                            Copy Link
                        </Button>

                        <Button onClick={handleSendEmail} disabled={isSendingEmail}>
                            Send Email
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default GenerateApplicationLink