import { InferModuleConfigType, validateModuleConfig } from '@pynspel/common'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FieldError } from '~/app/dashboard/components/form/FieldError'
import { selectedGuild } from '~/proxys/dashboard'
import { ButtonPrimary } from '~/ui/button/Button'
import { Checkbox } from '~/ui/checkbox/Checkbox'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'
import { css } from '../../../../../../styled-system/css'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchApi } from '~/utils/fetchApi'
import { useMutateModule } from '~/app/dashboard/hooks/modules'

type Props = {
  data: InferModuleConfigType<'captcha'>
}

const CaptchaForm = (props: Props) => {
  const { data } = props
  const currentGuild = selectedGuild.guild
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setError,
    formState: { errors: formErrors },
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
  })
  const [verificationRole, setVerificationRole] = useState(getValues('role_id'))
  const [timeoutCaptcha, setTimeoutCaptcha] = useState(getValues('timeout'))
  const [verificationChannel, setVerificationChannel] = useState(
    getValues('verification_channel')
  )
  const mutation = useMutateModule('captcha')

  if (!currentGuild) {
    return <h1>Invalid guild.</h1>
  }

  const formatedRoles = currentGuild.roles.map((role) => {
    return { label: role.name, value: role.id }
  })

  const formatedChannels = currentGuild.channels.map((channel) => {
    return { label: channel.name, value: channel.id }
  })

  const handleSubmitForm = (data: InferModuleConfigType<'captcha'>) => {
    const parsedSchema = validateModuleConfig('captcha', {
      ...data,
      verification_channel: verificationChannel,
      role_id: verificationRole,
      timeout: timeoutCaptcha,
    })

    if (!parsedSchema.success) {
      const errors = parsedSchema.error
      for (const err of errors) {
        setError(err.path[0] as keyof InferModuleConfigType<'captcha'>, {
          message: err.message,
        })
      }

      return
    }
    mutation.mutate(parsedSchema.data)
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <Input
        {...register('length', {
          setValueAs: (value) => parseInt(value),
        })}
        label="Taille du Captcha"
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
      />

      <InputSelect
        options={formatedRoles}
        value={verificationRole}
        setValue={setVerificationRole}
      >
        Role de vérification
      </InputSelect>

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

      <InputSelect
        value={verificationChannel}
        setValue={setVerificationChannel}
        options={formatedChannels}
      >
        Canal de vérification
      </InputSelect>

      <Controller
        name="has_numbers"
        control={control}
        render={({ field }) => {
          return <Checkbox {...field}>Inclure des nombres</Checkbox>
        }}
      />

      <Controller
        name="case_sensitive"
        control={control}
        render={({ field }) => (
          <Checkbox {...field}>Sensible a la casse</Checkbox>
        )}
      />

      <ButtonPrimary disabled={mutation.isLoading} type="submit">
        Enregistrer
      </ButtonPrimary>
    </form>
  )
}

export { CaptchaForm }
