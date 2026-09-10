'use client'

import GreetingsForm from '@/components/hub/greetings/GreetingsForm'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

export default function GreetingsPage() {
  const { t } = useTranslationProvider()

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 sm:py-20">
      <section className="w-full max-w-2xl overflow-hidden rounded-2xl bg-card shadow-[0_16px_50px_rgba(0,0,0,0.12)]">
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <GreetingsForm />
          <p className="mt-6 text-center text-xs text-muted-foreground text-wrap-pretty">
            {t('greetings.privacy')}
          </p>
        </div>
      </section>
    </main>
  )
}
