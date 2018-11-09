/* eslint-env jest */

import React from 'react'
import { fireEvent, render } from 'react-testing-library'
import 'jest-dom/extend-expect'

import App from './App'

describe('App', () => {
  const app = render(<App />)
  const appBar = app.getByTestId('app-bar')

  it('renders a header', () => {
    const title = appBar.querySelector('h1')

    expect(title).toHaveTextContent('Payroll')
  })

  // Tabs
  it('renders "My payroll" tab', () => {
    const tab = app.getByTestId('my-payroll-tab')

    expect(tab).toBeVisible()
    expect(tab).toHaveTextContent('My payroll')
  })

  it('renders "Team payroll" tab', () => {
    const tab = app.getByTestId('team-payroll-tab')

    expect(tab).toBeVisible()
    expect(tab).toHaveTextContent('Team payroll')
  })

  // Check default tab
  it('"My payroll" should be the default tab', () => {
    const defaultTab = app.queryByTestId('my-payroll-section')
    const otherTab = app.queryByTestId('team-payroll-section')

    // Check content for default tab is visible
    expect(defaultTab).not.toBeNull()
    expect(defaultTab).toBeVisible()

    // Check that the other tab is hidden
    expect(otherTab).toBeNull()
  })

  // Check navigation between tabs
  describe('"Team payroll" section', () => {

    beforeAll(() => {
      fireEvent.click(app.getByTestId('team-payroll-tab'))
    })

    it('section content is visible', () => {
      const teamPayrollContent = app.queryByTestId('team-payroll-section')
      const myPayrollContent = app.queryByTestId('my-payroll-section')

      // Check that tab content is visible
      expect(teamPayrollContent).not.toBeNull()
      expect(teamPayrollContent).toBeVisible()

      // Check that the content of the other tab is hidden
      expect(myPayrollContent).toBeNull()
    })

    it('contains a button to add new employee', () => {
      const button = appBar.querySelector('button')

      expect(button).not.toBeNull()
      expect(button).toHaveTextContent('Add new employee')
    })

    it('shows "Add new employee" panel when click on add new employee button', async () => {
      const panel = app.container.querySelector('aside > header')

      fireEvent.click(app.getByTestId('team-payroll-tab'))
      fireEvent.click(appBar.querySelector('button'))

      expect(panel).not.toBeNull()
      expect(panel).toBeVisible()
      expect(panel).toHaveTextContent('Add new employee')
    })
  })

  describe('"My payroll" section', () => {

    beforeAll(() => {
      fireEvent.click(app.getByTestId('my-payroll-tab'))
    })

    it('section content is visible', () => {
      const myPayrollContent = app.queryByTestId('my-payroll-section')
      const teamPayrollContent = app.queryByTestId('team-payroll-section')

      // Check that tab content is visible
      expect(myPayrollContent).not.toBeNull()
      expect(myPayrollContent).toBeVisible()

      // Check that the content of the other tab is hidden
      expect(teamPayrollContent).toBeNull()
    })

    it('contains a button to request salary payment', () => {
      const button = appBar.querySelector('button')

      expect(button).not.toBeNull()
      expect(button).toHaveTextContent('Request salary')
    })
  })
})
