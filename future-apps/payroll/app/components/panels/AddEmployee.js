import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, Field, SidePanel, Text } from '@aragon/ui'
import { format as formatDate } from 'date-fns'

import Input from '../Input/Input'
import EntitySelect from '../Input/EntitySelect'
import validator from '../../data/validation'

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;

  > :first-child, > :nth-last-child(-n+2) {
    grid-column: span 2;
  }

  > :last-child {
    margin-top: 20px;
  }
`

const Static = styled(Text).attrs({
  weight: 'bold'
})`
  line-height: 33px;
  white-space: pre;
`

class AddEmployee extends React.PureComponent {
  state = AddEmployee.initialState

  static initialState = {
    entity: null,
    salary: null,
    startDate: new Date()
  }

  static validate = validator.compile({
    type: 'object',
    properties: {
      salary: {
        type: 'number',
        exclusiveMinimum: 0
      },
      startDate: {
        format: 'date',
        default: new Date()
      },
      entity: {
        properties: {
          name: {
            type: 'string'
          },
          role: {
            type: 'string'
          },
          accountAddress: {
            type: 'string',
            format: 'address'
          }
        },
        required: ['accountAddress']
      }
    },
    required: ['salary', 'startDate', 'entity']
  })

  componentDidUpdate (prevProps, prevState) {
    if (this.state !== prevState) {
      const state = { ...this.state }

      this.setState({
        ...state,
        isValid: AddEmployee.validate(state)
      })
    }
  }

  handleEntityChange = (accountAddress, entity) => {
    this.setState({ entity })

    // Set focus on salary field
    this.salaryInput.focus()
  }

  handleFormSubmit = (event) => {
    event.preventDefault()

    // TODO: Call contract

    // Reset form data
    this.setState(AddEmployee.initialState)

    // Close side panel
    this.props.onClose()
  }

  handleSalaryChange = (event) => {
    this.setState({ salary: event.target.value })
  }

  handleStartDateChange = (event) => {
    this.setState({ startDate: new Date(event.target.value) })
  }

  handlePanelToggle = (opened) => {
    if (opened) { // When side panel is shown
      // Set focus on entity field if no value provided
      if (!this.state.entity) {
        this.entitySearch.input.focus()
      }
    }
  }

  render () {
    const { entity, salary, startDate, isValid } = this.state

    return (
      <SidePanel
        title='Add new employee'
        opened={this.props.opened}
        onClose={this.props.onClose}
        onTransitionEnd={this.handlePanelToggle}
      >
        <Form onSubmit={this.handleFormSubmit}>
          <Field label='Entity'>
            <EntitySelect
              ref={el => this.entitySearch = el}
              key={entity && entity.domain}
              value={entity && entity.domain}
              onChange={this.handleEntityChange}
            />
          </Field>

          <Field label='Salary'>
            <Input.Currency
              innerRef={el => this.salaryInput = el}
              value={salary || ''}
              onChange={this.handleSalaryChange}
            />
          </Field>

          <Field label='Start Date'>
            <Input.Date
              value={startDate ? formatDate(startDate, 'MM/dd/YYYY') : ''}
              onChange={this.handleStartDateChange}
              readOnly={true} // TODO: implement date picker
            />
          </Field>

          <Field label='Name'>
            <Static>{entity && entity.name || ' '}</Static>
          </Field>

          <Field label='Role'>
            <Static>{entity && entity.role || ' '}</Static>
          </Field>

          <Field label='Account Address'>
            <Static>{entity && entity.accountAddress || ' '}</Static>
          </Field>

          <Button type='submit' mode='strong' disabled={!isValid}>
            Add new employee
          </Button>
        </Form>
      </SidePanel>
    )
  }
}

AddEmployee.propsType = {
  onClose: PropTypes.func,
  opened: PropTypes.bool
}

export default AddEmployee
