import React from 'react'
import styled from 'styled-components'
import BN from 'bn.js'
import AvailableSalaryTable from './AvailableSalaryTable'
import { formatCurrency, SECONDS_IN_A_YEAR } from '../../utils/formatting'
import { differenceInSeconds } from 'date-fns'

import { connect } from '../../context/AragonContext'
import Section from '../../components/Layout/Section'

const AVAILABLE_BALANCE_TICK = 10000

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

  getAvailableBalance (employee, denominationToken) {
    const accruedTime = differenceInSeconds(
      new Date(),
      new Date(employee.lastPayroll)
    )
    const accruedSalary = (accruedTime * employee.salary) + employee.accruedValue
    return accruedSalary
  }

  componentDidUpdate(prevProps) {
    if (this.props.accountAddress != prevProps.accountAddress) {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        const { payments, accountAddress, denominationToken } = this.props

        const employee = this.getEmployee(accountAddress)
        const availableBalance = this.getAvailableBalance(employee, denominationToken)

        const { lastPayroll, salary, totalTransferred } = this.state.data[0]
        const data = [{ lastPayroll, salary, totalTransferred, availableBalance }]

        this.setState({ data })
      }, AVAILABLE_BALANCE_TICK);
    }

    if (
      (this.props.accountAddress != prevProps.accountAddress) ||
      (this.props.payments && prevProps.payments && this.props.payments.length != prevProps.payments.length)
    ) {
      const { payments, accountAddress, denominationToken } = this.props

      const employee = this.getEmployee(accountAddress)
      const availableBalance = this.getAvailableBalance(employee, denominationToken)
      const totalTransferred = this.sumExchangeRates(payments);

      const { lastPayroll, salary } = employee
      const data = [{ lastPayroll, salary, totalTransferred , availableBalance }]

      this.setState({ data })
      this.setState({ denominationToken })
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render () {
    const { data, denominationToken } = this.state
    const formatSalary = (amount) => formatCurrency(amount, denominationToken.symbol, 10, denominationToken.decimals, SECONDS_IN_A_YEAR)
    const customFormatCurrency = (amount) => formatCurrency(amount, denominationToken.symbol, 10, denominationToken.decimals)
    const formatTokenAmount = (amount) => formatCurrency(amount, denominationToken.symbol, 10, denominationToken.decimals, 1, 2, true, true)
    return (
      <Container>
        <Header>
          <Section.Title>Available Salary</Section.Title>
        </Header>
        <AvailableSalaryTable
          data={data}
          formatSalary={formatSalary}
          formatCurrency={customFormatCurrency}
          formatTokenAmount={formatTokenAmount} />
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
