import styled from 'styled-components'

import BaseInput from './BaseInput'

const DateInput = styled(BaseInput).attrs({
  // TODO: Aragon UI 'till doesn't support type="date"
  // type: 'date'
})``

DateInput.defaultProps = {
  format: 'MM/DD/YYYY'
}

export default DateInput
