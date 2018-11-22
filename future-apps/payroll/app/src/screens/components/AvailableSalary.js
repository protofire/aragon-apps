import React from 'react'
import styled from 'styled-components'
import AvailableSalaryTable from './AvailableSalaryTable'
import { formatCurrency, SECONDS_IN_A_YEAR } from '../../utils/formatting'

import { connect } from '../../context/AragonContext'
import Section from '../../components/Layout/Section'

class AvailableSalary extends React.PureComponent {
  static defaultProps = {
    lastPayroll: Date.now(),
    availableBalance: 0,
    totalTransferred: 0,
    salary: 0
  }

  state = {
    data: []
  }

  getEmployee(addr) {
    return (this.props.employees && this.props.employees.find(
      employee => employee.accountAddress === addr
    ))
  }

  componentDidUpdate(prevProps) {
    if (this.props.accountAddress && this.props.employees != prevProps.employees) {
      const employee = this.getEmployee(this.props.accountAddress)
      const { totalTransferred, availableBalance } = this.props
      const { lastPayroll, salary, accruedValue } = employee
      const currentState = { data: [{ lastPayroll, salary, totalTransferred, availableBalance: accruedValue }] }
      this.setState(currentState);
    }
  }

  render () {
    const { denominationToken } = this.props
    const formatSalary = (amount) => formatCurrency(amount, denominationToken.symbol, 10, denominationToken.decimals, SECONDS_IN_A_YEAR)
    const customFormatCurrency = (amount) => formatCurrency(amount, denominationToken.symbol, 10, denominationToken.decimals)

    return (
      <Container>
        <Header>
          <Section.Title>Available Salary</Section.Title>
        </Header>
        <AvailableSalaryTable data={this.state.data} formatSalary={formatSalary} formatCurrency={customFormatCurrency}/>
      </Container>
    )
  }
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 2em;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

const Title = styled.h1`
  margin-top: 10px;
  margin-bottom: 20px;
  font-weight: 600;
`

function mapStateToProps ({
  employees = [],
  accountAddress = [],
  denominationToken = [],
  salaryAllocation = []
}) {
  return {
    employees,
    accountAddress,
    denominationToken,
    salaryAllocation
  }
}

export default connect(mapStateToProps)(AvailableSalary)
