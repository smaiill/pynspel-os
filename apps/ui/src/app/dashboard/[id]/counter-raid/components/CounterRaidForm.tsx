import { InferModuleConfigType, validateModuleConfig } from '@pynspel/common'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { PropsWithChildren, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Form } from '~/app/dashboard/components/form/Form'
import { useMutateModule } from '~/app/dashboard/hooks/modules'
import { FlexColumn } from '~/layouts/Flex'
import { selectedGuild } from '~/proxys/dashboard'
import { ButtonPrimary } from '~/ui/button/Button'
import { Checkbox } from '~/ui/checkbox/Checkbox'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'
import { InputSelectType } from '~/ui/input/InputSelectType'
import { fetchApi } from '~/utils/fetchApi'

type LogginFormProps = {
  data: InferModuleConfigType<'counterRaid'>
}

const CounterRaidForum = (props: LogginFormProps) => {
  const { data } = props

  const { handleSubmit, setError, register, getValues, control } = useForm<
    InferModuleConfigType<'counterRaid'>
  >({
    defaultValues: {
      action: data.action,
      action_reason: data.action_reason,
      interval: data.interval,
      member_threshold: data.member_threshold,
      mute_timeout: data.mute_timeout,
      mute_unit: data.mute_unit,
      raid_channel_lockdown: data.raid_channel_lockdown,
    },
  })
  const [action, setAction] = useState(getValues('action'))
  const [muteUnit, setMuteUnit] = useState(getValues('mute_unit'))
  const currentGuild = selectedGuild.guild

  const mutation = useMutateModule('counterRaid', 'counter-raid')

  const handleSubmitForm = <M extends InferModuleConfigType<'counterRaid'>>(
    data: M
  ) => {
    const groupedData = { ...data, action } as M
    const parsedSchema = validateModuleConfig('counterRaid', groupedData)

    if (!parsedSchema.success) {
      const errors = parsedSchema.error
      for (const err of errors) {
        setError(err.path[0] as any, {
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
    <FlexColumn style={{ gap: 10 }} onSubmit={handleSubmit(handleSubmitForm)}>
      <Input
        {...register('member_threshold', {
          setValueAs: (value) => parseInt(value),
        })}
        label="Nombres de personnes qui rejoignent"
      />
      <Input
        {...register('interval', {
          setValueAs: (value) => parseInt(value),
        })}
        label="L'interval dans lequel ils doivent rejoindre pour activer l'anti raid"
      />
      <InputSelect
        options={[
          { label: 'Aucune', value: 'none' },
          { label: 'Kick', value: 'kick' },
          { label: 'Ban', value: 'ban' },
          { label: 'Mute', value: 'mute' },
        ]}
        value={action}
        setValue={setAction}
      />
      <Input {...register('action_reason')} label='Raison de l"action' />
      <Controller
        name="raid_channel_lockdown"
        control={control}
        render={({ field }) => {
          return <Checkbox {...field}>Fermer tout les channels</Checkbox>
        }}
      />
      {action === 'mute' ? (
        <>
          <InputSelect
            options={[
              { label: 'Minutes', value: 'minute' },
              { label: 'Jours', value: 'day' },
            ]}
            value={muteUnit}
            setValue={setMuteUnit}
          />
          <Input
            {...register('mute_timeout', {
              setValueAs: (value) => parseInt(value),
            })}
            label="Temps du mute"
          />
        </>
      ) : null}
      <ButtonPrimary disabled={mutation.isLoading} type="submit">
        Enregistrer
      </ButtonPrimary>
    </FlexColumn>
  )
}

export { CounterRaidForum }
