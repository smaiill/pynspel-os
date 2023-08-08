import { zodResolver } from '@hookform/resolvers/zod'
import {
  InferModuleConfigType,
  getModuleSchema,
  validateModuleConfig,
} from '@pynspel/common'
import { Controller, useForm } from 'react-hook-form'
import { FieldError } from '~/app/dashboard/components/form/FieldError'
import { Form } from '~/app/dashboard/components/form/Form'
import { useMutateModule } from '~/app/dashboard/hooks/modules'
import { FlexColumn } from '~/layouts/Flex'
import { ButtonPrimary } from '~/ui/button/Button'
import { Checkbox } from '~/ui/checkbox/Checkbox'
import { Typography } from '~/ui/typography/Typography'

type LogginFormProps = {
  data: InferModuleConfigType<'command'>
}
const CommandForm = (props: LogginFormProps) => {
  const { data } = props

  const {
    handleSubmit,
    control,
    formState: { isDirty, errors: formErrors },
    reset,
    getValues,
  } = useForm<InferModuleConfigType<'command'>>({
    defaultValues: {
      ban: data.ban,
      kick: data.kick,
    },
    resolver: zodResolver(getModuleSchema('command')),
  })
  const mutation = useMutateModule('command')

  const handleSubmitForm = (data: InferModuleConfigType<'command'>) => {
    mutation.mutateAsync(data).then(() => reset(getValues()))
  }

  return (
    <FlexColumn style={{ gap: 10, alignItems: 'flex-start' }}>
      <Typography color="warn" as="span">
        TODO: Make it as cards
      </Typography>
      <Controller
        name="ban"
        control={control}
        render={({ field }) => {
          return <Checkbox {...field}>Bannir une personne</Checkbox>
        }}
      />
      {formErrors.ban ? <FieldError message={formErrors.ban.message} /> : null}

      <Controller
        name="kick"
        control={control}
        render={({ field }) => (
          <Checkbox {...field}>Exclure une personne</Checkbox>
        )}
      />
      {formErrors?.kick ? (
        <FieldError message={formErrors.kick.message} />
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

export default CommandForm
