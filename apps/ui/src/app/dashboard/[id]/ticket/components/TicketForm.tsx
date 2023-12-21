import { zodResolver } from '@hookform/resolvers/zod'
import {
  getModuleSchema,
  InferModuleConfigType,
  TICKET_MAX_PER_USER,
} from '@pynspel/common'
import { useForm } from 'react-hook-form'
import { useMutateModule } from '~/app/dashboard/hooks/modules'
import { FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { ButtonPrimary } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'

const MODULE_NAME = 'ticket'

type LogginFormProps = {
  data: InferModuleConfigType<typeof MODULE_NAME>
}

const TicketForm = (props: LogginFormProps) => {
  const { data } = props

  const {
    handleSubmit,
    formState: { isDirty, errors },
    register,
  } = useForm<InferModuleConfigType<typeof MODULE_NAME>>({
    defaultValues: {
      max_each_user: data.max_each_user,
    },
    resolver: zodResolver(getModuleSchema(MODULE_NAME)),
  })
  const mutation = useMutateModule(MODULE_NAME)
  const { t } = useTranslation()

  const handleSubmitForm = (
    data: InferModuleConfigType<typeof MODULE_NAME>
  ) => {
    mutation.mutate(data)
  }

  return (
    <FlexColumn style={{ gap: 10, alignItems: 'flex-start' }}>
      <Input
        {...register('max_each_user', {
          setValueAs: (value) => Number(value),
        })}
        label={t('modules.ticket.max_tickets', {
          amount: TICKET_MAX_PER_USER,
        })}
        error={errors.max_each_user?.message}
        type="number"
        required
      />

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

export default TicketForm
