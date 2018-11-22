import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import Table from '../../components/Table'
import { salaryType } from '../../types'
import { formatDate, formatTokenAmount } from '../../utils/formatting'

import { Button, theme } from '@aragon/ui'
import Timer from '../../components/Timer'

const initializeColumns = (data, formatCurrency, formatSalary) => {
  return [
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
      formatter: formatSalary,
      cellProps: {
        style: CellStyle
      }
    }
  ]
}

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

const AvailableSalaryTable = (props) => {
  const columns = initializeColumns(props.data, props.formatCurrency, props.formatSalary)
  return (
    <Table
      noDataMessage='No available salary found'
      columns={columns}
      sortable={false}
      {...props}
    />
  )
}

AvailableSalaryTable.propTypes = {
  ...Table.propTypes,
  data: PropTypes.arrayOf(salaryType).isRequired
}

export default AvailableSalaryTable
