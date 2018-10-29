import React from 'react'
import PropTypes from 'prop-types'
import { DropDown } from '@aragon/ui'

import InlineField from '../../components/Field/InlineField'

class RoleFilter extends React.Component {
  state = {
    activeFilter: 0
  }

  shouldComponentUpdate ({ roles: nextRoles }, { activeFilter: nextActive }) {
    const { roles } = this.props
    const { activeFilter } = this.state

    if (nextActive !== activeFilter) {
      return true
    }

    if (nextRoles.size !== roles.size) {
      return true
    }

    for (const role of nextRoles) {
      if (!roles.has(role)) {
        return true
      }
    }

    return false
  }

  render () {
    const { onChange, roles } = this.props
    const { activeFilter } = this.state

    const filterValues = [
      ['All', null],
      ...Array.from(roles).sort().map(role => [role, e => e.role === role])
    ]

    return (
      <InlineField label='Role Type:'>
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

RoleFilter.propTypes = {
  onChange: PropTypes.func,
  roles: PropTypes.instanceOf(Set).isRequired
}

export default RoleFilter
