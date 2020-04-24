import * as React from 'react'
import HelperContent from '@/components/HelperContent'
import toast from 'cogo-toast'
import { exchange, getMYR, getNTD } from '@/exchange'
import { localStorage } from '@/localStorage'
import { emitter, Events } from '@/emitter'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setExchangeSelected } from '@/actions/setExchangeSelected'
import { setMacroEnabled } from '@/actions/setMacroEnabled'

const Sidebar: React.FunctionComponent = () => {
  const settings = useAppSelector(state => state.settings)
  const dispatch = useAppDispatch()

  return (
    <React.Fragment>
      <div className='i-menu-sep'>新台幣＆馬幣增強腳本</div>

      <a
        className='i-menu-link pointer'
        target='_blank'
        href='https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3'
      >
        <span className='i-menu-icon sprite news'></span>腳本官網
      </a>

      <a
        className='i-menu-link pointer'
        target='_blank'
        href='https://www.notion.so/hilezi/50a7f39ce9a84325a22b98acf67cffb2'
      >
        <span className='i-menu-icon sprite help'></span>聯絡作者
      </a>

      <HelperContent.RiskSpecification aClassName={'i-menu-link'}>
        <span className={'i-menu-icon sprite help'}></span>
      </HelperContent.RiskSpecification>

      <span
        onClick={async () => {
          const loading = toast.loading('設定變更中...', {
            position: 'bottom-left',
          })

          const youSelected: typeof exchange['selected'] =
            settings.exchange.selected === 'NTD' ? 'MYR' : 'NTD'

          if (youSelected === 'NTD') {
            exchange.NTD = await getNTD()
          }

          if (youSelected === 'MYR') {
            exchange.MYR = await getMYR()
          }

          dispatch(setExchangeSelected(youSelected))
          localStorage.setSelectedExchange(youSelected)
          emitter.emit(Events.settingChange)
          toast.success(`設定已變更，當前：${youSelected}`, {
            position: 'bottom-left',
          })

          loading.hide?.()
        }}
        className='i-menu-link pointer'
      >
        <span className='i-menu-icon sprite settings'></span>
        設定幣別（當前：<span>{settings.exchange.selected}</span>）
      </span>

      <span
        onClick={() => {
          const yourEnabled = !settings.isMacroEnabled
          dispatch(setMacroEnabled(yourEnabled))
          localStorage.setExecutionMacroEnabled(yourEnabled)
          emitter.emit(Events.settingChange)
          toast.success(`設定已變更，啟用：${yourEnabled}`, {
            position: 'bottom-left',
          })
        }}
        className='i-menu-link pointer'
      >
        <span className='i-menu-icon sprite settings'></span>
        下單巨集（當前：
        <span>{settings.isMacroEnabled ? '啟用' : '停用'}</span>）
      </span>
    </React.Fragment>
  )
}

export default Sidebar