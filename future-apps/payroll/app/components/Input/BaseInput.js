import React from 'react'
import PropTypes from 'prop-types'
import { TextInput } from '@aragon/ui'

const BaseInput = ({ value, formatter, mapper, name, onChange, ...props }) => (
  <TextInput
    value={formatter(value)}
    onChange={event => {
      if (typeof onChange === 'function') {
        const value = mapper(event.target.value)

        onChange(value, name)
      }
    }}
    {...props}
  />
)

BaseInput.propTypes = {
  ...TextInput.propTypes,
  formatter: PropTypes.func,
  mapper: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.any
}

BaseInput.defaultProps = {
  formatter: value => value != null ? value : '',
  mapper: value => value
}

export default BaseInput
