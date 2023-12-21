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
  useCurrentGuildRoles,
  useCurrentGuildValue,
} from '~/proxys/dashboard'
import { ButtonPrimary } from '~/ui/button/Button'
import { Checkbox } from '~/ui/checkbox/Checkbox'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'

type Props = {
  data: InferModuleConfigType<typeof MODULE_NAME>
}

const MODULE_NAME = 'captcha'

const CaptchaForm = (props: Props) => {
  const { data } = props
  const currentGuild = useCurrentGuildValue()
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors: formErrors, isDirty },
  } = useForm<InferModuleConfigType<typeof MODULE_NAME>>({
    defaultValues: {
      has_numbers: data.has_numbers,
      case_sensitive: data.case_sensitive,
      length: data.length,
      max_retries: data.max_retries,
      role_id: data.role_id,
      timeout: data.timeout,
      verification_channel: data.verification_channel,
    },

    resolver: zodResolver(getModuleSchema(MODULE_NAME)),
  })
  const { t } = useTranslation()

  const [verificationRole, setVerificationRole] = useState(getValues('role_id'))
  const [timeoutCaptcha, setTimeoutCaptcha] = useState(getValues('timeout'))
  const [verificationChannel, setVerificationChannel] = useState(
    getValues('verification_channel')
  )

  const mutation = useMutateModule(MODULE_NAME)

  const handleSubmitForm = async (
    data: InferModuleConfigType<typeof MODULE_NAME>
  ) => {
    mutation.mutate(data)
  }

  useEffect(() => {
    setValue('role_id', verificationRole, {
      shouldDirty: true,
    })
  }, [verificationRole])

  useEffect(() => {
    setValue('verification_channel', verificationChannel, {
      shouldDirty: true,
    })
  }, [verificationChannel])

  useEffect(() => {
    setValue('timeout', timeoutCaptcha, {
      shouldDirty: true,
    })
  }, [timeoutCaptcha])

  useEffect(() => {
    if (mutation.isSuccess) {
      reset(getValues())
    }
  }, [mutation.isSuccess])

  const formatedRoles = useCurrentGuildRoles().map((role) => {
    return { label: role.name, value: role.id, color: role.color }
  })

  const formatedChannels = useCurrentGuildChannels(ChannelType.GuildText).map(
    (channel) => {
      return { label: channel.name, value: channel.id }
    }
  )

  return (
    <FlexColumn style={{ gap: 10, alignItems: 'flex-start' }}>
      <Input
        {...register('length', {
          setValueAs: (value) => parseInt(value),
        })}
        label={t('modules.captcha.length', {
          choices: '(4, 6, 8)',
        })}
        error={formErrors.length?.message}
      />

      <Input
        {...register('max_retries', {
          setValueAs: (value) => parseInt(value),
        })}
        label={t('modules.captcha.max_tries')}
        error={formErrors.max_retries?.message}
      />

      <InputSelect
        options={formatedRoles}
        value={verificationRole}
        setValue={setVerificationRole}
        type="role"
      >
        {t('modules.captcha.role_to_add')}
      </InputSelect>
      {formErrors.role_id ? (
        <FieldError message={formErrors.role_id.message} />
      ) : null}

      <InputSelect
        options={[
          { label: '60', value: 60 },
          { label: '300', value: 300 },
          { label: '600', value: 600 },
        ]}
        value={timeoutCaptcha}
        setValue={setTimeoutCaptcha}
      >
        {t('modules.captcha.kick_timeout')}
      </InputSelect>
      {formErrors.timeout ? (
        <FieldError message={formErrors.timeout.message} />
      ) : null}

      <InputSelect
        value={verificationChannel}
        setValue={setVerificationChannel}
        options={formatedChannels}
        type="channel"
      >
        {t('modules.captcha.channel')}
      </InputSelect>
      {formErrors.verification_channel ? (
        <FieldError message={formErrors.verification_channel.message} />
      ) : null}

      <Controller
        name="has_numbers"
        control={control}
        render={({ field }) => {
          return (
            <Checkbox
              onChange={field.onChange}
              checked={field.value}
              ref={field.ref}
            >
              {t('modules.captcha.include_numbers')}
            </Checkbox>
          )
        }}
      />
      {formErrors.has_numbers ? (
        <FieldError message={formErrors.has_numbers.message} />
      ) : null}
      <Controller
        name="case_sensitive"
        control={control}
        render={({ field }) => (
          <Checkbox
            onChange={field.onChange}
            checked={field.value}
            ref={field.ref}
          >
            {t('modules.captcha.case_sensitive')}
          </Checkbox>
        )}
      />
      {formErrors.case_sensitive ? (
        <FieldError message={formErrors.case_sensitive.message} />
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

export { CaptchaForm }
