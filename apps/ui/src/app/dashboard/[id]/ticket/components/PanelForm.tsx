import React from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '~/app/dashboard/components/form/Form'
import { FlexColumn } from '~/layouts/Flex'
import { ButtonPrimary } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'
import { usePanelMutation } from '../panels/hooks/usePanelMutation'
import { z } from 'zod'

type Props = {
  data: any
}

export const PanelForm = (props: Props) => {
  const { data } = props

  console.log({ data })
  const mutation = usePanelMutation(data.id)

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: data.name,
      message: data.message,
    },
  })

  const handleUpdatePanel = (data: any) => {
    // TODO: Validate the data

    mutation.mutate(data)
  }

  return (
    <FlexColumn style={{ gap: 5 }}>
      <Input {...register('name')} label="Nom du panel" />
      <Input {...register('message')} label="Message" />

      <ButtonPrimary
        onClick={handleSubmit(handleUpdatePanel)}
        disabled={mutation.isLoading}
        type="submit"
      >
        Enregistrer
      </ButtonPrimary>
    </FlexColumn>
  )
}
