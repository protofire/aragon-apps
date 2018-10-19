/* eslint-env jest */

import React from 'react'
import { fireEvent, render, waitForElement } from 'react-testing-library'
import 'jest-dom/extend-expect'
import { format as formatDate } from 'date-fns'

import AddEmployeePanel from './AddEmployee'

describe('AddEmployee', () => {
  xdescribe('Fields', () => {
    describe('Entity field', () => {
      const panel = render(<AddEmployeePanel />)
      const field = panel.queryByLabelText('Entity')

      it('renders a search input', () => {
        expect(field).not.toBeNull()
        expect(field).toBeVisible()
        expect(field.type).toBe('search')
      })

      it('allows to search for an entity', async () => {
        const searchText = 'protofire'

        expect(field.value).toBe('')

        // Enter search text into the field
        fireEvent.change(field, { target: { value: searchText } })

        // Wait until the suggestions appear
        const suggestion = await waitForElement(() =>
          panel.container.querySelector('ul > li:first-child')
        )

        expect(suggestion).not.toBeNull()
        expect(suggestion).toHaveTextContent('ProtoFire (protofire.aragonid.eth)')

        // Select first suggestion
        fireEvent.click(suggestion)

        // Verify that the data for the selected entity is shown
        const name = panel.queryByTestId('entity-name')
        const role = panel.queryByTestId('entity-role')
        const accountAddress = panel.queryByTestId('entity-account-address')

        expect(name).toHaveTextContent('ProtoFire')
        expect(role).toHaveTextContent('Organization')
        expect(accountAddress).toHaveTextContent('xb4124cEB3451635DAcedd11767f004d8a28c6eE7')
      })
    })

    describe('Salary field', () => {
      const panel = render(<AddEmployeePanel />)
      const field = panel.queryByLabelText('Salary')

      it('renders a numeric input', () => {
        expect(field).not.toBeNull()
        expect(field).toBeVisible()
        expect(field.type).toBe('number')
      })
    })

    describe('Start Date field', () => {
      const panel = render(<AddEmployeePanel />)
      const field = panel.queryByLabelText('Start Date')

      it('renders an input', () => {
        expect(field).not.toBeNull()
        expect(field).toBeVisible()
      })

      it('is today by default', () => {
        const today = new Date()

        expect(field.value).toBe(formatDate(today, 'LL/dd/yyyy'))
      })
    })
  })

  describe('Form validation', () => {
    let form, entityField, salaryField

    beforeEach(async () => {
      const panel = render(<AddEmployeePanel />)

      form = panel.getByTestId('add-employee-form')
      entityField = panel.queryByLabelText('Entity')
      salaryField = panel.queryByLabelText('Salary')
    })

    xit('entity field is required', async () => {
      const submitButton = await waitForElement(() =>
        form.querySelector('button[type="submit"]')
      )

      expect(submitButton).toHaveAttribute('disabled')

      // Fill in Salary field with a valid value
      fireEvent.change(salaryField, { target: { value: '40000' } })
      expect(submitButton).toHaveAttribute('disabled')

      // Try with empty value
      expect(entityField.value).toBe('')
      expect(submitButton).toHaveAttribute('disabled')
    })

    it('allows only positive salaries', async () => {
      const submitButton = await waitForElement(() =>
        form.querySelector('button[type="submit"]')
      )

      expect(submitButton).toHaveAttribute('disabled')

      // Fill in Entity field with a valid value
      fireEvent.change(entityField, { target: { value: 'aragonid.eth' } })

      fireEvent.click(
        await waitForElement(() =>
          form.querySelector('ul > li:first-child')
        )
      )

      expect(submitButton).toHaveAttribute('disabled')

      // Try with empty salary
      fireEvent.change(salaryField, { target: { value: '' } })
      expect(submitButton).toHaveAttribute('disabled')

      // Try with negative salary
      fireEvent.change(salaryField, { target: { value: '-40000' } })
      expect(submitButton).toHaveAttribute('disabled')

      // Try with salary equal to 0
      fireEvent.change(salaryField, { target: { value: '0' } })
      expect(submitButton).toHaveAttribute('disabled')

      // Try with positive salary
      fireEvent.change(salaryField, { target: { value: '40000' } })
      expect(submitButton).not.toHaveAttribute('disabled')
    })
  })
})
