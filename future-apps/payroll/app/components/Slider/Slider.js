import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { theme } from '@aragon/ui'

const RangeInput = styled.input.attrs({ type: 'range' })`
  width: 100%;
  min-height: 36px;
  margin: 0;
  padding: 0;
  -webkit-appearance: none;
  background: none;
  border: none;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 1ms;

  // Remove native focus indicator
  :focus {
    box-shadow: none;
    outline: none;
  }
  
  ::-moz-focus-outer {
    border: 0;
  }
  
  // Thumb
  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 1.5em;
    height: 1.5em;
    background: white;
    border: 1px solid #edf3f6;
    border-radius: 50%;
    box-shadow: rgba(0, 0, 0, 0.13) 3px 3px 8px 0; 
    margin-top: -10px;
  }

  ::-moz-range-thumb {
    position: relative;
    width: 1.5em;
    height: 1.5em;
    background: white;
    border: 1px solid #edf3f6;
    border-radius: 50%;
    box-shadow: rgba(0, 0, 0, 0.13) 3px 3px 8px 0;
  }

  ::-ms-thumb {
    width: 1.5em;
    height: 1.5em;
    background: white;
    border: 1px solid #edf3f6;
    border-radius: 50%;
    margin-top: -0.25em;
  }

  // Track
  ::-webkit-slider-runnable-track {
    width: 100%;
    height: 0.375em;
    background: #edf3f6 linear-gradient(${theme.gradientEndActive}, ${theme.gradientEndActive}) no-repeat;
    background-size: ${props => props.value}%;
    border-radius: 2px;
    pointer-events: none;
  } 
  
  ::-moz-range-track {
    width: 100%;
    height: 0.375em;
    background: #edf3f6;
    border-radius: 2px;
  }
  
  ::-moz-range-progress {
    height: 0.375em;
    background: ${theme.gradientEndActive};
    border-radius: 2px;
    margin-top: 0;
  }
  
  ::-ms-track {
    width: 100%;
    height: 0.375em;
    margin-top: 10px;
    box-sizing: border-box;
    background: #edf3f6;
    border: 0 transparent;
    border-radius: 2px;
  }
  
  ::-ms-fill-lower {
    background: ${theme.gradientEndActive};
    border-radius: 2px;
  }

  ::-ms-tooltip {
    display: none;
  }
`

class Slider extends React.Component {
  constructor (props) {
    super(props)
    this.state = { progress: props.value || 0 }
  }

  componentDidUpdate () {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this.state.progress)
    }
  }

  handleChange = (event) => {
    this.setState({ progress: event.target.value })
  }

  render () {
    return (
      <RangeInput
        min={0}
        max={100}
        value={this.state.progress}
        onChange={this.handleChange}
      />
    )
  }
}

Slider.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
}

export default Slider
