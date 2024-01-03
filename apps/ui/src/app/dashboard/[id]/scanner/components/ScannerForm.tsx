import { InferModuleConfigType, validateModuleConfig } from '@pynspel/common'
import { ChannelType } from 'discord-api-types/v10'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutateModule } from '~/app/dashboard/hooks/modules'
import { DashboardCard } from '~/layouts/Dashboard'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { useCurrentGuildChannels } from '~/proxys/dashboard'
import { ButtonPrimary } from '~/ui/button/Button'
import { Checkbox } from '~/ui/checkbox/Checkbox'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'
import { InputSelectType } from '~/ui/input/InputSelectType'
import { Typography } from '~/ui/typography/Typography'
const MODULE_NAME = 'scanner'

type LogginFormProps = {
  data: InferModuleConfigType<typeof MODULE_NAME>
}
const ScannerForm = (props: LogginFormProps) => {
  const { data } = props

  const {
    handleSubmit,
    setError,
    control,
    getValues,
    register,
    formState: { errors },
  } = useForm<InferModuleConfigType<typeof MODULE_NAME>>({
    defaultValues: {
      words: data.words,
      links: data.links,
    },
  })
  const { t } = useTranslation()
  const [bannedWords, setBannedWords] = useState(getValues('words.banned'))
  const [bannedExactWords, setBannedExactWords] = useState(
    getValues('words.banned_exact')
  )
  const [allowedDomains, setAllowedDomains] = useState(
    getValues('links.allowed_domains')
  )
  const [action, setAction] = useState(getValues('words.action'))
  const [actionLinks, setActionLinks] = useState(getValues('links.action'))
  const [ignoredChannels, setIgnoredChannels] = useState(
    getValues('words.ignored_channels')
  )
  const [ignoredChannelsLinks, setIgnoredChannelsLinks] = useState(
    getValues('links.ignored_channels')
  )
  const [muteUnit, setMuteUnit] = useState(getValues('words.mute_unit'))
  const [muteUnitLinks, setMuteUnitLinks] = useState(
    getValues('links.mute_unit')
  )

  const mutation = useMutateModule(MODULE_NAME)

  const handleSubmitForm = (
    data: InferModuleConfigType<typeof MODULE_NAME>
  ) => {
    const completeData = {
      ...data,
      words: {
        ...data.words,
        banned: bannedWords,
        banned_exact: bannedExactWords,
        ignored_channels: ignoredChannels,
        mute_unit: muteUnit,
        action,
      },
      links: {
        ...data.links,
        allowed_domains: allowedDomains,
        ignored_channels: ignoredChannelsLinks,
        mute_unit: muteUnitLinks,
        action: actionLinks,
      },
    }
    const parsedSchema = validateModuleConfig(MODULE_NAME, completeData)

    if (!parsedSchema.success) {
      const errors = parsedSchema.error
      for (const err of errors) {
        setError(
          err.path[0] as keyof InferModuleConfigType<typeof MODULE_NAME>,
          {
            message: err.message,
          }
        )
      }

      return
    }

    mutation.mutate(parsedSchema.data)
  }

  const formatedChannels = useCurrentGuildChannels(ChannelType.GuildText).map(
    (channel) => {
      return { label: channel.name, value: channel.id }
    }
  )

  return (
    <FlexColumn style={{ gap: 10, alignItems: 'flex-start' }}>
      <DashboardCard
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          width: '100%',
        }}
      >
        <Flex style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography color="secondary" as="span">
            {t('modules.scanner.words.activate')}
          </Typography>
          <Controller
            name="words.scan"
            control={control}
            render={({ field }) => {
              return (
                <Checkbox
                  onChange={field.onChange}
                  checked={field.value}
                  ref={field.ref}
                />
              )
            }}
          />
        </Flex>
        <InputSelectType
          words={bannedWords}
          onChange={(words) => setBannedWords(words)}
          placeholder="Words..."
          error={errors.words?.banned?.message}
        >
          {t('modules.scanner.words.to_ban', {
            exact: false,
          })}
        </InputSelectType>

        <InputSelectType
          words={bannedExactWords}
          onChange={(words) => setBannedExactWords(words)}
          placeholder="Words..."
          error={errors.words?.banned_exact?.message}
        >
          {t('modules.scanner.words.to_ban', {
            exact: true,
          })}
        </InputSelectType>
        <InputSelect
          options={[
            { label: 'Aucune', value: 'none' },
            { label: 'Kick', value: 'kick' },
            { label: 'Ban', value: 'ban' },
            { label: 'Mute', value: 'mute' },
          ]}
          value={action}
          setValue={setAction}
          error={errors.words?.action?.message}
        >
          {t('modules.common.action_to_take')}
        </InputSelect>
        {action === 'mute' ? (
          <>
            <InputSelect
              options={[
                { label: 'Minutes', value: 'minute' },
                { label: 'Jours', value: 'day' },
              ]}
              value={muteUnit}
              setValue={setMuteUnit}
              error={errors?.words?.mute_unit?.message}
            >
              {t('modules.common.mute_unit')}
            </InputSelect>
            <Input
              {...register('words.mute_timeout', {
                setValueAs: (value) => parseInt(value),
              })}
              label={t('modules.common.mute_time')}
              error={errors.words?.mute_timeout?.message}
            />
          </>
        ) : null}
        <InputSelect
          value={ignoredChannels}
          multi
          options={formatedChannels}
          setValue={setIgnoredChannels}
          type="channel"
          error={errors.words?.ignored_channels?.message}
          clearable
        >
          {t('modules.common.channels_ignore')}
        </InputSelect>
      </DashboardCard>
      <DashboardCard
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          width: '100%',
        }}
      >
        <Flex style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography color="secondary" as="span">
            {t('modules.scanner.links.activate')}
          </Typography>
          <Controller
            name="links.scan"
            control={control}
            render={({ field }) => {
              return (
                <Checkbox
                  onChange={field.onChange}
                  checked={field.value}
                  ref={field.ref}
                />
              )
            }}
          />
        </Flex>
        <InputSelectType
          words={allowedDomains}
          onChange={(domains) => setAllowedDomains(domains)}
          placeholder="pynspel.com"
          error={errors?.links?.allowed_domains?.message}
        >
          {t('modules.scanner.links.authorized_domains')}
        </InputSelectType>
        <InputSelect
          options={[
            { label: 'Aucune', value: 'none' },
            { label: 'Kick', value: 'kick' },
            { label: 'Ban', value: 'ban' },
            { label: 'Mute', value: 'mute' },
          ]}
          value={actionLinks}
          setValue={setActionLinks}
          error={errors?.links?.action?.message}
        >
          {t('modules.common.action_to_take')}
        </InputSelect>
        {actionLinks === 'mute' ? (
          <>
            <InputSelect
              options={[
                { label: 'Minutes', value: 'minute' },
                { label: 'Jours', value: 'day' },
              ]}
              value={muteUnitLinks}
              setValue={setMuteUnitLinks}
              error={errors?.links?.mute_unit?.message}
            >
              {t('modules.common.mute_unit')}
            </InputSelect>
            <Input
              {...register('links.mute_timeout', {
                setValueAs: (value) => parseInt(value),
              })}
              label={t('modules.common.mute_time')}
              error={errors.links?.mute_timeout?.message}
            />
          </>
        ) : null}
        <InputSelect
          multi
          options={formatedChannels}
          value={ignoredChannelsLinks}
          setValue={setIgnoredChannelsLinks}
          error={errors?.links?.ignored_channels?.message}
          clearable
        >
          {t('modules.common.channels_ignore')}
        </InputSelect>
      </DashboardCard>
      <ButtonPrimary
        onClick={handleSubmit(handleSubmitForm)}
        disabled={mutation.isLoading}
        type="submit"
      >
        {t('actions.save')}
      </ButtonPrimary>
    </FlexColumn>
  )
}

export default ScannerForm
