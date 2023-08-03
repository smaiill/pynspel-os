'use client'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
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
import {
  InferModuleConfigType,
  Modules,
  ModulesTypes,
  getModuleDefaultConfig,
} from '@pynspel/common'
import { Checkbox } from '~/ui/checkbox/Checkbox'
import { useFetchModule } from '../../hooks/modules'
import { useFetchGuild } from '../../hooks/useFetchGuild'
import ScannerForm from './components/ScannerForm'
import { TicketPanels } from '../ticket/components/TicketPanels'

type Props = {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  const { id } = params
  const { data: guildData } = useFetchGuild(id)
  const { data: moduleData } = useFetchModule(Modules.scanner, id)

  if (!guildData) {
    return <h1>Loading guild...</h1>
  }

  if (!moduleData) {
    return <h1>Loading module data...</h1>
  }

  return (
    <DashboardPage>
      <Aside />
      <DashboardView>
        <FlexColumn style={{ gap: 10 }}>
          {!guildData ? 'Loading...' : <ScannerForm data={moduleData} />}
        </FlexColumn>
      </DashboardView>
    </DashboardPage>
  )
}

export default page
