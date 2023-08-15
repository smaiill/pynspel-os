import { zodResolver } from '@hookform/resolvers/zod'
import { getModuleSchema, InferModuleConfigType } from '@pynspel/common'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FieldError } from '~/app/dashboard/components/form/FieldError'
import { useMutateModule } from '~/app/dashboard/hooks/modules'
import { FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { ButtonPrimary } from '~/ui/button/Button'
import { Checkbox } from '~/ui/checkbox/Checkbox'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'

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
    watch,
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
  const { t } = useTranslation()
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
        label={t('modules.counter_raid.threshold', {
          time: watch('interval'),
        })}
        error={!!errors.member_threshold}
      />
      {errors.member_threshold?.message ? (
        <FieldError message={errors.member_threshold.message} />
      ) : null}
      <Input
        {...register('interval', {
          setValueAs: (value) => parseInt(value),
        })}
        label={t('modules.counter_raid.interval_to_activate', {
          members: watch('member_threshold'),
        })}
        error={!!errors.member_threshold}
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
        {t('modules.common.action_to_take')}
      </InputSelect>
      {errors.action?.message ? (
        <FieldError message={errors.action.message} />
      ) : null}
      <Input
        error={!!errors.action_reason}
        {...register('action_reason')}
        label={t('modules.counter_raid.action_raison')}
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
              {t('modules.counter_raid.lock_channels')}
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
            {t('modules.common.mute_unit')}
          </InputSelect>
          <Input
            {...register('mute_timeout', {
              setValueAs: (value) => parseInt(value),
            })}
            label={t('modules.common.mute_time')}
            error={!!errors.mute_timeout}
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
          {t('actions.save')}
        </ButtonPrimary>
      ) : null}
    </FlexColumn>
  )
}

export { CounterRaidForum }
