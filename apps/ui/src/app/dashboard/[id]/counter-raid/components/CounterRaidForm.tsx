import {
  InferModuleConfigType,
  getModuleSchema,
  validateModuleConfig,
} from '@pynspel/common'
import { AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Alert } from '~/app/dashboard/components/Alert'
import { PxToastError } from '~/app/dashboard/components/toast/PxToast'
import { pxToast } from '~/app/dashboard/components/toast/toast-handler'
import { useMutateModule } from '~/app/dashboard/hooks/modules'
import { FlexColumn } from '~/layouts/Flex'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import {
  ButtonDanger,
  ButtonPrimary,
  ButtonSpecial,
  ButtonSuccess,
  ButtonWarn,
} from '~/ui/button/Button'
import { Checkbox } from '~/ui/checkbox/Checkbox'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldError } from '~/app/dashboard/components/form/FieldError'

type LogginFormProps = {
  data: InferModuleConfigType<'counterRaid'>
}

const CounterRaidForum = (props: LogginFormProps) => {
  const { data } = props

  const {
    handleSubmit,
    register,
    getValues,
    control,
    formState: { isDirty, errors },
    setValue,
    reset,
  } = useForm<InferModuleConfigType<'counterRaid'>>({
    defaultValues: {
      action: data.action,
      action_reason: data.action_reason,
      interval: data.interval,
      member_threshold: data.member_threshold,
      mute_timeout: data.mute_timeout,
      mute_unit: data.mute_unit,
      raid_channel_lockdown: data.raid_channel_lockdown,
    },
    resolver: zodResolver(getModuleSchema('counterRaid')),
  })
  const [action, setAction] = useState(getValues('action'))
  const [muteUnit, setMuteUnit] = useState(getValues('mute_unit'))
  const currentGuild = useCurrentGuildValue()

  const mutation = useMutateModule('counterRaid', 'counter-raid')

  const handleSubmitForm = <M extends InferModuleConfigType<'counterRaid'>>(
    data: M
  ) => {
    mutation.mutateAsync(data).then(() => {
      reset(getValues())
    })
  }

  // TODO: Refactor this shit, add on change on InputSelect.
  useEffect(() => {
    setValue('action', action, {
      shouldDirty: true,
    })
  }, [action])

  useEffect(() => {
    setValue('mute_unit', muteUnit, {
      shouldDirty: true,
    })
  }, [muteUnit])

  if (!currentGuild) {
    return 'Invalid guild.'
  }

  return (
    <FlexColumn style={{ gap: 10, alignItems: 'flex-start' }}>
      <Input
        {...register('member_threshold', {
          setValueAs: (value) => parseInt(value),
        })}
        label="Nombres de personnes qui rejoignent"
        error={Boolean(errors.member_threshold)}
      />
      {errors.member_threshold?.message ? (
        <FieldError message={errors.member_threshold.message} />
      ) : null}
      <Input
        {...register('interval', {
          setValueAs: (value) => parseInt(value),
        })}
        label="L'interval dans lequel ils doivent rejoindre pour activer l'anti raid"
        error={Boolean(errors.member_threshold)}
      />
      {errors.interval?.message ? (
        <FieldError message={errors.interval.message} />
      ) : null}
      <InputSelect
        options={[
          { label: 'Aucune', value: 'none' },
          { label: 'Kick', value: 'kick' },
          { label: 'Ban', value: 'ban' },
          { label: 'Mute', value: 'mute' },
        ]}
        value={action}
        setValue={setAction}
      >
        L'action a prendre
      </InputSelect>
      {errors.action?.message ? (
        <FieldError message={errors.action.message} />
      ) : null}
      <Input
        error={Boolean(errors.action_reason)}
        {...register('action_reason')}
        label='Raison de l"action'
      />
      {errors.action_reason?.message ? (
        <FieldError message={errors.action_reason.message} />
      ) : null}
      {/* TODO: Add warning to prevent to check all the permissions */}

      <Controller
        name="raid_channel_lockdown"
        control={control}
        render={({ field }) => {
          return (
            <Checkbox {...field}>
              Fermer tout les channels{' '}
              <span style={{ color: '#D86767' }}>
                Attention, il faudra remettre les permissions manuellement
              </span>
            </Checkbox>
          )
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
          >
            Le temps du mute
          </InputSelect>
          <Input
            {...register('mute_timeout', {
              setValueAs: (value) => parseInt(value),
            })}
            label={`Temps du mute, ${
              muteUnit === 'day' ? '(1 to 5)' : '1 to 7200'
            }`}
            error={Boolean(errors.mute_timeout)}
          />
          {errors.mute_timeout?.message ? (
            <FieldError message={errors.mute_timeout.message} />
          ) : null}
        </>
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

export { CounterRaidForum }
