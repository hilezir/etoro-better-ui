import React from 'react'
import { angularAPI } from '~/angularAPI'
import { KeyProbe, KeyProbeBindingTarget } from '~/components/KeyProbe'
import { useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'
import { styled } from '@material-ui/core/styles'

const Box = styled(KeyProbe)({
  display: 'inline-block',
  position: 'absolute',
  transform: 'translate(0%, 0%)',
})

export const Key12345Probe: React.FC<{
  numbericKey: number
}> = props => {
  const enabled = useAppSelector(state => state.settings.useHotkeys.key12345)

  if (!enabled) {
    return null
  }

  return (
    <Box
      filter={String(props.numbericKey)}
      command={props => {
        if (!enabled) {
          return
        }

        // avoid open dialog twice
        if (angularAPI.executionDialogScope?.model) return

        if (props.keyTarget) {
          props.keyTarget.trigger('click')
        }
      }}
    ></Box>
  )
}

for (const numbericKey of [1, 2, 3, 4, 5]) {
  registerReactComponent({
    component: <Key12345Probe numbericKey={numbericKey} />,
    containerId: `${Key12345Probe.name}-keyHanding-${numbericKey}`,
    containerConstructor: reactContainer => {
      $(`
      et-market-header [automation-id="trade-button"]
      ,[automation-id="buy-sell-button-container-buy"]
    `)
        .eq(numbericKey - 1)
        .attr(KeyProbeBindingTarget, '')
        .append(reactContainer)
    },
    disabled: () => {
      const href = globalThis.location.href
      const onMarketPage = href.includes('markets')
      const onWatchlistPage = href.includes('watchlists')
      const onInstrumentPortfolio = href.includes('portfolio/')

      return !onMarketPage && !onWatchlistPage && !onInstrumentPortfolio
    },
  })
}
