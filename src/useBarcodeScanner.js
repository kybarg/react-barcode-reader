import { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

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

	const { tagName } = element;
	const editable = isContentEditable(element);

	return tagName === 'INPUT' || tagName === 'TEXTAREA' || editable;
}

function inIframe() {
	try {
		return window.self !== window.top;
	} catch (e) {
		return true;
	}
}

const initialState = {
	firstCharTime: 0,
	lastCharTime: 0,
	stringWriting: '',
	callIsScanner: false,
	testTimer: false,
	scanButtonCounter: 0
};

const barcodeScannerReducer = (state, action) => {
	const { type, ...value } = action;
	switch (action.type) {
		case 'init':
			return { ...state, firstCharTime: 0, lastCharTime: 0, stringWriting: '' };
		case 'test_string':
			return {
				...state,
				firstCharTime: 0,
				lastCharTime: 0,
				stringWriting: action.stringWriting
			};
		case 'set_value':
			return { ...state, ...value };
		default:
			return state;
	}
};

const useBarcodeScanner = ({
	testCode,
	onScan,
	onError,
	onKeyDetect,
	onReceive,
	onScanButtonLongPressed,
	scanButtonKeyCode,
	stopPropagation = false,
	preventDefault = false,
	startChar = [],
	endChar = [ 9, 13 ],
	timeBeforeScanTest = 100,
	minLength = 6,
	avgTimeByChar = 30,
	scanButtonLongPressThreshold = 3
}) => {
	const [ state, dispatch ] = useReducer(barcodeScannerReducer, initialState);
	const { firstCharTime, lastCharTime, stringWriting, callIsScanner, testTimer, scanButtonCounter } = state;

	useEffect(() => {
		if (inIframe()) {
			window.parent.document.addEventListener('keypress', handleKeyPress);
		}
		window.document.addEventListener('keypress', handleKeyPress);

		return () => {
			if (inIframe()) {
				window.parent.document.removeEventListener('keypress', handleKeyPress);
			}
			window.document.removeEventListener('keypress', handleKeyPress);
		};
	}, []);

	const scannerDetectionTest = (s) => {
		// If string is given, test it
		if (s) {
			dispatch({ type: 'init' });
		}

		if (!scanButtonCounter) {
			dispatch({ type: 'set_value', scanButtonCounter: 1 });
		}

		// If all condition are good (length, time...), call the callback and re-initialize the plugin for next scanning
		// Else, just re-initialize
		if (stringWriting.length >= minLength && lastCharTime - firstCharTime < stringWriting.length * avgTimeByChar) {
			if (onScanButtonLongPressed && scanButtonCounter > scanButtonLongPressThreshold)
				onScanButtonLongPressed(stringWriting, scanButtonCounter);
			else if (onScan) onScan(stringWriting, scanButtonCounter);
			dispatch({ type: 'init' });
			return true;
		}

		let errorMsg = '';
		if (stringWriting.length < minLength) {
			errorMsg = `String length should be greater or equal ${minLength}`;
		} else {
			if (lastCharTime - firstCharTime > stringWriting.length * avgTimeByChar) {
				errorMsg = `Average key character time should be less or equal ${avgTimeByChar}ms`;
			}
		}

		if (onError) onError(stringWriting, errorMsg);

		dispatch({ type: 'init' });
		return false;
	};

	const handleKeyPress = (e) => {
		const { target } = e;

		if (target instanceof window.HTMLElement && isInput(target)) {
			return;
		}

		// If it's just the button of the scanner, ignore it and wait for the real input
		if (scanButtonKeyCode && e.which === scanButtonKeyCode) {
			dispatch({ type: 'set_value', scanButtonCounter: scanButtonCounter + 1 });
			// Cancel default
			e.preventDefault();
			e.stopImmediatePropagation();
		}
		// Fire keyDetect event in any case!
		if (onKeyDetect) onKeyDetect(e);

		if (stopPropagation) e.stopImmediatePropagation();
		if (preventDefault) e.preventDefault();

		if (firstCharTime && endChar.indexOf(e.which) !== -1) {
			e.preventDefault();
			e.stopImmediatePropagation();
			dispatch({ type: 'set_value', callIsScanner: true });
		} else if (!firstCharTime && startChar.indexOf(e.which) !== -1) {
			e.preventDefault();
			e.stopImmediatePropagation();
			dispatch({ type: 'set_value', callIsScanner: false });
		} else {
			if (typeof e.which !== 'undefined') {
				let oldStringWriting = stringWriting;
				dispatch({
					type: 'set_value',
					stringWriting: (oldStringWriting += String.fromCharCode(e.which))
				});
			}
			dispatch({ type: 'set_value', callIsScanner: false });
		}

		if (!firstCharTime) {
			dispatch({ type: 'set_value', firstCharTime: Date.now() });
		}
		dispatch({ type: 'set_value', lastCharTime: Date.now() });

		if (testTimer) clearTimeout(testTimer);
		if (callIsScanner) {
			scannerDetectionTest();
			dispatch({ type: 'set_value', testTimer: false });
		} else {
			dispatch({
				type: 'set_value',
				testTimer: setTimeout(scannerDetectionTest, timeBeforeScanTest)
			});
		}

		if (onReceive) onReceive(e);
	};

	return testCode ? scannerDetectionTest(testCode) : null;
};

useBarcodeScanner.propTypes = {
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
	testCode: PropTypes.string // Test string for simulating
};

export default useBarcodeScanner;
