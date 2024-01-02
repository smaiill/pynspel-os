'use client'
import { HeaderAndFooterLayout } from '~/layouts/HeaderAndFooterLayout'
import { Tag } from '~/ui/Tag'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../../styled-system/css'

const cgv = () => {
  return (
    <HeaderAndFooterLayout>
      <section className={css({ minH: '100vh', p: '15px 10px' })}>
        <Tag className={css({ w: 'fit-content' })}>
          <Typography as="h1">Coming soon...</Typography>
        </Tag>
      </section>
    </HeaderAndFooterLayout>
  )
}

export default cgv
