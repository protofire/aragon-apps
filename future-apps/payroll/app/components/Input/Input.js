import React from 'react'
import styled from 'styled-components'

import { TextInput } from '@aragon/ui'

const Input = styled(TextInput).attrs({
  wide: true
})``

// Text
Input.Text = styled(Input).attrs({
  type: 'text'
})``

// Numeric
Input.Number = styled(Input).attrs({
  type: 'number'
})``

Input.Currency = styled(Input.Number).attrs({
  min: 0
})``

// Date
Input.Date = styled(Input).attrs({
  // TODO: Aragon UI 'till doesn't support type="date"
  // type: 'date'
})``

Input.Date.defaultProps = {
  format: 'MM/DD/YYYY'
}

export default Input
