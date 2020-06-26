import ReactDOM from 'react-dom'
import { getRandomString } from '@/utils/getRandomString'

export const stickReactComponent = (options: {
  /**
   * required, the component to ReactDOM.render()
   * @example
   *  component: (
   *    <Provider store={store}>
   *      <ExecutionDialogStatusInfo />
   *    </Provider>
   *  )
   */
  component: JSX.Element
  /** defaults random literals. e.g. `'umjisp19neq'` */
  containerId?: string
  /** defaults `'span'`, the container element tag that for ReactDOM.render(). */
  containerTag?: string
  /**
   * @example
   *  containerConstructor((containerElement) => {
   *    jQuery(containerElement).addClass('colorful').insertAfter('body')
   *  })
   */
  containerConstructor: (containerElement: Element) => void
  disabled?: () => boolean
}) => {
  const containerTag = options.containerTag || 'span'
  const newContainerElement = $(`<${containerTag}>`)

  const checkExists = () =>
    options.containerId ? $(`#${options.containerId}`).length > 0 : false

  const existsContainerElement = options.containerId
    ? $(`#${options.containerId}`)
    : null

  const targetContainerElement =
    existsContainerElement?.get(0) || newContainerElement.get(0)

  const containerId = options.containerId || getRandomString()
  newContainerElement.attr('id', `${containerId}`)

  const checkDisabled = () => options.disabled?.() ?? false

  const mount = () => {
    if (checkExists() === false && checkDisabled() === false) {
      options.containerConstructor(targetContainerElement)
    }

    if (checkDisabled() === false) {
      ReactDOM.render(options.component, targetContainerElement)
    }
  }

  mount.displayName = `mount${containerId}`

  const unmount = () => {
    // setTimeout to avoid errors which the polyfills-es5.js on etoro
    return new Promise((resolve, reject) => {
      globalThis.setTimeout(() => {
        if (targetContainerElement) {
          ReactDOM.unmountComponentAtNode(targetContainerElement)
          targetContainerElement.remove()
        }

        resolve()
      })
    })
  }

  unmount.displayName = `unmount${containerId}`

  return {
    mount,
    unmount,
    containerId,
  }
}
