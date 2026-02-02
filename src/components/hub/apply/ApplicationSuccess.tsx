'use client'
import Confetti from "@/components/ui/confetti"
import { Check } from "lucide-react"
import Link from "next/link"
import { Button } from '@/components/ui/button'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const ApplicationSuccess = () => {

    const { t } = useTranslationProvider();

    return (
        <div className='relative h-full w-full flex flex-col justify-center items-center gap-y-8 py-16'>
        <Confetti
            className="absolute left-0 top-0 -z-10 size-full pointer-events-none"
        />
        <Check className='w-24 h-24 text-success' />
        <p className='text-2xl font-semibold text-foreground'>{t('apply.account.application_success.title')}</p>
        <div className='flex flex-col items-center gap-y-4'>
            <p className='text-lg text-subtitle'>{t('apply.account.application_success.description')}</p>
            <p className='text-sm text-subtitle'>{t('apply.account.application_success.description_2')}</p>
        </div>
        <div className='flex gap-4'>
            <Button>
            <Link href='/'>{t('apply.account.application_success.go_back_home')}</Link>
            </Button>
        </div>
        </div>
    )
}

export default ApplicationSuccess