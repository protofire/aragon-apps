import React from 'react'

import EmployeeList from './components/EmployeeList'
import Section from '../components/Layout/Section'

const TeamPayroll = () => (
  <Section data-testid='team-payroll-section'>
    <Section.Left>
      <EmployeeList />
    </Section.Left>
    <Section.Right>
      {/* Side content */}
    </Section.Right>
  </Section>
)

export default TeamPayroll