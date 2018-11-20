import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import Table from '../../components/Table'
import { salaryType } from '../../types'
import { formatCurrency, formatDate, formatTokenAmount } from '../../utils/formatting'

import { Button, theme } from '@aragon/ui'
import Timer from '../../components/Timer'

const Amount = styled.span`
  font-weight: 600;
  color: ${theme.positive}
`

const CellStyle = {
  fontSize: '20px'
}

const partialAmount = amount => {
  return {
    amount,
    isIncoming: true,
    displaySign: true
  }
};

const AvailableSalaryTable = (props) => (
  <Table
    noDataMessage='No available salary found'
    sortable={false}
    {...props}
  />
)

AvailableSalaryTable.propTypes = {
  ...Table.propTypes,
  data: PropTypes.arrayOf(salaryType).isRequired
}

AvailableSalaryTable.defaultProps = {
  columns: [
    {
      name: 'last-payroll',
      title: 'Time since last salary',
      value: data => data.lastPayroll,
      formatter: formatDate,
      render: (formattedDate, date, item) => {
        const startDate = new Date(date)
        return (<Timer start={startDate} />)
      }
    },
    {
      name: 'available-balance',
      title: 'Available Balance',
      value: data => partialAmount(data.availableBalance),
      formatter: formatTokenAmount,
      render: (formattedAmount, amount, item) => (
        <Amount positive={item.isInconming}>
          {formattedAmount}
        </Amount>
      ),
      cellProps: {
        style: CellStyle
      }
    },
    {
      name: 'total-transferred',
      title: 'Total Transferred',
      value: data => data.totalTransferred,
      formatter: formatCurrency,
      cellProps: {
        style: CellStyle
      }
    },
    {
      name: 'your-yearly-salary',
      title: 'Your yearly salary',
      value: data => data.salary,
      formatter: formatCurrency,
      cellProps: {
        style: CellStyle
      }
    }
  ]
}

export default AvailableSalaryTable
