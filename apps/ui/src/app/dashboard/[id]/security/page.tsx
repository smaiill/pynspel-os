'use client'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useGuildService } from '~/hooks/useGuildService'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import { FlexColumn } from '~/layouts/Flex'
import { selectedGuild, useSelectedGuildSnapshot } from '~/proxys/dashboard'
import { captchaModuleProxy, useCaptchaModuleSnapshpt } from '~/proxys/modules'
import { ButtonPrimary } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'
import Aside from '../../components/Aside'
import { fetchApi } from '~/utils/fetchApi'
import { InferModuleConfigType, Modules } from '@pynspel/common'

type Props = {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  const { guild } = useSelectedGuildSnapshot()
  const { getGuild } = useGuildService()
  const { register, handleSubmit } = useForm()
  const { id } = params
  const captchaSnapshot = useCaptchaModuleSnapshpt()
  const [verificationChannel, setVerificationChannel] = useState<string | null>(
    captchaModuleProxy?.configuration?.verification_channel ?? null
  )

  useEffect(() => {
    const fetchGuild = async () => {
      const res = await getGuild({ guildId: id })

      selectedGuild.guild = res
    }

    !guild && fetchGuild()
  }, [])

  const { data } = useQuery({
    queryKey: ['module_captcha', guild?.guild_id],
    enabled: !!guild && captchaSnapshot.configuration === null,
    queryFn: async () =>
      await fetchApi<{
        captcha_module: InferModuleConfigType<(typeof Modules)['captcha']>
      }>(`/api/dashboard/captcha/${guild?.guild_id}`),
    onSuccess(data) {
      captchaModuleProxy.configuration = data.captcha_module
      setVerificationChannel(data.captcha_module.verification_channel)
    },
  })

  if (!guild) {
    return <h1>Loading guild...</h1>
  }

  if (!data) {
    return <h1>No data...</h1>
  }

  const formatedChannels = guild.channels.map((channel) => {
    return { label: channel.name, value: channel.id }
  })

  return (
    <DashboardPage>
      <Aside />
      <DashboardView>
        <FlexColumn style={{ gap: 10 }}>
          <Input
            defaultValue={captchaSnapshot.configuration?.length}
            {...register('length')}
            label="Taille du Captcha"
          />

          <InputSelect
            value={verificationChannel}
            setValue={setVerificationChannel}
            options={formatedChannels}
          >
            Status du bot
          </InputSelect>

          <ButtonPrimary
            onClick={handleSubmit(
              async (data) =>
                await fetchApi<{ captcha_module: any }>(
                  `/api/dashboard/captcha/${guild?.guild_id}`,
                  {
                    method: 'PUT',
                    body: JSON.stringify({
                      config: {
                        ...data,
                        verification_channel: verificationChannel,
                      },
                    }),
                  }
                ).then(
                  (res) =>
                    (captchaModuleProxy.configuration = res.captcha_module)
                )
            )}
            type="submit"
          >
            Mettre a jour !
          </ButtonPrimary>
        </FlexColumn>
      </DashboardView>
    </DashboardPage>
  )
}

export default page
