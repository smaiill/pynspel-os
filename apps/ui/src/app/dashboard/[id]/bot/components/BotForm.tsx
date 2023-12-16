import { InferModuleConfigType, validateModuleConfig } from '@pynspel/common'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '~/app/dashboard/components/form/Form'
import { useMutateModule } from '~/app/dashboard/hooks/modules'
import { ButtonPrimary } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'

const MODULE_NAME = 'bot'

type LogginFormProps = {
  data: InferModuleConfigType<typeof MODULE_NAME>
}
const BotForm = (props: LogginFormProps) => {
  const { data } = props

  const { handleSubmit, getValues, setError, register } = useForm<
    InferModuleConfigType<typeof MODULE_NAME>
  >({
    defaultValues: {
      language: data.language,
      name: data.name,
      status: data.status,
    },
  })
  const [status, setStatus] = useState(getValues('status'))
  const mutation = useMutateModule(MODULE_NAME)

  const handleSubmitForm = (
    data: InferModuleConfigType<typeof MODULE_NAME>
  ) => {
    const groupedData = { ...data, status }
    const parsedSchema = validateModuleConfig(MODULE_NAME, groupedData)

    if (!parsedSchema.success) {
      const errors = parsedSchema.error
      for (const err of errors) {
        setError(
          err.path[0] as keyof InferModuleConfigType<typeof MODULE_NAME>,
          {
            message: err.message,
          }
        )
      }

      return
    }

    mutation.mutate(parsedSchema.data)
  }

  return (
    <Form onSubmit={handleSubmit(handleSubmitForm)}>
      <Input {...register('name')} label="Le nom du bot" />

      <InputSelect
        options={[
          { label: 'dnd', value: 'dnd' },
          { label: 'online', value: 'online' },
          { label: 'idle', value: 'idle' },
        ]}
        setValue={setStatus}
        value={status}
      ></InputSelect>

      <ButtonPrimary disabled={mutation.isLoading} type="submit">
        Enregistrer
      </ButtonPrimary>
    </Form>
  )
}

export default BotForm
