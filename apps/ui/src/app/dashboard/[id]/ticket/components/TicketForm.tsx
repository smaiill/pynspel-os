import { InferModuleConfigType, validateModuleConfig } from '@pynspel/common'
import { useForm } from 'react-hook-form'
import { Form } from '~/app/dashboard/components/form/Form'
import { useMutateModule } from '~/app/dashboard/hooks/modules'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { ButtonPrimary } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'

type LogginFormProps = {
  data: InferModuleConfigType<'ticket'>
}

const TicketForm = (props: LogginFormProps) => {
  const { data } = props

  const { handleSubmit, setError, register } = useForm<
    InferModuleConfigType<'ticket'>
  >({
    defaultValues: {
      max_each_user: data.max_each_user,
    },
  })
  const currentGuild = useCurrentGuildValue()

  const mutation = useMutateModule('ticket')

  const handleSubmitForm = (data: InferModuleConfigType<'ticket'>) => {
    const parsedSchema = validateModuleConfig('ticket', data)

    console.log(parsedSchema)
    if (!parsedSchema.success) {
      const errors = parsedSchema.error
      for (const err of errors) {
        setError(err.path[0] as keyof InferModuleConfigType<'ticket'>, {
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

  return (
    <Form onSubmit={handleSubmit(handleSubmitForm)}>
      <Input
        {...register('max_each_user', {
          setValueAs: (value) => parseInt(value),
        })}
        label="Le nombres de tickets max par personne"
      />

      <ButtonPrimary disabled={mutation.isLoading} type="submit">
        Enregistrer
      </ButtonPrimary>
    </Form>
  )
}

export default TicketForm
