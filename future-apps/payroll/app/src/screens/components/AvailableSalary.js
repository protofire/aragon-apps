import React from 'react'
import styled from 'styled-components'
import BN from 'bn.js'
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
    denominationToken: {
      symbol: '',
      decimals: 0
    },
    data: []
  }

  getEmployee(addr) {
    return (this.props.employees && this.props.employees.find(
      employee => employee.accountAddress === addr
    ))
  }

  sumExchangeRates (payments) {
    const init = new BN(0)
    const reducer = (acc, payment) => acc.add(new BN(payment.exchangeRate.amount))
    const totalTransferred = payments.reduce(reducer, init)
    return totalTransferred.toString()
  }

  componentDidUpdate(prevProps) {
    if (
      (this.props.accountAddress != prevProps.accountAddress) ||
      (this.props.payments && prevProps.payments && this.props.payments.length != prevProps.payments.length)
    ) {
      const { payments, accountAddress, denominationToken } = this.props

      const employee = this.getEmployee(accountAddress)
      const { lastPayroll, salary, accruedValue } = employee

      const totalTransferred = this.sumExchangeRates(payments);
      const data = [{ lastPayroll, salary, totalTransferred , availableBalance: accruedValue }]

      this.setState({ data })
      this.setState({ denominationToken })
    }
  }

  render () {
    const { data, denominationToken } = this.state
    const formatSalary = (amount) => formatCurrency(amount, denominationToken.symbol, 10, denominationToken.decimals, SECONDS_IN_A_YEAR)
    const customFormatCurrency = (amount) => formatCurrency(amount, denominationToken.symbol, 10, denominationToken.decimals)
    return (
      <Container>
        <Header>
          <Section.Title>Available Salary</Section.Title>
        </Header>
        <AvailableSalaryTable data={data} formatSalary={formatSalary} formatCurrency={customFormatCurrency}/>
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
  salaryAllocation = [],
  payments = []
}) {
  return {
    employees,
    accountAddress,
    denominationToken,
    salaryAllocation,
    payments
  }
}

export default connect(mapStateToProps)(AvailableSalary)
