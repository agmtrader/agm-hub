import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'

type AccountType = 'br' | 'ad'
type Language = 'en' | 'es'

const GenerateApplicationLink = () => {

    const { lang } = useTranslationProvider()
    const [accountType, setAccountType] = React.useState<AccountType>('br')
    const [advisorNumber, setAdvisorNumber] = React.useState('1')
    const [language, setLanguage] = React.useState<Language>('en')
    const [isOpen, setIsOpen] = useState(false)

    const advisorNumbers = Array.from({ length: 10 }, (_, i) => (i + 1).toString())

    const generateUrl = () => {
        const baseUrl = `https://agmtechnology.com/${language}/apply`
        const maParam = accountType === 'br' ? 'br' : 'ad'
        return `${baseUrl}?ma=${maParam}&ad=${advisorNumber}`
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
                <Button className='bg-primary text-background hover:bg-primary/90'>
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
                        <label className='text-sm font-medium'>Advisor Number</label>
                        <Select value={advisorNumber} onValueChange={setAdvisorNumber}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {advisorNumbers.map((num) => (
                                    <SelectItem key={num} value={num}>
                                        Advisor {num}
                                    </SelectItem>
                                ))}
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