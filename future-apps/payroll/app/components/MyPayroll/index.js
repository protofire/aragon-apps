import React from 'react'

import TwoColumn from '../Layout/TwoColumn'
import SalaryAllocation from './SalaryAllocation'

const MyPayroll = () => (
  <TwoColumn>
    <TwoColumn.Left>
      My Payroll
    </TwoColumn.Left>
    <TwoColumn.Right>
      <SalaryAllocation />
    </TwoColumn.Right>
  </TwoColumn>
)

export default MyPayroll
