import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Reader from './lib'

class Wrapper extends Component {
  render() {
    return (
      <div>
        <Reader
          onError={action('Error')}
          onScan={action('Scan')}
        />
      </div>
    )
  }
}

storiesOf('QR Reader', module)
  .add('Camera not specified', () => <Wrapper />)
  // .add('Choose camera', () => <Wrapper selectFacingMode />)
  // .add('Legacy mode', () => <Wrapper legacyMode />)
  // .add('Choose delay', () => <Wrapper selectDelay />)
