import { InferModuleConfigType, validateModuleConfig } from '@pynspel/common'
import { Controller, useForm } from 'react-hook-form'
import { Form } from '~/app/dashboard/components/form/Form'
import { useMutateModule } from '~/app/dashboard/hooks/modules'
import { ButtonPrimary } from '~/ui/button/Button'
import { Checkbox } from '~/ui/checkbox/Checkbox'

type LogginFormProps = {
  data: InferModuleConfigType<'command'>
}
const CommandForm = (props: LogginFormProps) => {
  const { data } = props

  const { handleSubmit, control, setError } = useForm<
    InferModuleConfigType<'command'>
  >({
    defaultValues: {
      ban: data.ban,
      kick: data.kick,
    },
  })
  const mutation = useMutateModule('command')

  const handleSubmitForm = (data: InferModuleConfigType<'command'>) => {
    const parsedSchema = validateModuleConfig('command', data)

    if (!parsedSchema.success) {
      const errors = parsedSchema.error
      for (const err of errors) {
        setError(err.path[0] as keyof InferModuleConfigType<'command'>, {
          message: err.message,
        })
      }

      return
    }

    mutation.mutate(parsedSchema.data)
  }

  return (
    <Form onSubmit={handleSubmit(handleSubmitForm)}>
      <Controller
        name="ban"
        control={control}
        render={({ field }) => {
          return <Checkbox {...field}>Bannir une personne</Checkbox>
        }}
      />

      <Controller
        name="kick"
        control={control}
        render={({ field }) => (
          <Checkbox {...field}>Exclure une personne</Checkbox>
        )}
      />

      <ButtonPrimary disabled={mutation.isLoading} type="submit">
        Enregistrer
      </ButtonPrimary>
    </Form>
  )
}

export default CommandForm
