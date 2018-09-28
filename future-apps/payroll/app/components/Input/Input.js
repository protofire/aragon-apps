import React from 'react'
import styled from 'styled-components'
import { format as formatDate, startOfDay } from 'date-fns'

import BaseInput from './BaseInput'

const Input = styled(BaseInput).attrs({ wide: true })``

// Text
Input.Text = Input

// Numeric
Input.Number = styled(Input).attrs({
  type: 'number',
  mapper: () => Number
})``

// Date
Input.Date = styled(Input).attrs({
  formatter: props => value => value != null
    ? formatDate(value, props.format)
    : '',
  mapper: () => startOfDay,
})``

Input.Date.defaultProps = {
  format: 'MM/DD/YYYY'
}

export default Input
