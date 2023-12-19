import { zodResolver } from '@hookform/resolvers/zod'
import { getModuleSchema, InferModuleConfigType } from '@pynspel/common'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutateModule } from '~/app/dashboard/hooks/modules'
import { FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { ButtonPrimary } from '~/ui/button/Button'
import { Checkbox } from '~/ui/checkbox/Checkbox'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'
import { css } from '../../../../../../styled-system/css'

const MODULE_NAME = 'counterRaid'

type LogginFormProps = {
  data: InferModuleConfigType<typeof MODULE_NAME>
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
  } = useForm<InferModuleConfigType<typeof MODULE_NAME>>({
    defaultValues: {
      action: data.action,
      action_reason: data.action_reason,
      interval: data.interval,
      member_threshold: data.member_threshold,
      mute_timeout: data.mute_timeout,
      mute_unit: data.mute_unit,
      raid_channel_lockdown: data.raid_channel_lockdown,
    },
    resolver: zodResolver(getModuleSchema(MODULE_NAME)),
  })
  const { t } = useTranslation()
  const [action, setAction] = useState(getValues('action'))
  const [muteUnit, setMuteUnit] = useState(getValues('mute_unit'))

  const mutation = useMutateModule(MODULE_NAME, 'counter-raid')

  const handleSubmitForm = <
    M extends InferModuleConfigType<typeof MODULE_NAME>
  >(
    data: M
  ) => {
    mutation.mutateAsync(data).then(() => {
      reset(getValues())
    })
  }

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

  return (
    <FlexColumn style={{ gap: 10, alignItems: 'flex-start' }}>
      <Input
        {...register('member_threshold', {
          setValueAs: (value) => parseInt(value),
        })}
        label={t('modules.counter_raid.threshold', {
          time: watch('interval'),
        })}
        error={errors.interval?.message}
        type="number"
      />
      <Input
        {...register('interval', {
          setValueAs: (value) => parseInt(value),
        })}
        label={t('modules.counter_raid.interval_to_activate', {
          members: watch('member_threshold'),
        })}
        error={errors.member_threshold?.message}
        type="number"
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
        error={errors.action?.message}
      >
        {t('modules.common.action_to_take')}
      </InputSelect>

      <Input
        {...register('action_reason')}
        label={t('modules.counter_raid.action_raison')}
        error={errors.action_reason?.message}
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
            error={errors.mute_unit?.message}
          >
            {t('modules.common.mute_unit')}
          </InputSelect>
          <Input
            {...register('mute_timeout', {
              setValueAs: (value) => parseInt(value),
            })}
            label={t('modules.common.mute_time')}
            error={errors.mute_timeout?.message}
          />
        </>
      ) : null}

      <Controller
        name="raid_channel_lockdown"
        control={control}
        render={({ field }) => {
          return (
            <Checkbox
              styles={{ label: css({ color: 'red.400 !important' }) }}
              onChange={field.onChange}
              checked={field.value}
              ref={field.ref}
            >
              {t('modules.counter_raid.lock_channels')}
            </Checkbox>
          )
        }}
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

export { CounterRaidForum }
