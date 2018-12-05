/* eslint-env jest */

import React from 'react'
import {
  cleanup,
  fireEvent,
  render,
  waitForElement
} from 'react-testing-library'
import { bindElementToQueries } from 'dom-testing-library'
import 'jest-dom/extend-expect'
import { format as formatDate } from 'date-fns'

import AddEmployeePanel from './AddEmployee'
import AragonContext from '../context/AragonContext'

import Factory from '../../test/factory'

const bodyUtils = bindElementToQueries(document.body)

afterEach(cleanup)

describe('Add new employee panel', () => {
  it('can be closed with the "x" button', () => {
    const onClose = jest.fn()
    const { buttons } = renderAddEmployeePanel({ onClose })

    expect(buttons.close).not.toBeNull()
    expect(buttons.close).toBeVisible()

    fireEvent.click(buttons.close)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('can be closed pressing ESC', () => {
    const onClose = jest.fn()
    const { form } = renderAddEmployeePanel({ onClose })

    fireEvent.keyDown(form, { key: 'Escape', keyCode: 27, which: 27 })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  describe('Fields', () => {

    describe('Entity field', () => {
      it('renders an alphanumeric input', () => {
        const { fields } = renderAddEmployeePanel()

        expect(fields.entity).not.toBeNull()
        expect(fields.entity).toBeVisible()
        expect(fields.entity.type).toBe('text')
      })
    })

    describe('Name field', () => {
      it('renders an alphanumeric input', () => {
        const { fields } = renderAddEmployeePanel()

        expect(fields.name).not.toBeNull()
        expect(fields.name).toBeVisible()
        expect(fields.name.type).toBe('text')
      })
    })

    describe('Role field', () => {
      it('renders an alphanumeric input', () => {
        const { fields } = renderAddEmployeePanel()

        expect(fields.role).not.toBeNull()
        expect(fields.role).toBeVisible()
        expect(fields.role.type).toBe('text')
      })
    })

    describe('Salary field', () => {
      it('renders a numeric input', () => {
        const { fields } = renderAddEmployeePanel()

        expect(fields.salary).not.toBeNull()
        expect(fields.salary).toBeVisible()
        expect(fields.salary.type).toBe('number')
      })
    })

    describe('Start Date field', () => {
      it('renders an input', () => {
        const { fields } = renderAddEmployeePanel()

        expect(fields.startDate).not.toBeNull()
        expect(fields.startDate).toBeVisible()
      })

      it('is today by default', () => {
        const { fields } = renderAddEmployeePanel()
        const today = new Date()

        expect(fields.startDate.value).toBe(formatDate(today, 'LL/dd/yyyy'))
      })
    })
  })

  describe('Validations', () => {
    it('entity field is required', async () => {
      const { fields, buttons, searchEntity } = renderAddEmployeePanel()
      const { entity, name, role, salary } = fields

      expect(buttons.submit).toHaveAttribute('disabled')

      fireEvent.change(name, {
        target: { value: 'ProtoFire' }
      })

      fireEvent.change(role, {
        target: { value: 'Organization' }
      })

      // Fill in Salary field with a valid value
      fireEvent.change(salary, {
        target: { value: 40000 }
      })

      // Empty value for entity field
      expect(entity.value).toBe('')
      expect(buttons.submit).toHaveAttribute('disabled')

      // Fill in Entity field with a valid value
      fireEvent.change(entity, {
        target: { value: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7' }
      })

      expect(buttons.submit).not.toHaveAttribute('disabled')
    })

    it('allows only positive salaries', async () => {
      const { fields, buttons, searchEntity } = renderAddEmployeePanel()
      const { entity, name, role, salary } = fields

      expect(buttons.submit).toHaveAttribute('disabled')

      // Fill in Entity field with a valid value
      fireEvent.change(entity, {
        target: { value: '0xDcC5dD922fb1D0fd0c450a0636a8cE827521f0eD'}
      })

      expect(buttons.submit).toHaveAttribute('disabled')

      // Try with empty salary
      fireEvent.change(salary, {
        target: { value: '' }
      })

      expect(buttons.submit).toHaveAttribute('disabled')

      // Try with negative salary
      fireEvent.change(salary, {
        target: { value: '-40000' }
      })

      expect(buttons.submit).toHaveAttribute('disabled')

      // Try with salary equal to 0
      fireEvent.change(salary, {
        target: { value: '0' }
      })

      expect(buttons.submit).toHaveAttribute('disabled')

      // Try with positive salary
      fireEvent.change(salary, {
        target: { value: '40000' }
      })

      expect(buttons.submit).not.toHaveAttribute('disabled')
    })
  })
})

function renderAddEmployeePanel (props) {
  const mockApp = {
    state () {
      return this
    },

    map () {
      return this
    },

    toPromise () {
      return []
    },

    subscribe (cb) {
      return { unsubscribe: jest.fn() }
    }
  }

  render(
    <AragonContext.Provider value={mockApp}>
      <AddEmployeePanel opened {...props} />
    </AragonContext.Provider>
  )

  const modalRoot = bodyUtils.getByTestId('modal-root')
  const panel = bindElementToQueries(modalRoot)
  const form = panel.getByTestId('add-employee-form')

  const fields = {
    entity: panel.queryByLabelText('Entity'),
    name: panel.queryByLabelText('Name'),
    role: panel.queryByLabelText('Role'),
    salary: panel.queryByLabelText('Salary'),
    startDate: panel.queryByLabelText('Start Date'),
  }

  const buttons = {
    close: modalRoot.querySelector('button'),
    submit: modalRoot.querySelector('button[type="submit"]')
  }

  return { form, fields, buttons }
}
