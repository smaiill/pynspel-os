import { InferModuleConfigType, validateModuleConfig } from '@pynspel/common'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutateModule } from '~/app/dashboard/hooks/modules'
import { DashboardCard } from '~/layouts/Dashboard'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { ButtonPrimary } from '~/ui/button/Button'
import { Checkbox } from '~/ui/checkbox/Checkbox'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'
import { InputSelectType } from '~/ui/input/InputSelectType'
import { Typography } from '~/ui/typography/Typography'

type LogginFormProps = {
  data: InferModuleConfigType<'scanner'>
}
const ScannerForm = (props: LogginFormProps) => {
  const { data } = props

  const { handleSubmit, setError, control, getValues, register } = useForm<
    InferModuleConfigType<'scanner'>
  >({
    defaultValues: {
      words: data.words,
      links: data.links,
    },
  })
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

  const currentGuild = useCurrentGuildValue()

  const mutation = useMutateModule('scanner')

  const handleSubmitForm = (data: InferModuleConfigType<'scanner'>) => {
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
        action: actionLinks,
        allowed_domains: allowedDomains,
        ignored_channels: ignoredChannelsLinks,
        mute_unit: muteUnitLinks,
      },
    }
    const parsedSchema = validateModuleConfig('scanner', completeData)

    if (!parsedSchema.success) {
      const errors = parsedSchema.error
      for (const err of errors) {
        setError(err.path[0] as keyof InferModuleConfigType<'scanner'>, {
          message: err.message,
        })
      }

      return
    }

    mutation.mutate(parsedSchema.data)
  }

  if (!currentGuild) {
    return 'Invalid guild.'
  }

  const formatedChannels = currentGuild.channels.map((channel) => {
    return { label: channel.name, value: channel.id }
  })

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
            Activer le scan des mots
          </Typography>
          <Controller
            name="words.scan"
            control={control}
            render={({ field }) => {
              return <Checkbox {...field} />
            }}
          />
        </Flex>
        <InputSelectType
          words={bannedWords}
          onChange={(words) => setBannedWords(words)}
          placeholder="Chien..."
        >
          Vos mots a bannir (non exacte)
        </InputSelectType>

        {/* TODO: Add example of what is exact word */}
        <InputSelectType
          words={bannedExactWords}
          onChange={(words) => setBannedExactWords(words)}
          placeholder="Mots a bannir..."
        >
          Vos mots a bannir (exacte)
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
        >
          La sanction{' '}
          <span style={{ color: '#D86767' }}>
            Préviligiez un mute plustot que les autres sanctions.
          </span>
        </InputSelect>
        <InputSelect
          multi
          options={formatedChannels}
          value={ignoredChannels}
          setValue={setIgnoredChannels}
          type="channel"
        >
          Channels a ignoré
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
            />
            <Input
              {...register('words.mute_timeout', {
                setValueAs: (value) => parseInt(value),
              })}
              label="Temps du mute"
            />
          </>
        ) : null}
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
            Activer le scan des liens
          </Typography>
          <Controller
            name="links.scan"
            control={control}
            render={({ field }) => {
              return <Checkbox {...field} />
            }}
          />
        </Flex>
        <InputSelectType
          words={allowedDomains}
          onChange={(domains) => setAllowedDomains(domains)}
          placeholder="pynspel.com"
        >
          Les domaines autoriser
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
        >
          La sanction{' '}
          <span style={{ color: '#D86767' }}>
            Préviligiez un mute plustot que les autres sanctions.
          </span>
        </InputSelect>
        {/* TODO: Show only the text channels */}
        <InputSelect
          multi
          options={formatedChannels}
          value={ignoredChannelsLinks}
          setValue={setIgnoredChannelsLinks}
        >
          Les channels a ignoré
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
            />
            <Input
              {...register('links.mute_timeout', {
                setValueAs: (value) => parseInt(value),
              })}
              label="Temps du mute"
            />
          </>
        ) : null}
      </DashboardCard>
      <ButtonPrimary
        onClick={handleSubmit(handleSubmitForm)}
        disabled={mutation.isLoading}
        type="submit"
      >
        Enregistrer
      </ButtonPrimary>
    </FlexColumn>
  )
}

export default ScannerForm
