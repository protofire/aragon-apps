import { formatCurrency, formatDate } from '../../../utils/formatting'

export const DEFAULT_COLUMNS = [
  {
    name: 'name',
    title: 'Name',
    value: data => data.name
  },
  {
    name: 'start-date',
    title: 'Start Date',
    value: data => data.startDate,
    formatter: formatDate
  },
  {
    name: 'end-date',
    title: 'End Date',
    value: data => data.endDate,
    formatter: formatDate,
    defaultValue: 'Active'
  },
  {
    name: 'role',
    title: 'Role',
    value: data => data.role
  },
  {
    name: 'salary',
    title: 'Salary',
    value: data => data.salary,
    formatter: formatCurrency,
    cellProps: {
      align: 'right'
    }
  },
  {
    name: 'annual-total-payment',
    title: 'Total Paid This Year',
    value: data => data.accruedValue,
    formatter: formatCurrency,
    cellProps: {
      align: 'right'
    }
  }
]

export const SORT_DIRECTION = {
  DESC: -1,
  NONE: 0,
  ASC: 1
}
