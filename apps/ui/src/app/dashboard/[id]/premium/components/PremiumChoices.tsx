import { FlexColumn } from '~/layouts/Flex'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../../../../styled-system/css'

export const PremiumChoices = () => {
  return (
    <FlexColumn>
      <Typography className={css({ mt: '20px' })} as="h3">
        Emmenez Pynspel dans une nouvelle aventure
      </Typography>

      <Typography as="span" color="secondary" className={css({ mt: '10px' })}>
        Imaginez votre serveur Discord actuel, juste 10 fois clair et plus
        facile pour les membres d'interagir, de socialiser et de jouer.
      </Typography>

      <h1 className={css({ color: 'white', fontSize: '30px' })}>
        Reproduce this{' '}
        <a href="https://app.favikon.com/pricing/">
          https://app.favikon.com/pricing/
        </a>
      </h1>
      <table
        className={css({
          borderCollapse: 'collapse',

          '& td': {
            border: '1px solid #dddddd',
            padding: '8px',
          },
          '& th': {
            border: '1px solid #dddddd',
            padding: '8px',
            bg: '#f2f2f2',
          },

          '& tr': {
            _hover: {
              bg: '#f5f5f5',
            },
          },
        })}
      >
        <thead>
          <tr>
            <th colSpan={2}>The table header</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>The table body</td>
            <td>with two columns</td>
          </tr>
        </tbody>
      </table>
    </FlexColumn>
  )
}
