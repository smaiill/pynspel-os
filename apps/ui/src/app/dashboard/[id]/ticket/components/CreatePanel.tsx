import { useForm } from 'react-hook-form'
import { FlexColumn } from '~/layouts/Flex'
import { ButtonSpecial } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'
import { usePanelMutations } from '../panels/hooks/usePanelMutations'

const CreatePanel = () => {
  const { createPanel } = usePanelMutations()

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: '',
    },
  })

  const handleCreatePanel = (data: any) => {
    createPanel.mutate(data)
  }

  return (
    <FlexColumn style={{ gap: 10 }}>
      <Input {...register('name')} label="Nom de votre panel" />
      <ButtonSpecial onClick={handleSubmit(handleCreatePanel)}>
        Ajouter
      </ButtonSpecial>
    </FlexColumn>
  )
}

export default CreatePanel
