import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, Field, SidePanel } from '@aragon/ui'

import Input from '../Input/Input'
import validator from '../../data/validation'

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;

  > :first-child, > :nth-child(n+6) {
    grid-column: span 2;
  }

  > :last-child {
    margin-top: 20px;
  }
`

const employeeValidator = validator.compile({
  type: 'object',
  properties: {
    salary: {
      type: 'number',
      exclusiveMinimum: 0
    },
    startDate: {
      format: 'date'
    },
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
  required: ['salary', 'startDate', 'name', 'role', 'accountAddress']
})

class AddEmployee extends React.PureComponent {
  state = {
    employee: {
      startDate: new Date()
    }
  }

  handleChange = (value, name) => {
    if (name) {
      this.setState(state => {
        const employee = {
          ...state.employee,
          [name]: value
        }

        return { employee }
      })
    }
  }

  validate = () => {
    return employeeValidator(this.state.employee)
  }

  render () {
    const { employee } = this.state
    const isValid = this.validate()

    return (
      <SidePanel
        title='Add new employee'
        opened={this.props.opened}
        onClose={this.props.onClose}
      >
        <Form>
          <Field label='Entity'>
            <Input.Text
              name='entity'
              value={employee.entity}
              readOnly={true}
            />
          </Field>

          <Field label='Salary'>
            <Input.Number
              name='salary'
              value={employee.salary}
              onChange={this.handleChange}
              required={true}
              autoFocus={true}
            />
          </Field>

          <Field label='Start Date'>
            <Input.Date
              name='startDate'
              value={employee.startDate}
              onChange={this.handleChange}
              required={true}
              readOnly={true}
            />
          </Field>

          <Field label='Name'>
            <Input.Text
              name='name'
              value={employee.name}
              onChange={this.handleChange}
              required={true}
            />
          </Field>

          <Field label='Role'>
            <Input.Text
              name='role'
              value={employee.role}
              onChange={this.handleChange}
              required={true}
            />
          </Field>

          <Field label='Account Address'>
            <Input.Text
              name='accountAddress'
              value={employee.accountAddress}
              onChange={this.handleChange}
              required={true}
            />
          </Field>

          <Button
            mode="strong"
            disabled={!isValid}
            onClick={this.props.onClose}
          >
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
