import { Check, X } from 'lucide-react'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../../../../styled-system/css'

type PremiumTableDataType = {
  title: string
  label?: string
  free: {
    enabled: boolean
    title?: string
    label?: string
  }
  premium: {
    enabled: boolean
    title?: string
    label?: string
  }
}
const premiumTableData: PremiumTableDataType[] = [
  {
    title: 'Classements dynamiques (pays, réseaux sociaux et catégories)',
    label:
      'Accédez aux classements acclamés de Favikon mis à jour en temps réel',
    free: {
      enabled: false,
      title: '1 suivi de créateur inclus',
      label: "Jusqu'à 50 créateurs/liste de suivi",
    },
    premium: {
      enabled: true,
    },
  },
  {
    title: 'Ajout et personnalisation de créateur',
    label:
      "Ajoutez instantanément n'importe quel créateur sur la plateforme et faites des suggestions d'édition à la demande !",
    free: {
      enabled: false,
    },
    premium: {
      enabled: true,
    },
  },
  {
    title: "Suivi des créateurs grâce à l'IA",
    label:
      "Utilisez la puissance de l'IA pour obtenir des rapports hebdomadaires sur les réseaux sociaux de votre secteur ou de vos propres créateurs.",
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
                    {data.title}
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
                    {data.label}
                  </Typography>
                )}
              </div>
            </td>
            <td>
              <div className={tdStyles}>
                {data.free.enabled ? icons.enabled : icons.disabled}
                {data.free.title && (
                  <Typography as="span" className={css({ color: 'white' })}>
                    {data.free.title}
                  </Typography>
                )}
                {data.free.label && (
                  <Typography
                    as="p"
                    className={css({
                      color: 'news.fonts.label',
                      fontSize: 'sm',
                    })}
                  >
                    {data.free.label}
                  </Typography>
                )}
              </div>
            </td>
            <td>
              <div className={tdStyles}>
                {data.premium.enabled ? icons.enabled : icons.disabled}
                {data.premium.title && (
                  <Typography as="span" className={css({ color: 'white' })}>
                    {data.free.title}
                  </Typography>
                )}
                {data.premium.label && (
                  <Typography
                    as="p"
                    className={css({
                      color: 'news.fonts.label',
                      fontSize: 'sm',
                    })}
                  >
                    {data.premium.label}
                  </Typography>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
