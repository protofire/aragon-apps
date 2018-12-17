import React from 'react'
import styled from 'styled-components'
import { formatNumber, getSeparator, DEFAULT_LOCALE } from '~/utils/formatting.js'
import { Text, theme } from '@aragon/ui'

export const Amount = ({
  amount = 0,
  decimals = 10,
  pow = 18,
  multiplier = 1,
  rounding = 2,
  displaySign = false,
  isIncoming = false,
  symbol,
  smallerDecimals = true,
  decimalFontSize = 'large',
  color = theme.textPrimary,
  weight = 'normal'
}) => {
  let formattedAmount
  const formattedNumber = formatNumber(amount, decimals, pow, multiplier, rounding)
  const sign = (displaySign ? (isIncoming ? '+' : '-') : '')
  const currentSymbol = (symbol) ? ` ${symbol}` : ''

  if (smallerDecimals) {
    const decSep = getSeparator(DEFAULT_LOCALE, 'decimal')
    const [whole = '', dec = ''] = formattedNumber.split(decSep)
    const decimals = (dec) ? `${decSep}${dec}` : ''
    formattedAmount = (
      <Text color={color} weight={weight} >
        {sign}{whole}<Text size={decimalFontSize}>{decimals}</Text>{currentSymbol}
      </Text>
    )
  } else {
    formattedAmount = (
      <Text color={color} weight={weight}>
        {sign}{formattedNumber}{currentSymbol}
      </Text>
    )
  }

  return formattedAmount

}


