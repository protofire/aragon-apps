import React from 'react'
import styled from 'styled-components'
import { formatNumber } from '~/utils/formatting.js'
import { Text, theme } from '@aragon/ui'

export const Amount = ({
  amount,
  decimals = 10,
  pow = 18,
  multiplier = 1,
  rounding = 2,
  color = theme.textPrimary,
  weight = 'normal',
  displaySign = false,
  isIncoming = false,
  symbol,
  smallerDecimals = false
}) => {
  const formattedNumber = formatNumber(amount, decimals, pow, multiplier, rounding)
  const sign = (displaySign ? (isIncoming ? '+' : '-') : '')
  const currentSymbol = (symbol) ? ` ${symbol}` : ''
  const formattedAmount = `${sign}${formattedNumber}${currentSymbol}`
  return ( amount &&
    <Text color={color} weight={weight} >{formattedAmount}</Text>
  )
}
