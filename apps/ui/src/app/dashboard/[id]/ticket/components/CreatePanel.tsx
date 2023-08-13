import { useForm } from 'react-hook-form'
import { FlexColumn } from '~/layouts/Flex'
import { ButtonPrimary } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'
import { usePanelMutations } from '../panels/hooks/usePanelMutations'

const CreatePanel = () => {
  const {
    createPanel: { mutateAsync },
  } = usePanelMutations()

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
    },
  })

  const handleCreatePanel = (data: any) => {
    mutateAsync(data).then(() => {
      reset()
    })
  }

  return (
    <FlexColumn style={{ gap: 10, alignItems: 'flex-start' }}>
      <Input {...register('name')} label="Nom de votre panel" />

      <ButtonPrimary
        disabled={!isDirty}
        onClick={handleSubmit(handleCreatePanel)}
      >
        Ajouter
      </ButtonPrimary>
    </FlexColumn>
  )
}

export default CreatePanel
