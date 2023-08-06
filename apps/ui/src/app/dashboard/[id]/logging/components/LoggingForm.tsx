import { InferModuleConfigType, validateModuleConfig } from '@pynspel/common'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Form } from '~/app/dashboard/components/form/Form'
import { useMutateModule } from '~/app/dashboard/hooks/modules'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { ButtonPrimary } from '~/ui/button/Button'
import { Checkbox } from '~/ui/checkbox/Checkbox'
import { InputSelect } from '~/ui/input/InputSelect'

type LogginFormProps = {
  data: InferModuleConfigType<'logging'>
}
const LoggingForm = (props: LogginFormProps) => {
  const { data } = props

  const { handleSubmit, control, setError, getValues } = useForm<
    InferModuleConfigType<'logging'>
  >({
    defaultValues: {
      user_join: data.user_join,
      user_left: data.user_left,
      channel: data.channel,
    },
  })
  const [verificationChannel, setVerificationChannel] = useState(
    getValues('channel')
  )
  const currentGuild = useCurrentGuildValue()

  const mutation = useMutateModule('logging')

  const handleSubmitForm = (data: InferModuleConfigType<'logging'>) => {
    const parsedSchema = validateModuleConfig('logging', {
      ...data,
      channel: verificationChannel,
    })

    if (!parsedSchema.success) {
      const errors = parsedSchema.error
      for (const err of errors) {
        setError(err.path[0] as keyof InferModuleConfigType<'logging'>, {
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
    <Form onSubmit={handleSubmit(handleSubmitForm)}>
      <InputSelect
        value={verificationChannel}
        setValue={setVerificationChannel}
        options={formatedChannels}
      >
        Le channel sur lequel envoyer les logs.
      </InputSelect>
      <Controller
        name="user_join"
        control={control}
        render={({ field }) => {
          return (
            <Checkbox {...field}>
              Quand une personne rejoint le serveur
            </Checkbox>
          )
        }}
      />

      <Controller
        name="user_left"
        control={control}
        render={({ field }) => (
          <Checkbox {...field}>Quand une personne quitte le serveur</Checkbox>
        )}
      />

      <ButtonPrimary disabled={mutation.isLoading} type="submit">
        Enregistrer
      </ButtonPrimary>
    </Form>
  )
}

export default LoggingForm
