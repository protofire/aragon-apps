import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Table from '~/components/Table'
import { employeeType } from '~/types'
import { formatDate, SECONDS_IN_A_YEAR } from '~/utils/formatting'
import { Amount } from '~/components/Amount'

import { theme } from '@aragon/ui'

const initializeColumns = (data, denominationToken) => {
  return [
    {
      name: 'employees-qty',
      title: 'Employees',
      value: data => data.employeesQty,
      cellProps: {
        style: CellStyle
      }
    },
    {
      name: 'averageSalary',
      title: 'Average Salary',
      value: data => data.averageSalary,
      render: (formattedValue, rawValue, item) => (
        <Amount
          amount={rawValue}
          symbol={denominationToken.symbol}
          decimals={10}
          pow={denominationToken.decimals}
          multiplier={SECONDS_IN_A_YEAR}
        />
      ),
      cellProps: {
        style: CellStyle
      }
    },
    {
      name: 'monthly-burn-date',
      title: 'Monthly burn rate',
      value: data => data.monthlyBurnRate,
      render: (formattedValue, rawValue, item) => (
        <Amount
          amount={rawValue}
          symbol={denominationToken.symbol}
          decimals={10}
          pow={0}
          color={theme.negative}
          weight='bold'
        />
      ),
      cellProps: {
        style: { ...CellStyle }
      }
    },
    {
      name: 'total-paid-this-year',
      title: 'Total paid this year',
      value: data => data.totalPaidThisYear,
      render: (formattedValue, rawValue, item) => (
        <Amount
          amount={rawValue}
          symbol={denominationToken.symbol}
          decimals={10}
          pow={0}
        />
      ),
      cellProps: {
        style: CellStyle
      }
    }
  ]
}

const CellStyle = {
  fontSize: '20px'
}

const TotalPayrollTable = (props) => {
  const columns = initializeColumns(props.data, props.denominationToken)
  return (
    <Table
      noDataMessage='Total payroll not available'
      columns={columns}
      sortable={false}
      {...props}
    />
  )
}

TotalPayrollTable.propTypes = {
  ...Table.propTypes,
  data: PropTypes.arrayOf(employeeType).isRequired
}

export default TotalPayrollTable
