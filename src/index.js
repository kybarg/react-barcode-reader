import React from 'react'
import PropTypes from 'prop-types'

function isContentEditable(element) {
  if (typeof element.getAttribute !== 'function') {
    return false
  }

  return !!element.getAttribute('contenteditable')
}

function isInput(element) {
  if (!element) {
    return false
  }

  const { tagName } = element
  const editable = isContentEditable(element)

  return tagName === 'INPUT' || tagName === 'TEXTAREA' || editable
}

function inIframe() {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

class BarcodeScanner extends React.Component {
  constructor(props) {
    super(props)

    this.firstCharTime = 0
    this.lastCharTime = 0
    this.stringWriting = ''
    this.callIsScanner = false
    this.testTimer = false
    this.scanButtonCounter = 0
  }

  componentDidMount() {
    if (inIframe) window.parent.document.addEventListener('keypress', this.handleKeyPress)
    window.document.addEventListener('keypress', this.handleKeyPress)
  }

  componentWillUnmount() {
    if (inIframe) window.parent.document.removeEventListener('keypress', this.handleKeyPress)
    window.document.removeEventListener('keypress', this.handleKeyPress)
  }

  initScannerDetection = () => {
    this.firstCharTime = 0
    this.stringWriting = ''
    this.scanButtonCounter = 0
  }

  scannerDetectionTest = (s) => {
    const {
      minLength, avgTimeByChar, onScanButtonLongPressed, scanButtonLongPressThreshold, onScan, onError,
    } = this.props
    // If string is given, test it
    if (s) {
      this.firstCharTime = 0
      this.lastCharTime = 0
      this.stringWriting = s
    }

    if (!this.scanButtonCounter) {
      this.scanButtonCounter = 1
    }

    // If all condition are good (length, time...), call the callback and re-initialize the plugin for next scanning
    // Else, just re-initialize
    if (this.stringWriting.length >= minLength && this.lastCharTime - this.firstCharTime < this.stringWriting.length * avgTimeByChar) {
      if (onScanButtonLongPressed && this.scanButtonCounter > scanButtonLongPressThreshold) onScanButtonLongPressed(this.stringWriting, this.scanButtonCounter)
      else if (onScan) onScan(this.stringWriting, this.scanButtonCounter)

      this.initScannerDetection()
      return true
    }

    let errorMsg = ''
    if (this.stringWriting.length < minLength) {
      errorMsg = `String length should be greater or equal ${minLength}`
    } else {
      if (this.lastCharTime - this.firstCharTime > this.stringWriting.length * avgTimeByChar) {
        errorMsg = `Average key character time should be less or equal ${avgTimeByChar}ms`
      }
    }

    if (onError) onError(this.stringWriting, errorMsg)
    this.initScannerDetection()
    return false
  }

  handleKeyPress = (e) => {
    const {
      onKeyDetect, onReceive, scanButtonKeyCode, stopPropagation, preventDefault, endChar, startChar, timeBeforeScanTest,
    } = this.props

    const { target } = e

    if (target instanceof window.HTMLElement && isInput(target)) {
      return
    }

    // If it's just the button of the scanner, ignore it and wait for the real input
    if (scanButtonKeyCode && e.which === scanButtonKeyCode) {
      this.scanButtonCounter += 1
      // Cancel default
      e.preventDefault()
      e.stopImmediatePropagation()
    }
    // Fire keyDetect event in any case!
    if (onKeyDetect) onKeyDetect(e)

    if (stopPropagation) e.stopImmediatePropagation()
    if (preventDefault) e.preventDefault()

    if (this.firstCharTime && endChar.indexOf(e.which) !== -1) {
      e.preventDefault()
      e.stopImmediatePropagation()
      this.callIsScanner = true
    } else if (!this.firstCharTime && startChar.indexOf(e.which) !== -1) {
      e.preventDefault()
      e.stopImmediatePropagation()
      this.callIsScanner = false
    } else {
      if (typeof (e.which) !== 'undefined') {
        this.stringWriting += String.fromCharCode(e.which)
      }
      this.callIsScanner = false
    }

    if (!this.firstCharTime) {
      this.firstCharTime = Date.now()
    }
    this.lastCharTime = Date.now()

    if (this.testTimer) clearTimeout(this.testTimer)
    if (this.callIsScanner) {
      this.scannerDetectionTest()
      this.testTimer = false
    } else {
      this.testTimer = setTimeout(this.scannerDetectionTest, timeBeforeScanTest)
    }

    if (onReceive) onReceive(e)
  }

  render() {
    if (this.props.testCode) this.scannerDetectionTest(this.props.testCode)
    return null
  }
}


BarcodeScanner.propTypes = {
  onScan: PropTypes.func, // Callback after detection of a successfull scanning (scanned string in parameter)
  onError: PropTypes.func, // Callback after detection of a unsuccessfull scanning (scanned string in parameter)
  onReceive: PropTypes.func, // Callback after receiving and processing a char (scanned char in parameter)
  onKeyDetect: PropTypes.func, // Callback after detecting a keyDown (key char in parameter) - in contrast to onReceive, this fires for non-character keys like tab, arrows, etc. too!
  timeBeforeScanTest: PropTypes.number, // Wait duration (ms) after keypress event to check if scanning is finished
  avgTimeByChar: PropTypes.number, // Average time (ms) between 2 chars. Used to do difference between keyboard typing and scanning
  minLength: PropTypes.number, // Minimum length for a scanning
  endChar: PropTypes.arrayOf(PropTypes.number), // Chars to remove and means end of scanning
  startChar: PropTypes.arrayOf(PropTypes.number), // Chars to remove and means start of scanning
  scanButtonKeyCode: PropTypes.number, // Key code of the scanner hardware button (if the scanner button a acts as a key itself)
  scanButtonLongPressThreshold: PropTypes.number, // How many times the hardware button should issue a pressed event before a barcode is read to detect a longpress
  onScanButtonLongPressed: PropTypes.func, // Callback after detection of a successfull scan while the scan button was pressed and held down
  stopPropagation: PropTypes.bool, // Stop immediate propagation on keypress event
  preventDefault: PropTypes.bool, // Prevent default action on keypress event
  testCode: PropTypes.string, // Test string for simulating
}

BarcodeScanner.defaultProps = {
  timeBeforeScanTest: 100,
  avgTimeByChar: 30,
  minLength: 6,
  endChar: [9, 13],
  startChar: [],
  scanButtonLongPressThreshold: 3,
  stopPropagation: false,
  preventDefault: false,
}

export default BarcodeScanner