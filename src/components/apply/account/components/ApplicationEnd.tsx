'use client'
import Confetti from "@/components/ui/confetti"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check } from "lucide-react"
import { useTranslationProvider } from "@/utils/providers/TranslationProvider"
import { formatURL } from "@/utils/language/lang"
import { useEffect } from "react"
import { CreateNotification } from "@/utils/entities/notification"
import { useSession } from "next-auth/react"
import { Notification } from "@/lib/entities/notification"

const ApplicationEnd = () => {
    const {t, lang} = useTranslationProvider()
    const {data:session} = useSession()

    useEffect(() => {
        async function CreateEndNotification() {
          let notification:Notification = {
            UserID: session?.user?.id || '',
            Title: session?.user?.name || 'No name',
            Description: 'Account application completed',
            NotificationID: new Date().toISOString()
          }
          await CreateNotification(notification, 'account_applications')
        }
        CreateEndNotification()
    }, [])

    return (
      <div className='relative h-full w-full flex flex-col justify-center items-center gap-y-8 py-16'>
        <Confetti
          className="absolute left-0 top-0 -z-10 size-full pointer-events-none"
        />
        <Check className='w-24 h-24 text-green-500' />
        <p className='text-2xl font-semibold text-gray-700'>{t('apply.account.application_end.title')}</p>
        <div className='flex flex-col items-center gap-y-4'>
          <p className='text-lg text-gray-600'>{t('apply.account.application_end.description')}</p>
        </div>
        <Button>
          <Link href='/apply'>{t('apply.account.application_end.apply_another')}</Link>
        </Button>
        <Button variant='ghost'>
          <Link href={formatURL('/', lang)}>{t('apply.account.application_end.go_back_home')}</Link>
        </Button>
      </div>
    )
  }

export default ApplicationEnd