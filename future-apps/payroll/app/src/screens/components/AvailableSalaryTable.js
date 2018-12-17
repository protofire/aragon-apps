import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import Table from '../../components/Table'
import { salaryType } from '../../types'
import { formatDate, SECONDS_IN_A_YEAR } from '~/utils/formatting'
import { Amount } from '~/components/Amount'

import { Button, theme } from '@aragon/ui'
import Timer from '../../components/Timer'

const initializeColumns = (data, denominationToken) => {
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
      value: data => data.availableBalance,
      render: (formattedValue, rawValue, item) => (
        <Amount
          amount={rawValue}
          symbol={denominationToken.symbol}
          decimals={10}
          pow={denominationToken.decimals}
          isIncoming={true}
          displaySign={true}
          color={theme.positive}
          weight='bold'
        />
      ),
      cellProps: {
        style: CellStyle
      }
    },
    {
      name: 'total-transferred',
      title: 'Total Transferred',
      value: data => data.totalTransferred,
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
    },
    {
      name: 'your-yearly-salary',
      title: 'Your yearly salary',
      value: data => data.salary,
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
    }
  ]
}

const CellStyle = {
  fontSize: '23px'
}

const AvailableSalaryTable = (props) => {
  const columns = initializeColumns(props.data, props.denominationToken)
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
