[![npm version](https://badge.fury.io/js/react-barcode-reader.svg)](https://badge.fury.io/js/react-barcode-reader)

## Introduction
A [React](https://facebook.github.io/react/) component for reading barcode an QR codes from devices that are represent as keyboard to the system.

## Demo
[kybarg.github.io/react-barcode-reader/](https://kybarg.github.io/react-barcode-reader/)

## Install
`npm install --save react-barcode-reader`

## Example

```js
import React, { Component } from 'react'
import BarcodeReader from 'react-barcode-reader'

class Test extends Component {
  constructor(props){
    super(props)
    this.state = {
      result: 'No result',
    }

    this.handleScan = this.handleScan.bind(this)
  }
  handleScan(data){
    this.setState({
      result: data,
    })
  }
  handleError(err){
    console.error(err)
  }
  render(){

    return(
      <div>
        <BarcodeReader
          onError={this.handleError}
          onScan={this.handleScan}
          />
        <p>{this.state.result}</p>
      </div>
    )
  }
}
```

## Props
| Prop | Type | Default Value | Description |
|---|---|---|---|
| onScan | func |  | Callback after detection of a successfull scanning (scanned string in parameter) |
| onError | func |  | Callback after detection of a unsuccessfull scanning (scanned string in parameter) |
| HonReceive | func |  | Callback after receiving and processing a char (scanned char in parameter)
| onKeyDetect | func |  | Callback after detecting a keyDown (key char in parameter) - in contrast to onReceive, this fires for non-character keys like tab, arrows, etc. too!
| timeBeforeScanTest | number | 100 | Wait duration (ms) after keypress event to check if scanning is finished
| avgTimeByChar | number | 30 | Average time (ms) between 2 chars. Used to do difference between keyboard typing and scanning
| minLength | number | 6 | Minimum length for a scanning
| endChar | [number] | [9, 13] | Chars to remove and means end of scanning
| startChar | [number] | [] | Chars to remove and means start of scanning
| scanButtonKeyCode | number |  | Key code of the scanner hardware button (if the scanner button a acts as a key itself)
| scanButtonLongPressThreshold | number | 3 | How many times the hardware button should issue a pressed event before a barcode is read to detect a longpress
| onScanButtonLongPressed | func |  | Callback after detection of a successfull scan while the scan button was pressed and held down
| stopPropagation | bool | false | Stop immediate propagation on keypress event
| preventDefault | bool | false | Prevent default action on keypress event
| testCode | string |  | Test string for simulating

## Dev

### Install dependencies
`npm install`

### Build
`npm run build`

### Demo
`npm run storybook`

### Test
`npm test`

### Linting
`npm run lint`

## License
The MIT License (MIT)

Copyright (c) 2017 Thomas Billiet

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
