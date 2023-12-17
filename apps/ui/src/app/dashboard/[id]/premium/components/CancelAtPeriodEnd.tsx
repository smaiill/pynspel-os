import { Alert } from '~/app/dashboard/components/Alert'
import { useTranslation } from '~/locales/Provider'
import { css } from '../../../../../../styled-system/css'

export const CancelAtPeriodEnd = ({ endDate }: { endDate: Date }) => {
  const { t } = useTranslation()
  return (
    <Alert visual="warn" className={css({ mb: '20px' })}>
      <span>
        {t('subscription.finish_end_date', { date: endDate.toLocaleString() })}
      </span>
    </Alert>
  )
}
