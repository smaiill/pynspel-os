import { zodResolver } from '@hookform/resolvers/zod'
import {
  InferModuleConfigType,
  getModuleSchema,
  validateModuleConfig,
} from '@pynspel/common'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FieldError } from '~/app/dashboard/components/form/FieldError'
import { useMutateModule } from '~/app/dashboard/hooks/modules'
import { FlexColumn } from '~/layouts/Flex'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { ButtonPrimary } from '~/ui/button/Button'
import { Checkbox } from '~/ui/checkbox/Checkbox'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'

type Props = {
  data: InferModuleConfigType<'captcha'>
}

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
  } = useForm<InferModuleConfigType<'captcha'>>({
    defaultValues: {
      has_numbers: data.has_numbers,
      case_sensitive: data.case_sensitive,
      length: data.length,
      max_retries: data.max_retries,
      role_id: data.role_id,
      timeout: data.timeout,
      verification_channel: data.verification_channel,
    },

    resolver: zodResolver(getModuleSchema('captcha')),
  })

  const [verificationRole, setVerificationRole] = useState(getValues('role_id'))
  const [timeoutCaptcha, setTimeoutCaptcha] = useState(getValues('timeout'))
  const [verificationChannel, setVerificationChannel] = useState(
    getValues('verification_channel')
  )

  const mutation = useMutateModule('captcha')

  // TODO: useCurrentGuildRoles

  const handleSubmitForm = (data: InferModuleConfigType<'captcha'>) => {
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

  if (!currentGuild) {
    return <h1>Invalid guild.</h1>
  }

  const formatedRoles = currentGuild.roles
    .filter((_role) => _role.id !== currentGuild.guild_id)
    .map((role) => {
      return { label: role.name, value: role.id, color: role.color }
    })

  // TODO: useCurrentGuildChannels;
  const formatedChannels = currentGuild.channels.map((channel) => {
    return { label: channel.name, value: channel.id }
  })

  return (
    <FlexColumn style={{ gap: 10, alignItems: 'flex-start' }}>
      <Input
        {...register('length', {
          setValueAs: (value) => parseInt(value),
        })}
        label="Taille du Captcha, (4, 6, 8)"
        error={!!formErrors.length}
      />
      {formErrors.length ? (
        <FieldError message={formErrors.length.message} />
      ) : null}

      <Input
        {...register('max_retries', {
          setValueAs: (value) => parseInt(value),
        })}
        label="Nombres d'essai max"
        error={!!formErrors.max_retries}
      />
      {formErrors.max_retries ? (
        <FieldError message={formErrors.max_retries.message} />
      ) : null}
      <InputSelect
        options={formatedRoles}
        value={verificationRole}
        setValue={setVerificationRole}
        type="role"
      >
        Le role qui sera ajouter après la vérification
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
        Temps avant de kick luser si il na pas résolu le bail
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
        Canal de vérification
      </InputSelect>
      {formErrors.verification_channel ? (
        <FieldError message={formErrors.verification_channel.message} />
      ) : null}

      <Controller
        name="has_numbers"
        control={control}
        render={({ field }) => {
          return <Checkbox {...field}>Inclure des nombres</Checkbox>
        }}
      />
      {formErrors.has_numbers ? (
        <FieldError message={formErrors.has_numbers.message} />
      ) : null}
      <Controller
        name="case_sensitive"
        control={control}
        render={({ field }) => (
          <Checkbox {...field}>Sensible a la casse</Checkbox>
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
          Enregistrer
        </ButtonPrimary>
      ) : null}
    </FlexColumn>
  )
}

export { CaptchaForm }
