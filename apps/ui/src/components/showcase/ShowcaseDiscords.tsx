import { css } from '../../../styled-system/css'
import { ShowCaseDiscord } from './ShowCaseDiscord'

export const ShowcaseDiscords = () => {
  return (
    <div
      className={css({
        bg: 'news.backgrounds.secondary',
        borderTop: 'news.grey',
        borderBottom: 'news.grey',
        mb: '100px',
        display: 'flex',
        overflowX: 'scroll',
        pos: 'relative',
        alignItems: 'center',
        p: '20px 0',
        gap: '20px',

        _scrollbar: {
          display: 'none',
        },
      })}
    >
      {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((value, idx) => (
        <ShowCaseDiscord key={idx} />
      ))}
    </div>
  )
}
