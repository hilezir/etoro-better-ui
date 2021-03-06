/** @jsx jsx */ import { jsx, css } from '@emotion/react'
import { angularAPI } from '~/angularAPI'
import { isDisabledInProchart } from '~/components/ExecutionDialog/isDisabledInProchart'
import { ProfitText } from '~/components/ProfitText'
import { emitter, Events } from '~/emitter'
import { GM } from '~/GM'
import { useRate } from '~/hooks/useRate'
import { useAppSelector } from '~/store/_store'
import { registerReactComponent } from '~/utils/registerReactComponent'
import React, { Fragment, useMemo } from 'react'
import { useInterval } from 'react-use'
import big from 'big.js'
import { ChangePoints } from '~/components/ChangePoints'
import { getChangePoints } from '~/utils/getChangePoints'
import { AppTrans } from '~/components/AppTrans'

enum Blocks {
  root = 'root',
  price = 'price',
  priceAsk = 'priceAsk',
  priceBid = 'priceBid',
  priceMovement = 'priceMovement',
  spread = 'spread',
}

const ExecutionDialogPrices: React.FC = () => {
  const rate = useRate()

  const position = rate.model?.position

  const openRate = position?.OpenRate || rate.model?.orderModeCurrentRate || 0

  const amountShouldBe = useAppSelector(
    state => state.settings.executionAmountLast,
  )
  const amountCare = useAppSelector(
    state => state.settings.executionAmountLast !== rate.model?.amount.amount,
  )

  const degree = useAppSelector(
    state => state.settings.tradeDialogPriceRenderRate,
  )

  /** Price of close the position of sell put */
  const askValue = useMemo(() => {
    if (rate.model?.isLowLeverage) {
      return rate.value?.AskDiscounted ?? 0
    }

    return rate.value?.lastAskPrice ?? 0
  }, [rate])

  /** Price of close the position of buy call */
  const bidValue = rate.value?.lastPrice || 0

  const precision = rate.model?.instrument?.Precision ?? 0

  useInterval(() => {
    rate.updateValue()
  }, degree)

  if (!rate.value || !degree) {
    return null
  }

  const spread = big(askValue).minus(bidValue)

  const farOfTP = big(rate.model?.takeProfit.amount || 0)
    .minus(bidValue)
    .abs()
    .plus(spread)

  const farOfSL = big(rate.model?.stopLoss.amount || 0)
    .minus(bidValue)
    .abs()

  const winOfTP = big(rate.model?.takeProfit.amount || 0)
    .minus(openRate)
    .abs()

  const loseOfSL = big(rate.model?.stopLoss.amount || 0)
    .minus(openRate)
    .abs()

  const winPerPoint = big(rate.model?.takeProfit.dollar || 0).div(
    getChangePoints(farOfTP.toNumber(), precision),
  )

  const losePerPoint = big(rate.model?.stopLoss.dollar || 0).div(
    getChangePoints(farOfSL.toNumber(), precision),
  )

  return (
    <span css={rootCSS}>
      {!position && (
        <span
          css={css`
            ${priceCSS};

            top: 100%;
            display: block;
            text-align: center;
            width: 100%;
            outline: 3px solid ${amountCare ? 'red' : 'green'};
          `}
        >
          {amountCare ? (
            <AppTrans
              i18nKey={'amountWarning'}
              values={{
                value: rate.model?.amount.amount.toNumberFixed(2),
              }}
            ></AppTrans>
          ) : (
            <span>${rate.model?.amount.amount.toNumberFixed(2)}</span>
          )}
        </span>
      )}

      <span css={bidCSS}>
        <ProfitText
          profit={rate.value.lastPrice}
          pureDollar
          noDollarSign
          precision={precision}
        />
        {/* <span className={withBlock(Blocks.priceMovement)}>
          {<ProfitText profit={rate.value.lastBidChange} noDollarSign />}
        </span> */}
      </span>

      <span css={spreadCSS}>
        <ChangePoints value={spread.toNumber()} precision={precision} />
      </span>

      <span css={askCSS}>
        <ProfitText
          profit={askValue}
          pureDollar
          noDollarSign
          precision={precision}
        />
        {/* <span className={withBlock(Blocks.priceMovement)}>
          <ProfitText profit={rate.value.lastAskChange} noDollarSign />
        </span> */}
      </span>

      <span
        css={css`
          position: absolute;
          left: 0;
          top: 55%;
          width: 180px;
          display: inline-block;
          text-align: left;
        `}
      >
        <div>
          <ChangePoints value={farOfSL.toNumber()} precision={precision} />
          <span> far</span>
        </div>

        <div>
          {' {to lose '}
          <span
            css={css`
              color: #e1191d;
            `}
          >
            <ChangePoints value={loseOfSL.toNumber()} precision={precision} />
          </span>
          {'}'}
        </div>

        <div>
          {' {per '}
          <ProfitText
            profit={losePerPoint.toNumber()}
            precision={precision + 2}
          />
          {'}'}
        </div>
      </span>

      <span
        css={css`
          position: absolute;
          right: 0;
          top: 55%;
          width: 180px;
          display: inline-block;
          text-align: right;
        `}
      >
        <div>
          <ChangePoints value={farOfTP.toNumber()} precision={precision} />
          <span> far</span>
        </div>

        <div>
          {' {to win '}
          <span
            css={css`
              color: #6eaf0f;
            `}
          >
            <ChangePoints value={winOfTP.toNumber()} precision={precision} />
          </span>
          {'}'}
        </div>

        <div>
          {' {per '}
          <ProfitText
            profit={winPerPoint.toNumber()}
            precision={precision + 2}
          />
          {'}'}
        </div>
      </span>
    </span>
  )
}

export const exectionDialogPrices = registerReactComponent({
  component: <ExecutionDialogPrices />,
  containerId: 'ExecutionDialogPrices',
  containerConstructor: renderContainer => {
    $(angularAPI.selectors.dialogInnerContent)
      .find('.execution.edit, #open-position-view')
      .append(renderContainer)
  },
  disabled: () => {
    if (isDisabledInProchart()) return true
    return false
  },
})

emitter.on(Events.onDialogHover, exectionDialogPrices.mount)
emitter.on(Events.onDialogNotFound, exectionDialogPrices.unmount)

const rootCSS = css`
  @media (min-width: 741px) {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }
`

const priceCSS = css`
  position: absolute;
  text-shadow: 1px 1px 1px #000000;
  font-size: 22px;
`

const bidCSS = css`
  ${priceCSS};
  left: 231px;
  top: 13%;
`

const askCSS = css`
  ${priceCSS};
  left: 362px;
  top: 13%;
`

const spreadCSS = css`
  ${priceCSS};
  z-index: 1000;
  top: 74px;
  display: block;
  width: 100%;
  left: auto;
  text-align: center;
  color: #fff;
  text-shadow: 1px 1px 0px black, -1px -1px 0px black;
`
