import { Check, X } from 'lucide-react'
import { useTranslation } from '~/locales/Provider'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../../../../styled-system/css'

const premiumTableData = [
  {
    title: 'modules.informations.bot.title',
    label: 'modules.informations.bot.description',
    free: {
      enabled: true,
    },
    premium: {
      enabled: true,
    },
  },
  {
    title: 'modules.informations.captcha.title',
    label: 'modules.informations.captcha.description',
    free: {
      enabled: true,
    },
    premium: {
      enabled: true,
    },
  },
  {
    title: 'modules.informations.command.title',
    label: 'modules.informations.command.description',
    free: {
      enabled: true,
    },
    premium: {
      enabled: true,
    },
  },
  {
    title: 'modules.informations.counterRaid.title',
    label: 'modules.informations.counterRaid.description',
    free: {
      enabled: true,
    },
    premium: {
      enabled: true,
    },
  },
  {
    title: 'modules.informations.logging.title',
    label: 'modules.informations.logging.description',
    free: {
      enabled: true,
    },
    premium: {
      enabled: true,
    },
  },
  {
    title: 'modules.informations.scanner.title',
    label: 'modules.informations.scanner.description',
    free: {
      enabled: true,
    },
    premium: {
      enabled: true,
    },
  },
  {
    title: 'modules.informations.ticket.title',
    label: 'modules.informations.ticket.description',
    free: {
      enabled: true,
    },
    premium: {
      enabled: true,
    },
  },
] as const

export const PremiumTable = () => {
  const icons = {
    enabled: <Check className={css({ color: 'green.500' })} />,
    disabled: <X className={css({ color: 'red.500' })} />,
  }

  const { t } = useTranslation()

  const tdStyles = css({
    display: 'flex',
    flexDir: 'column',
    gap: '2px',
    color: 'white',
    alignItems: 'center',
    textAlign: 'center',
  })
  return (
    <table
      className={css({
        borderCollapse: 'collapse',
        width: '100%',

        '& td': {
          padding: '8px',

          '&:not(:first-child)': {
            borderLeft: 'news.tertiary',
            width: '20%',
          },
        },
        '& th': {
          border: 'news.tertiary',
          padding: '8px',
          bg: 'news.backgrounds.secondary',
          p: '20px',
        },

        '& tr': {
          border: 'news.tertiary',
          textAlign: 'start',
        },
      })}
    >
      <thead>
        <tr>
          <th></th>
          <th>
            <Typography as="h3" className={css({ fontWeight: 500 })}>
              Free
            </Typography>
          </th>
          <th>
            <Typography as="h3" className={css({ fontWeight: 500 })}>
              Premium
            </Typography>
            <Typography
              className={css({ fontSize: 'sm' })}
              color="news.label"
              as="span"
            >
              9.99€ / mois
            </Typography>
          </th>
        </tr>
      </thead>
      <tbody>
        {premiumTableData.map((data, idx) => (
          <tr key={idx}>
            <td>
              <div
                className={css({
                  display: 'flex',
                  flexDir: 'column',
                  justifyContent: 'space-between',
                  gap: '4px',
                })}
              >
                {data.title && (
                  <Typography as="span" className={css({ color: 'white' })}>
                    {t(data.title)}
                  </Typography>
                )}

                {data.label && (
                  <Typography
                    as="p"
                    className={css({
                      color: 'news.fonts.label',
                      fontSize: 'sm',
                    })}
                  >
                    {t(data.label)}
                  </Typography>
                )}
              </div>
            </td>
            <td>
              <div className={tdStyles}>
                {data.free.enabled ? icons.enabled : icons.disabled}
              </div>
            </td>
            <td>
              <div className={tdStyles}>
                {data.premium.enabled ? icons.enabled : icons.disabled}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
