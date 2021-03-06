import { debugAPI } from '~/debugAPI'
import store from '~/store/_store'
import { angularAPI } from '~/angularAPI'

/** Naming rule e.g. {category}_{event} */
export enum GaEventId {
  fn_SLModeClick,
  fn_TPModeClick,
  tradeDashboard_closePositionClick,
  tradeDashboard_instrumentLinkClick,
  universal_bootstrapWithVersion,
  sidebar_extensionMenuItemClick,
  sidebar_pendingOrdersLinkClick,
  sidebar_dashboardLinkClick,
  sidebar_mt5PromotionLinkClick,
  watchlists_checkUserBalance,
  watchlists_portfolioLinkClick,
  watchlists_filterByText,
  watchlists_filterByTextClearClick,
  watchlists_filterByTextEnterKeyClick,
  watchlists_filterByTextEscapeKeyClick,
  dialog_amountButtonsClick,
  dialog_buttonsArrangeClick,
  dialog_leverButtonsClick,
  keyboard_hotkeyPress,
  keyboard_openTradeClick,
  keyboard_closeDialog,
  keyboard_filterTextFocus,
  keyboard_switchBuySell,
  keyboard_partialCheckboxClick,
  keyboard_queryHistory,
  setting_intervalCheckingStatus,
  setting_amountButtonsSet,
  setting_compactEnabledSet,
  setting_currencyUseSet,
  setting_dialogEnabledOnProchartSet,
  setting_dialogMacroEnabledSet,
  setting_investedEnabledSet,
  setting_resetAllClick,
  setting_sameOrderEnabledSet,
  setting_tabToBuySellEnabledSet,
  setting_takeProfitAndStopLoseEnabledSet,
  setting_inviteExcitingDegree,
  alert_componentCrash,
}

const GA_TRACKER_NAME = 'etoroBetterUi'
const GA_UA_ID = 'UA-60395189-2'

export const gaAPI = {
  initialize() {
    debugAPI.ga('initializing...')

    ga('create', GA_UA_ID, 'auto', GA_TRACKER_NAME)
  },
  sendEvent(targetEventId: GaEventId, label?: string, value?: number) {
    const enabled = store.getState().settings.googleAnalyticsEnabled
    const isDemo =
      angularAPI.$rootScope?.session.accountMode.toLowerCase() ===
      'Demo'.toLowerCase()

    const eventInfo = GaEventId[targetEventId].split('_')

    const category = eventInfo[0]
    const action = eventInfo[1]

    debugAPI.ga.extend(category)(
      `action=${action}, label=${label || '__NONE__'}` +
        `${enabled && !isDemo ? '' : ', function disabled/demo, not send'}`,
    )

    if (!enabled || isDemo) {
      return
    }

    ga(`${GA_TRACKER_NAME}.send`, 'event', category, action, label, value)
  },
}
