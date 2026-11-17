'use client'

import { Button } from '@/components/ui/button'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { ApplicationSyncFailure, canRetryApplicationSync } from '@/utils/clients/application-sync-feedback'

export default function ApplicationSyncStatus({ failure, onRetry, onReviewPersonalInfo }: {
  failure: ApplicationSyncFailure
  onRetry?: () => void
  onReviewPersonalInfo?: () => void
}) {
  const { t } = useTranslationProvider()
  return <div role="alert" className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
    <p className="font-medium">{t('forms.application_sync.title')}</p>
    <p>{t(`forms.application_sync.${failure.kind}`)}</p>
    {failure.requestId && <p className="break-all text-sm">{t('forms.application_sync.reference')}: {failure.requestId}</p>}
    {canRetryApplicationSync(failure) && onRetry && <Button type="button" onClick={onRetry}>
      {t('forms.application_sync.retry')}
    </Button>}
    {failure.kind === 'invalid' && onReviewPersonalInfo && <Button type="button" onClick={onReviewPersonalInfo}>
      {t('forms.application_sync.review_personal')}
    </Button>}
  </div>
}
