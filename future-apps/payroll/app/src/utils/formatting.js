import { format as dateFormatter } from 'date-fns'
import { round } from './math-utils'

const DEFAULT_LOCALE = 'en-US'
const DEFAULT_DATE_FORMAT = 'LL/dd/yyyy'

export const SECONDS_IN_A_YEAR = 31557600 // 365.25 days

export function formatDate (date, format = DEFAULT_DATE_FORMAT) {
  return dateFormatter(date, format)
}

export function getSeparator (locale, separatorType) {
  const numberWithGroupAndDecimalSeparator = 1000.1
  return Intl.NumberFormat(locale)
    .formatToParts(numberWithGroupAndDecimalSeparator)
    .find(part => part.type === separatorType)
    .value
}

const formatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
  minimumFractionDigits: 0
})

export function formatNumber (amount, decimals = 10, pow = 18, multiplier = 1, rounding = 2) {
  const number = round(((amount / Math.pow(decimals, pow)) * multiplier), rounding)
  return formatter.format(number)
}

export function formatCurrency (
  amount,
  symbol,
  decimals = 10,
  pow = 18,
  multiplier = 1,
  rounding = 2,
  isIncoming = true,
  displaySign = false
) {
  const formattedNumber = formatNumber(amount, decimals, pow, multiplier)
  const sign = (displaySign ? (isIncoming ? '+' : '-') : '')
  return `${sign}${formattedNumber} ${symbol}`
}
