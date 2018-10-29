import React from 'react'
import PropTypes from 'prop-types'
import { DropDown } from '@aragon/ui'

import InlineField from '../../components/Field/InlineField'

class StatusFilter extends React.Component {
  state = {
    activeFilter: 0,
    filterValues: [
      ['All', null],
      ['Active', e => !e.terminated],
      ['Inactive', e => e.terminated],
    ]
  }

  shouldComponentUpdate (nextProps, { activeFilter: nextActive }) {
    return nextActive !== this.state.activeFilter
  }

  render () {
    const { onChange } = this.props
    const { activeFilter } = this.state

    const filterValues = [
      ['All', null],
      ['Active', e => !e.terminated],
      ['Inactive', e => e.terminated],
    ]

    return (
      <InlineField label='Status:'>
        <DropDown
          items={filterValues.map(([label]) => label)}
          active={activeFilter}
          onChange={index => {
            this.setState({ activeFilter: index }, () => {
              if (typeof onChange === 'function') {
                onChange(filterValues[index][1])
              }
            })
          }}
        />
      </InlineField>
    )
  }
}

StatusFilter.propTypes = {
  onChange: PropTypes.func
}

export default StatusFilter
