"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isContentEditable(element) {
  if (typeof element.getAttribute !== 'function') {
    return false;
  }

  return !!element.getAttribute('contenteditable');
}

function isInput(element) {
  if (!element) {
    return false;
  }

  var tagName = element.tagName;
  var editable = isContentEditable(element);
  return tagName === 'INPUT' || tagName === 'TEXTAREA' || editable;
}

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

var BarcodeScanner = /*#__PURE__*/function (_React$Component) {
  _inherits(BarcodeScanner, _React$Component);

  var _super = _createSuper(BarcodeScanner);

  function BarcodeScanner(props) {
    var _this;

    _classCallCheck(this, BarcodeScanner);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "initScannerDetection", function () {
      _this.firstCharTime = 0;
      _this.stringWriting = '';
      _this.scanButtonCounter = 0;
    });

    _defineProperty(_assertThisInitialized(_this), "scannerDetectionTest", function (s) {
      var _this$props = _this.props,
          minLength = _this$props.minLength,
          avgTimeByChar = _this$props.avgTimeByChar,
          onScanButtonLongPressed = _this$props.onScanButtonLongPressed,
          scanButtonLongPressThreshold = _this$props.scanButtonLongPressThreshold,
          onScan = _this$props.onScan,
          onError = _this$props.onError; // If string is given, test it

      if (s) {
        _this.firstCharTime = 0;
        _this.lastCharTime = 0;
        _this.stringWriting = s;
      }

      if (!_this.scanButtonCounter) {
        _this.scanButtonCounter = 1;
      } // If all condition are good (length, time...), call the callback and re-initialize the plugin for next scanning
      // Else, just re-initialize


      if (_this.stringWriting.length >= minLength && _this.lastCharTime - _this.firstCharTime < _this.stringWriting.length * avgTimeByChar) {
        if (onScanButtonLongPressed && _this.scanButtonCounter > scanButtonLongPressThreshold) onScanButtonLongPressed(_this.stringWriting, _this.scanButtonCounter);else if (onScan) onScan(_this.stringWriting, _this.scanButtonCounter);

        _this.initScannerDetection();

        return true;
      }

      var errorMsg = '';

      if (_this.stringWriting.length < minLength) {
        errorMsg = "String length should be greater or equal ".concat(minLength);
      } else {
        if (_this.lastCharTime - _this.firstCharTime > _this.stringWriting.length * avgTimeByChar) {
          errorMsg = "Average key character time should be less or equal ".concat(avgTimeByChar, "ms");
        }
      }

      if (onError) onError(_this.stringWriting, errorMsg);

      _this.initScannerDetection();

      return false;
    });

    _defineProperty(_assertThisInitialized(_this), "handleKeyPress", function (e) {
      var _this$props2 = _this.props,
          onKeyDetect = _this$props2.onKeyDetect,
          onReceive = _this$props2.onReceive,
          scanButtonKeyCode = _this$props2.scanButtonKeyCode,
          stopPropagation = _this$props2.stopPropagation,
          preventDefault = _this$props2.preventDefault,
          endChar = _this$props2.endChar,
          startChar = _this$props2.startChar,
          timeBeforeScanTest = _this$props2.timeBeforeScanTest;
      var target = e.target;

      if (target instanceof window.HTMLElement && isInput(target)) {
        return;
      } // If it's just the button of the scanner, ignore it and wait for the real input


      if (scanButtonKeyCode && e.which === scanButtonKeyCode) {
        _this.scanButtonCounter += 1; // Cancel default

        e.preventDefault();
        e.stopImmediatePropagation();
      } // Fire keyDetect event in any case!


      if (onKeyDetect) onKeyDetect(e);
      if (stopPropagation) e.stopImmediatePropagation();
      if (preventDefault) e.preventDefault();

      if (_this.firstCharTime && endChar.indexOf(e.which) !== -1) {
        e.preventDefault();
        e.stopImmediatePropagation();
        _this.callIsScanner = true;
      } else if (!_this.firstCharTime && startChar.indexOf(e.which) !== -1) {
        e.preventDefault();
        e.stopImmediatePropagation();
        _this.callIsScanner = false;
      } else {
        if (typeof e.which !== 'undefined') {
          _this.stringWriting += String.fromCharCode(e.which);
        }

        _this.callIsScanner = false;
      }

      if (!_this.firstCharTime) {
        _this.firstCharTime = Date.now();
      }

      _this.lastCharTime = Date.now();
      if (_this.testTimer) clearTimeout(_this.testTimer);

      if (_this.callIsScanner) {
        _this.scannerDetectionTest();

        _this.testTimer = false;
      } else {
        _this.testTimer = setTimeout(_this.scannerDetectionTest, timeBeforeScanTest);
      }

      if (onReceive) onReceive(e);
    });

    _this.firstCharTime = 0;
    _this.lastCharTime = 0;
    _this.stringWriting = '';
    _this.callIsScanner = false;
    _this.testTimer = false;
    _this.scanButtonCounter = 0;
    return _this;
  }

  _createClass(BarcodeScanner, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (inIframe) window.parent.document.addEventListener('keypress', this.handleKeyPress);
      window.document.addEventListener('keypress', this.handleKeyPress);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (inIframe) window.parent.document.removeEventListener('keypress', this.handleKeyPress);
      window.document.removeEventListener('keypress', this.handleKeyPress);
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.testCode) this.scannerDetectionTest(this.props.testCode);
      return null;
    }
  }]);

  return BarcodeScanner;
}(_react["default"].Component);

BarcodeScanner.propTypes = {
  onScan: _propTypes["default"].func,
  // Callback after detection of a successfull scanning (scanned string in parameter)
  onError: _propTypes["default"].func,
  // Callback after detection of a unsuccessfull scanning (scanned string in parameter)
  onReceive: _propTypes["default"].func,
  // Callback after receiving and processing a char (scanned char in parameter)
  onKeyDetect: _propTypes["default"].func,
  // Callback after detecting a keyDown (key char in parameter) - in contrast to onReceive, this fires for non-character keys like tab, arrows, etc. too!
  timeBeforeScanTest: _propTypes["default"].number,
  // Wait duration (ms) after keypress event to check if scanning is finished
  avgTimeByChar: _propTypes["default"].number,
  // Average time (ms) between 2 chars. Used to do difference between keyboard typing and scanning
  minLength: _propTypes["default"].number,
  // Minimum length for a scanning
  endChar: _propTypes["default"].arrayOf(_propTypes["default"].number),
  // Chars to remove and means end of scanning
  startChar: _propTypes["default"].arrayOf(_propTypes["default"].number),
  // Chars to remove and means start of scanning
  scanButtonKeyCode: _propTypes["default"].number,
  // Key code of the scanner hardware button (if the scanner button a acts as a key itself)
  scanButtonLongPressThreshold: _propTypes["default"].number,
  // How many times the hardware button should issue a pressed event before a barcode is read to detect a longpress
  onScanButtonLongPressed: _propTypes["default"].func,
  // Callback after detection of a successfull scan while the scan button was pressed and held down
  stopPropagation: _propTypes["default"].bool,
  // Stop immediate propagation on keypress event
  preventDefault: _propTypes["default"].bool,
  // Prevent default action on keypress event
  testCode: _propTypes["default"].string // Test string for simulating

};
BarcodeScanner.defaultProps = {
  timeBeforeScanTest: 100,
  avgTimeByChar: 30,
  minLength: 6,
  endChar: [9, 13],
  startChar: [],
  scanButtonLongPressThreshold: 3,
  stopPropagation: false,
  preventDefault: false
};
var _default = BarcodeScanner;
exports["default"] = _default;