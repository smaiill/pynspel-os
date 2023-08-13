import { InferModuleConfigType, TICKET_MAX_PER_USER } from '@pynspel/common'
import { useForm } from 'react-hook-form'
import { FieldError } from '~/app/dashboard/components/form/FieldError'
import { useMutateModule } from '~/app/dashboard/hooks/modules'
import { FlexColumn } from '~/layouts/Flex'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { ButtonPrimary } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'

type LogginFormProps = {
  data: InferModuleConfigType<'ticket'>
}

const TicketForm = (props: LogginFormProps) => {
  const { data } = props

  const {
    handleSubmit,
    formState: { isDirty, errors },
    register,
  } = useForm<InferModuleConfigType<'ticket'>>({
    defaultValues: {
      max_each_user: data.max_each_user,
    },
  })
  const currentGuild = useCurrentGuildValue()

  const mutation = useMutateModule('ticket')

  const handleSubmitForm = (data: InferModuleConfigType<'ticket'>) => {
    mutation.mutate(data)
  }

  if (!currentGuild) {
    return 'Invalid guild.'
  }

  return (
    <FlexColumn style={{ gap: 10, alignItems: 'flex-start' }}>
      <Input
        {...register('max_each_user', {
          setValueAs: (value) => parseInt(value),
        })}
        label={`Le nombres de tickets max par personne, (maximum ${TICKET_MAX_PER_USER})`}
        error={!!errors.max_each_user}
      />
      {errors.max_each_user ? (
        <FieldError message={errors.max_each_user.message} />
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

export default TicketForm
