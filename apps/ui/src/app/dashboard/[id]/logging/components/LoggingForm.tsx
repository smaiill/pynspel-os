import { zodResolver } from '@hookform/resolvers/zod'
import { getModuleSchema, InferModuleConfigType } from '@pynspel/common'
import { ChannelType } from 'discord-api-types/v10'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FieldError } from '~/app/dashboard/components/form/FieldError'
import { useMutateModule } from '~/app/dashboard/hooks/modules'
import { FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import {
  useCurrentGuildChannels,
  useCurrentGuildValue,
} from '~/proxys/dashboard'
import { ButtonPrimary } from '~/ui/button/Button'
import { Checkbox } from '~/ui/checkbox/Checkbox'
import { InputSelect } from '~/ui/input/InputSelect'

type LogginFormProps = {
  data: InferModuleConfigType<'logging'>
}
const LoggingForm = (props: LogginFormProps) => {
  const { data } = props

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { isDirty, errors },
    getValues,
  } = useForm<InferModuleConfigType<'logging'>>({
    defaultValues: {
      user_join: data.user_join,
      user_left: data.user_left,
      channel: data.channel,
    },
    resolver: zodResolver(getModuleSchema('logging')),
  })
  const { t } = useTranslation()
  const [verificationChannel, setVerificationChannel] = useState(
    getValues('channel')
  )

  const currentGuild = useCurrentGuildValue()

  const mutation = useMutateModule('logging')

  const handleSubmitForm = (data: InferModuleConfigType<'logging'>) => {
    mutation.mutate(data)
  }

  useEffect(() => {
    setValue('channel', verificationChannel, {
      shouldDirty: true,
    })
  }, [verificationChannel])

  useEffect(() => {
    if (mutation.isSuccess) {
      reset(getValues())
    }
  }, [mutation.isSuccess])

  if (!currentGuild) {
    return 'Invalid guild.'
  }

  const formatedChannels = useCurrentGuildChannels(ChannelType.GuildText).map(
    (channel) => {
      return { label: channel.name, value: channel.id }
    }
  )

  return (
    <FlexColumn style={{ gap: 10, alignItems: 'flex-start' }}>
      <InputSelect
        value={verificationChannel}
        setValue={setVerificationChannel}
        options={formatedChannels}
        type="channel"
      >
        {t('modules.logging.channel')}
      </InputSelect>
      {errors.channel ? <FieldError message={errors.channel.message} /> : null}
      <Controller
        name="user_join"
        control={control}
        render={({ field }) => {
          return (
            <Checkbox {...field}>{t('modules.logging.user_join')}</Checkbox>
          )
        }}
      />
      {errors.user_join ? (
        <FieldError message={errors.user_join.message} />
      ) : null}

      <Controller
        name="user_left"
        control={control}
        render={({ field }) => (
          <Checkbox {...field}>{t('modules.logging.user_leave')}</Checkbox>
        )}
      />
      {errors.user_left ? (
        <FieldError message={errors.user_left.message} />
      ) : null}

      {isDirty ? (
        <ButtonPrimary
          onClick={handleSubmit(handleSubmitForm)}
          disabled={mutation.isLoading}
          type="submit"
        >
          {t('actions.save')}
        </ButtonPrimary>
      ) : null}
    </FlexColumn>
  )
}

export default LoggingForm
