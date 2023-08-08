import {
  Bot,
  Check,
  ChevronRightSquare,
  Lock,
  RotateCcw,
  ScanLine,
  ScrollText,
  Ticket,
} from 'lucide-react'
import { BiHome } from 'react-icons/bi'

export const asideItemsData = [
  {
    link: '/bot',
    label: 'Bot',
    icon: <Bot strokeWidth={1.5} size={20} />,
    name: 'bot',
  },
  {
    link: '/counter-raid',
    label: 'Anti-Raid',
    icon: <Lock strokeWidth={1.5} size={20} />,
    name: 'counterRaid',
  },
  {
    link: '/captcha',
    label: 'Captcha',
    icon: <RotateCcw strokeWidth={1.5} size={20} />,
    name: 'captcha',
  },
  {
    link: '/logging',
    label: 'Logging',
    icon: <ScrollText strokeWidth={1.5} size={20} />,
    name: 'logging',
  },
  {
    link: '/command',
    label: 'Commandes',
    icon: <ChevronRightSquare strokeWidth={1.5} size={20} />,
    name: 'command',
  },
  {
    link: '/ticket',
    label: 'Tickets',
    icon: <Ticket strokeWidth={1.5} size={20} />,
    name: 'ticket',
  },
  {
    link: '/scanner',
    label: 'Scanner',
    icon: <ScanLine strokeWidth={1.5} size={20} />,
    name: 'scanner',
  },
]
