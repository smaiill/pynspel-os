import { Check } from 'lucide-react'
import { HTMLAttributes } from 'react'
import { pxToast } from '~/app/dashboard/components/toast/toast-handler'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { ButtonOutline, ButtonPrimary } from '~/ui/button/Button'
import { Typography } from '~/ui/typography/Typography'
import { css, cx } from '../../../../../../styled-system/css'
import { usePremiumMutations } from '../hooks/usePremiumMutations'

const features = ['Advanced protection', 'Mon gros zizi', 'Ma grosse kekette']

const cards = [
  {
    type: 'yearly',
    price: '99,99€',
    features,
    title: 'subscription.yearly',
    popular: false,
    priceId: 'price_1NfgBYFtvhXI74aJxub8vhdZ',
  },
  {
    type: 'monthly',
    price: '9,99€',
    features,
    title: 'subscription.monthly',
    popular: true,
    priceId: 'price_1NfgB1FtvhXI74aJOQ1B5O8J',
  },
] as const

type PremiumCardsProps = HTMLAttributes<HTMLDivElement>
export const PremiumCards = (props: PremiumCardsProps) => {
  const { t } = useTranslation()
  const currentGuild = useCurrentGuildValue()
  const { className, ...rest } = props
  const { createCheckoutSession } = usePremiumMutations()

  const handleClick = async (priceId: string, guildId: string) => {
    try {
      const res = await createCheckoutSession.mutateAsync({ priceId, guildId })
      window.open(res.session, '_self')
    } catch (error) {
      pxToast('error', "Une erreur s'est produite durant le process, retry.")
    }
  }

  if (!currentGuild?.guild_id) {
    return 'Loading...'
  }

  return (
    <Flex className={cx(className, css({ gap: 10 }))} {...rest}>
      {cards.map((card, idx) => (
        <FlexColumn
          className={css({
            p: '15px',
            gap: '15px',
            textAlign: 'start',
            border: '1px solid rgba(255, 255, 255, .1)',
            flex: 1,
            rounded: '5px',
            pos: 'relative',
          })}
          key={idx}
        >
          {card.popular ? (
            <div
              className={css({
                pos: 'absolute',
                top: '-10px',
                right: '-20px',
                p: '5px 10px',
                rounded: '5px',
                border: '1px solid rgba(255, 255, 255, .1)',
                bg: 'special',
              })}
            >
              <Typography as="span" color="primary">
                Most popular
              </Typography>
            </div>
          ) : null}
          <Typography as="h4" color="secondary">
            {t(`subscription.${card.type}.title`)}
          </Typography>
          <Typography as="span" color="secondary">
            {card.price}/{t(`subscription.${card.type}.value`)}
          </Typography>

          <FlexColumn className={css({ gap: 10 })}>
            {card.features.map((feature, idxFeature) => (
              <Flex
                className={css({ alignItems: 'center', gap: '5px' })}
                key={idxFeature}
              >
                <Check className={css({ color: 'special' })} size={15} />
                <Typography as="span" color="secondary">
                  {feature}
                </Typography>
              </Flex>
            ))}
          </FlexColumn>

          {card.popular ? (
            <ButtonPrimary
              onClick={() => handleClick(card.priceId, currentGuild.guild_id)}
              className={css({ marginTop: '30px' })}
            >
              {t('actions.claim')}{' '}
            </ButtonPrimary>
          ) : (
            <ButtonOutline
              onClick={() => handleClick(card.priceId, currentGuild.guild_id)}
              className={css({ marginTop: '30px' })}
            >
              {t('actions.claim')}
            </ButtonOutline>
          )}
        </FlexColumn>
      ))}
    </Flex>
  )
}
