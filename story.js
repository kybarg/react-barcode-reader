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

storiesOf('Barcode scanner', module)
  .add('Default', () => <Wrapper />)
