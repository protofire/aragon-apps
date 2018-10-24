import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Table, TableCell, TableHeader, TableRow, Text, theme } from '@aragon/ui'

import { DEFAULT_COLUMNS, SORT_DIRECTION } from './columns'
import Panel from '../../../components/Panel/Panel'

const Header = styled(TableHeader)`
  position: relative;
  padding-right: 21px;

  ${({ sortable, sortDirection }) => sortable && css`
    cursor: pointer;
    user-select: none;

    :before {
      position: absolute;
      content: '';
      right: 7px;
      top: calc(50% - 3px);
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 4px solid ${theme.textSecondary};
      opacity: ${sortDirection === SORT_DIRECTION.ASC ? 1 : 0.2}
    }

    :after {
      position: absolute;
      content: '';
      right: 7px;
      top: calc(50% + 3px);
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid ${theme.textSecondary};
      opacity: ${sortDirection === SORT_DIRECTION.DESC ? 1 : 0.2}
    }
  `}
`

const Cell = styled(TableCell)``

const Row = styled(TableRow)``

class EmployeeTable extends React.Component {
  state = {
    sortByColumn: '',
    sortDirection: SORT_DIRECTION.NONE
  }

  sortBy = (column) => {
    if (this.state.sortByColumn === column) {
      this.toggleSortDirection()
    } else {
      this.setState({
        sortByColumn: column,
        sortDirection: SORT_DIRECTION.DESC
      })
    }
  }

  toggleSortDirection = () => {
    switch (this.state.sortDirection) {
      case SORT_DIRECTION.ASC:
        this.setState({ sortDirection: SORT_DIRECTION.NONE })
        break

      case SORT_DIRECTION.DESC:
        this.setState({ sortDirection: SORT_DIRECTION.ASC })
        break

      case SORT_DIRECTION.NONE:
        this.setState({ sortDirection: SORT_DIRECTION.DESC })
        break
    }
  }

  render () {
    const { columns, data: employees, sortable } = this.props
    const { sortByColumn, sortDirection } = this.state

    if (!employees.length) {
      return (
        <Panel>
          <p>No employees found</p>
        </Panel>
      )
    }

    const header = (
      <Row>
        {columns.map(column => {
          const isSortable = column.sortable || sortable
          const isSortColumn = sortByColumn === column.name

          return (
            <Header
              key={`header-${column.name}`}
              title={column.title}
              sortable={isSortable}
              sortDirection={isSortColumn ? sortDirection : SORT_DIRECTION.NONE}
              width={100 / column.length + '%'}
              onClick={(() => isSortable && this.sortBy(column.name))}
            />
          )
        })}
      </Row>
    )

    const body = employees.map(employee => (
      <Row key={`row-${employee.id}`}>
        {columns.map(cell => {
          const rawValue = cell.value(employee)
          const formattedValue = rawValue != null
            ? (cell.formatter
                ? cell.formatter(rawValue)
                : rawValue.toString()
            )
            : cell.defaultValue

          return (
            <Cell
              key={`row-${employee.id}-${cell.name}`}
              {...cell.cellProps}
              children={cell.render
                ? cell.render(formattedValue, rawValue)
                : (<Text>{formattedValue}</Text>)
              }
            />
          )
        })}
      </Row>
    ))

    return (
      <Table header={header} children={body} />
    )
  }
}

EmployeeTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.func.isRequired,
      defaultValue: PropTypes.any,
      format: PropTypes.func,
      render: PropTypes.func,
      sortable: PropTypes.bool
    })
  ),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      startDate: PropTypes.number,
      endDate: PropTypes.number,
      role: PropTypes.string,
      salary: PropTypes.number,
      accruedValue: PropTypes.number
    })
  ).isRequired,
  sortable: PropTypes.bool
}

EmployeeTable.defaultProps = {
  columns: DEFAULT_COLUMNS,
  sortable: true
}

export default EmployeeTable
