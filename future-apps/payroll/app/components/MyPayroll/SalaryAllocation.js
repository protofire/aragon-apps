import React from 'react'
import styled from 'styled-components'
import { Button, SidePanel, Text } from '@aragon/ui'
import PartitionBar from '../Bar/PartitionBar'

import { getSalaryAllocation } from '../../data'

const Container = styled.section`
  display: flex;
  flex-direction: column;
`

const EditButton = styled(Button).attrs({ mode: 'secondary' })`
  align-self: flex-end;
`

class SalaryAllocation extends React.Component {
  state = {
    allocation: getSalaryAllocation(),
    isEditing: false
  }

  startEditing = () => {
    this.setState({ isEditing: true })
  }

  endEditing = () => {
    this.setState({ isEditing: false })
  }

  render () {
    const { allocation, isEditing } = this.state

    return (
      <Container>
        <Text size='large'>
          Salary allocation
        </Text>

        <PartitionBar data={allocation}/>

        <EditButton onClick={this.startEditing}>
          Edit salary allocation
        </EditButton>

        <SidePanel
          title='Edit salary allocation'
          opened={isEditing}
          onClose={this.endEditing}
        />
      </Container>
    )
  }
}

export default SalaryAllocation
