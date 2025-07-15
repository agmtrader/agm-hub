import { AccountType, Language } from '../leads/GenerateApplicationLink'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { Advisor } from '@/lib/entities/advisor'

type Props = {
    advisor: Advisor | null
    /**
     * When provided, the dialog becomes a controlled component. The parent is
     * responsible for managing its open state via `isOpen` and `setIsOpen`.
     * If these props are omitted, the component will manage its own open state
     * and render a button trigger internally (previous behaviour).
     */
    isOpen?: boolean
    setIsOpen?: (open: boolean) => void
}

const AdvisorApplicationLinks = ({ advisor, isOpen, setIsOpen }: Props) => {
 
    const [accountType, setAccountType] = useState<AccountType>('br')
    const [language, setLanguage] = useState<Language>('en')

    // If the component is uncontrolled (no isOpen prop), fall back to internal state
    const [internalOpen, setInternalOpen] = useState(false)

    // Determine whether we're in controlled or uncontrolled mode
    const dialogOpen = typeof isOpen === 'boolean' ? isOpen : internalOpen
    const handleOpenChange = setIsOpen ?? setInternalOpen

    const generateUrl = () => {
        if (!advisor) {
            return null
        }
        const baseUrl = `https://agmtechnology.com/${language}/apply`
        const maParam = accountType === 'br' ? 'br' : 'ad'

        let string = `${baseUrl}?ma=${maParam}`
        if (advisor.id) {
            string += `&ad=${advisor.id}`
        }

        return string
    }

    async function handleCopyLink() {
        try {
            const url = generateUrl()
            if (!url) throw new Error("URL does not exist")
            await navigator.clipboard.writeText(url)
            toast({
                title: 'Link copied to clipboard',
                description: 'You can now paste it into your browser',
                variant: 'success'
            })
        } catch (e: any) {
            toast({
                title: 'Failed to copy link',
                description: e.message,
                variant: 'destructive'
            })
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            {/* Render the trigger button only when the component manages its own state */}
            {typeof isOpen !== 'boolean' && (
                <DialogTrigger asChild>
                    <Button className='bg-primary text-background hover:bg-primary/90'>
                        <Plus className='h-4 w-4 mr-2' />
                        Generate Application Link
                    </Button>
                </DialogTrigger>
            )}
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

export default AdvisorApplicationLinks