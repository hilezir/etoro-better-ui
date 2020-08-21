import { Icon } from '@fluentui/react'
import Tooltip from 'rc-tooltip'
import { TooltipProps } from 'rc-tooltip/lib/Tooltip'
import React from 'react'

export const PrimaryTooltip: React.FC<React.PropsWithChildren<{
  tooltipProps?: TooltipProps
  overlay: TooltipProps['overlay']
}>> = props => {
  return (
    <Tooltip
      placement='top'
      overlayInnerStyle={{ maxWidth: 300 }}
      {...props.tooltipProps}
      overlay={props.overlay}
    >
      <span>{props.children}</span>
    </Tooltip>
  )
}