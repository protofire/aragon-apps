import React from 'react'
import styled from 'styled-components'
import { AragonApp, AppBar } from '@aragon/ui'

import AppLayout from './components/AppLayout'

const AppContainer = styled(AragonApp)`
  display: flex;
`

export default class App extends React.Component {
  render () {
    return (
      <AppContainer publicUrl='/aragon-ui/'>
        <AppLayout>
          <AppLayout.Header>
            <AppBar title='Payroll'/>
          </AppLayout.Header>

          <AppLayout.ScrollWrapper>
            <AppLayout.Content>
              {/* */}
            </AppLayout.Content>
          </AppLayout.ScrollWrapper>
        </AppLayout>
      </AppContainer>
    )
  }
}
