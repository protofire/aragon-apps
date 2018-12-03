import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import Table from '../../components/Table'

import { salaryType } from '../../types'
import { formatDate } from '../../utils/formatting'
import { TransactionBadge } from '../../components/Badge'
import { theme } from '@aragon/ui'

const initializeColumns = (data, formatExchangeRate, formatTokenAmount) => {
  return [
    {
      name: 'date',
      title: 'Date',
      value: data => data.date,
      formatter: formatDate
    },
    {
      name: 'status',
      title: 'Status',
      value: data => data.status,
    },
    {
      name: 'transaction-address',
      title: 'Transaction Address',
      value: data => data.transactionAddress,
      defaultValue: 'Active',
      render: (formattedValue, rawValue, item) => (
        <TransactionBadge
          tx={rawValue}
          networkType="rinkeby"
        >
          {rawValue}
        </TransactionBadge>
      )
    },
    {
      name: 'amount',
      title: 'Amount',
      value: data => data.amount,
      cellProps: {
        align: 'right'
      },
      formatter: formatTokenAmount,
      render: (formattedAmount, rawAmount, item) => (
        <Amount positive={item.amount.isIncoming}>
          {formattedAmount}
        </Amount>
      )
    },
    {
      name: 'exchange-rate',
      title: 'Exchange Rate',
      value: data => data.exchangeRate,
      formatter: formatExchangeRate,
      cellProps: {
        align: 'right'
      }
    }
  ]
}

const Amount = styled.span`
  font-weight: 600;
  color: ${({ positive }) => (positive ? theme.positive : theme.negative)};
`

const SalaryTable = (props) => {
  const columns = initializeColumns(props.data, props.formatExchangeRate, props.formatTokenAmount)
  return (
    <Table
      paginated
      noDataMessage='No salaries found'
      columns={columns}
      {...props}
    />
  )
}


SalaryTable.propTypes = {
  ...Table.propTypes,
  data: PropTypes.arrayOf(salaryType).isRequired
}

export default SalaryTable
