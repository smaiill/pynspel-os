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

type LogginFormProps = {
  data: InferModuleConfigType<'command'>
}
const CommandForm = (props: LogginFormProps) => {
  const { data } = props

  const {
    handleSubmit,
    control,
    formState: { isDirty, errors: formErrors },
  } = useForm<InferModuleConfigType<'command'>>({
    defaultValues: {
      ban: data.ban,
      kick: data.kick,
    },
    resolver: zodResolver(getModuleSchema('command')),
  })
  const { mutate, errors } = useMutateModule('command')

  const handleSubmitForm = (data: InferModuleConfigType<'command'>) => {
    mutate(data)
  }

  return (
    <FlexColumn style={{ gap: 10 }}>
      <Controller
        name="ban"
        control={control}
        render={({ field }) => {
          return <Checkbox {...field}>Bannir une personne</Checkbox>
        }}
      />
      {formErrors?.ban || errors?.ban ? (
        <FieldError message={errors?.ban?.message ?? errors?.ban?.message} />
      ) : null}

      <Controller
        name="kick"
        control={control}
        render={({ field }) => (
          <Checkbox {...field}>Exclure une personne</Checkbox>
        )}
      />
      {formErrors?.kick || errors?.kick ? (
        <FieldError message={errors?.kick?.message ?? errors?.kick?.message} />
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
