import store from '~/store/_store'
import { setBetterEtoroUIConfig } from '~/actions/setBetterEtoroUIConfig'
import { angularAPI } from '~/angularAPI'
import { currencyTextToNumber } from '~/utils/currencyTextToNumber'

export const dialogSaveAmountToStorage = (amount?: number) => {
  const state = store.getState()

  if (amount === state.settings.executionAmountLast) {
    return
  }

  if (typeof amount === 'number') {
    store.dispatch(
      setBetterEtoroUIConfig({
        executionAmountLast: amount,
      }),
    )
  }
}

export const dialogSaveLeverToStorage = (lever?: number) => {
  const state = store.getState()

  if (lever === state.settings.executionLeverLast) {
    return
  }

  if (Number.isInteger(lever)) {
    store.dispatch(
      setBetterEtoroUIConfig({
        executionLeverLast: lever,
      }),
    )
  }
}

export const nativeEtoroAmountSaveToStorage = () => {
  let intervalId: ReturnType<typeof globalThis['setTimeout']>

  $('body').on('click', angularAPI.selectors.dialogAmountSteppers, () => {
    globalThis.clearTimeout(intervalId)

    intervalId = globalThis.setTimeout(() => {
      const input = $(angularAPI.selectors.dialogAmountInput)
      const amount = currencyTextToNumber(input.val() as string)

      dialogSaveAmountToStorage(amount)
    }, 0)
  })
}

export const nativeEtoroLeverSaveToStorage = () => {
  $('body').on('click', '.risk-itemlevel', (index, element) => {
    const leverText = (index.target as HTMLAnchorElement).innerText
      .trim()
      .replace(/x/i, '')

    dialogSaveLeverToStorage(Number(leverText))
  })
}
