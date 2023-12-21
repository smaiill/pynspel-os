import { zodResolver } from '@hookform/resolvers/zod'
import { TICKET_PANEL_NAME } from '@pynspel/common'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { ButtonPrimary } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'
import { usePanelMutations } from '../panels/hooks/usePanelMutations'

const CreatePanel = () => {
  const {
    createPanel: { mutateAsync },
  } = usePanelMutations()

  const zCreatePanel = z.object({ name: TICKET_PANEL_NAME })

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(zCreatePanel),
  })

  const { t } = useTranslation()

  const handleCreatePanel = (data: z.infer<typeof zCreatePanel>) => {
    mutateAsync(data).then(() => {
      reset()
    })
  }

  return (
    <FlexColumn style={{ gap: 10, alignItems: 'flex-start' }}>
      <Input
        {...register('name')}
        label={t('modules.ticket.create_panel_name')}
        error={errors.name?.message}
        required
      />

      <ButtonPrimary
        hidden={!isDirty}
        onClick={handleSubmit(handleCreatePanel)}
      >
        {t('actions.add')}
      </ButtonPrimary>
    </FlexColumn>
  )
}

export default CreatePanel
