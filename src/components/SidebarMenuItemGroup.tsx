/** @jsx jsx */ import { css, jsx } from '@emotion/react'
import React from 'react'
import cogoToast from 'cogo-toast'
import dayjs from 'dayjs'
import { toggleSetupDialog } from '~/actions/toggleSettingsDialog'
import { AppTrans } from '~/components/AppTrans'
import { BuyText } from '~/components/BuyText'
import { InstrumentIcon } from '~/components/InstrumentIcon'
import { KeyProbe } from '~/components/KeyProbe'
import { ProfitText } from '~/components/ProfitText'
import { SellText } from '~/components/SellText'
import { SetupsDialog } from '~/components/SetupsDialog'
import { SidebarMenuItem } from '~/components/SidebarMenuItem'
import { SidebarPendingOrdersLink } from '~/components/SidebarPendingOrdersLink'
import { SidebarTradeDashboardLink } from '~/components/SidebarTradeDashboardLink'
import { etoroAPI } from '~/etoroAPI'
import { gaAPI, GaEventId } from '~/gaAPI'
import { useAppTranslation } from '~/hooks/useAppTranslation'
import { useAppDispatch, useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'
import packageJSON from '../../package.json'
import { SeeCopingHistory } from '~/modules/CopingPeople/SeeCopingHistory'
import { mt4PromotionProps } from '~/utils/mt5PromotionProps'
import { AppTooltip } from '~/components/AppTooltip'

const sendEvent = (label: string) => {
  gaAPI.sendEvent(GaEventId.sidebar_extensionMenuItemClick, label)
}

const showLatelyHistory = () => {
  const loading = cogoToast.loading(<AppTrans i18nKey='loading'></AppTrans>, {
    position: 'bottom-center',
  })

  sendEvent('show_history_lately')

  etoroAPI
    .getHistory()
    .then(data => {
      const popup = cogoToast.success(
        <div>
          {!data.length
            ? 'N/A'
            : data.slice(0, 5).map(datum => (
                <div
                  key={datum.PositionID}
                  css={css`
                    display: flex;
                    align-items: center;
                    margin: 8px 0;

                    & > span {
                      margin: 0 8px;
                    }
                  `}
                >
                  <span>
                    <InstrumentIcon id={datum.InstrumentID} />
                  </span>
                  <span>{datum.IsBuy ? <BuyText /> : <SellText />}</span>
                  <span>
                    <ProfitText profit={datum.NetProfit} />
                  </span>
                  <span>
                    {dayjs(datum.CloseDateTime).format('MM/DD HH:mm:ss')}
                  </span>
                </div>
              ))}
        </div>,
        {
          position: 'bottom-center',
          hideAfter: 5,
          onClick: () => popup.hide?.(),
        },
      )
    })
    .catch(error => {
      cogoToast.error('ERROR', { position: 'bottom-center' })
    })
    .finally(() => {
      loading.hide?.()
    })
}

export const SidebarMenuItemGroup = () => {
  const locale = useAppTranslation()
  const display = useAppSelector(state => state.display)
  const dispatch = useAppDispatch()

  /** Etoro 左側欄樣式為動態產生名稱，沒有此變量，則無法正確呈現 CSS 樣式 */
  const dynamicStyleClassName =
    Array.from($('.w-menu').get(0).attributes).find(value =>
      value.name.includes('_ngcontent'),
    )?.name || ''

  const attrsToAppend = { [dynamicStyleClassName]: '' }

  return (
    <span
      css={css`
        a {
          color: #d1d3e0;
        }
      `}
    >
      <SidebarMenuItem iconName='people' aProps={mt4PromotionProps}>
        <AppTooltip title={<AppTrans i18nKey='mt5Pros'></AppTrans>}>
          <AppTrans i18nKey='mt5PromotionLink'></AppTrans>
        </AppTooltip>
      </SidebarMenuItem>

      <div {...attrsToAppend} className='i-menu-sep'>
        <span>
          <AppTrans i18nKey='universal_extensionName_text'></AppTrans>
        </span>
        <a
          href='https://github.com/hilezir/etoro-better-ui/releases'
          target='_blank'
        >
          {packageJSON.version}
        </a>
      </div>

      <SidebarTradeDashboardLink />

      <SidebarPendingOrdersLink />

      <SidebarMenuItem
        iconName='withdrawal'
        aProps={{
          onClick: showLatelyHistory,
        }}
      >
        <AppTrans i18nKey='showLatelyTradeHistory'></AppTrans>
        <KeyProbe filter='H' command={showLatelyHistory}></KeyProbe>
      </SidebarMenuItem>

      <SidebarMenuItem
        iconName='settings'
        aProps={{
          onClick: () => {
            dispatch(toggleSetupDialog(!display.setupDialog))
            sendEvent('button_settings_dialog')
          },
        }}
      >
        <AppTrans i18nKey='universal_setup_text'></AppTrans>
        <KeyProbe
          filter='S'
          command={() => {
            dispatch(toggleSetupDialog(!display.setupDialog))
            sendEvent('button_settings_dialog')
          }}
        ></KeyProbe>
      </SidebarMenuItem>

      <SidebarMenuItem
        iconName='funds'
        aProps={{
          target: '_blank',
          href:
            'https://www.notion.so/hilezi/Donate-Me-ab484fc786bf44f8b19a017fdbe4a698',
          onClick: sendEvent.bind(sendEvent, 'link_donate'),
        }}
      >
        <AppTrans i18nKey='link_donation_text'></AppTrans>
      </SidebarMenuItem>

      <SidebarMenuItem
        iconName='people-ref'
        aProps={{
          target: '_blank',
          href: 'https://t.me/mt4_daytrading',
          onClick: () => {
            sendEvent('link_telegram_chatroom')
          },
        }}
      >
        Telegram
      </SidebarMenuItem>

      <SidebarMenuItem
        iconName='news'
        aProps={{
          target: '_blank',
          href: 'https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3',
          onClick: sendEvent.bind(sendEvent, 'link_website'),
        }}
      >
        <AppTrans i18nKey='link_extensionWebsite_text'></AppTrans>
      </SidebarMenuItem>

      <SidebarMenuItem
        iconName='news'
        aProps={{
          target: '_blank',
          href: 'https://www.youtube.com/watch?v=4YKr8F8rkFA',
          onClick: sendEvent.bind(sendEvent, 'plugin_video_show'),
        }}
      >
        <AppTrans i18nKey='pluginVideoShow'></AppTrans>
      </SidebarMenuItem>

      <SetupsDialog></SetupsDialog>

      <SeeCopingHistory />
    </span>
  )
}

export const registeredSidebarMenuItems = registerReactComponent({
  component: <SidebarMenuItemGroup />,
  containerId: 'SidebarMenuItems',
  containerConstructor: container => {
    $('.i-menu-link[href="/feed"]').after(container)
  },
})
