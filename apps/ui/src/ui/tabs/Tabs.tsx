import {
  Children,
  PropsWithChildren,
  ReactElement,
  useMemo,
  useState,
} from 'react'
import { css } from '../../../styled-system/css'

export const Tabs = ({ children }: PropsWithChildren) => {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = useMemo(
    () =>
      Children.map(
        Children.toArray(children) as ReactElement<
          PropsWithChildren<TabProps>
        >[],
        ({ props }) => props
      ),
    [children]
  )

  const handleChangeTab = (tabIndex: number) => {
    setActiveTab(tabIndex)
  }

  const currentTab = tabs.find((_tab, idx) => idx === activeTab)
  return (
    <div>
      <div
        className={css({
          display: 'flex',
          pos: 'relative',
          w: 'fit-content',
        })}
      >
        {tabs.map((tab, idx) => (
          <button
            className={css({
              p: '20px 40px',
              cursor: 'pointer',
              transition: '.3s',
              color: 'news.fonts.label',

              '&[data-active=true]': {
                color: 'news.fonts.primary',
              },
            })}
            key={idx}
            onClick={() => handleChangeTab(idx)}
            style={
              idx === activeTab
                ? {
                    border: '1px solid transparent',
                    borderBottom: '1px solid white',
                  }
                : {
                    border: '1px solid var(--colors-news-backgrounds-tertiary)',
                    borderBottom: 'none',
                  }
            }
            data-active={idx === activeTab}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{currentTab == undefined ? null : currentTab.children}</div>
    </div>
  )
}

type TabProps = {
  label: string
} & PropsWithChildren

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Tab = (_: TabProps) => null

Tabs.Tab = Tab
