'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRatiosFromUrl = exports.getScreenshotAndRatios = exports.getRatios = exports.screenshotTweet = exports.openPage = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _puppeteer = require('puppeteer');

var _puppeteer2 = _interopRequireDefault(_puppeteer);

var _uid = require('uid');

var _uid2 = _interopRequireDefault(_uid);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var newBrowser = function newBrowser(browser) {
  return browser || _puppeteer2.default.launch((0, _extends4.default)({}, process.env.CHROME_EXECUTABLE_PATH ? {
    executablePath: process.env.CHROME_EXECUTABLE_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  } : {}, {
    timeout: 10000 // must launch in 10 seconds
  }));
};

var openPage = exports.openPage = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
    var url = _ref2.url,
        tmpBrowser = _ref2.browser,
        _ref2$closeOnError = _ref2.closeOnError,
        closeOnError = _ref2$closeOnError === undefined ? true : _ref2$closeOnError;
    var browser, page, response;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return newBrowser(tmpBrowser);

          case 2:
            browser = _context.sent;
            _context.prev = 3;
            _context.next = 6;
            return newBrowser(browser);

          case 6:
            _context.next = 8;
            return _context.sent.newPage();

          case 8:
            page = _context.sent;
            _context.next = 11;
            return page.goto(url);

          case 11:
            response = _context.sent;

            if (!(response.headers().status !== '200')) {
              _context.next = 14;
              break;
            }

            throw new Error('Page not found');

          case 14:
            return _context.abrupt('return', { page: page, browser: browser });

          case 17:
            _context.prev = 17;
            _context.t0 = _context['catch'](3);

            if (closeOnError) browser.close();
            throw _context.t0;

          case 21:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[3, 17]]);
  }));

  return function openPage(_x) {
    return _ref.apply(this, arguments);
  };
}();

var screenshotTweet = exports.screenshotTweet = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(page) {
    var tweet, screenshotPath;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return page.waitForSelector(_constants.ORIGINAL_TWEET, { timeout: 10000 });

          case 2:
            _context2.next = 4;
            return page.$(_constants.ORIGINAL_TWEET);

          case 4:
            tweet = _context2.sent;
            _context2.next = 7;
            return page.waitFor(6000);

          case 7:
            screenshotPath = (0, _uid2.default)(10) + '.png';
            _context2.next = 10;
            return tweet.screenshot({ path: screenshotPath });

          case 10:
            return _context2.abrupt('return', screenshotPath);

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function screenshotTweet(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var getRatios = exports.getRatios = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(page) {
    var statsStrings;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return page.waitForSelector(_constants.REPLY_SELECTOR, { timeout: 10000 });

          case 2:
            _context3.next = 4;
            return page.evaluate(function () {
              var SELECTOR = '.tweet.permalink-tweet .stream-item-footer [data-tweet-stat-count]';
              // eslint-disable-next-line
              var result = $(SELECTOR).toArray().map(function (s) {
                return s.innerText;
              });
              return result;
            });

          case 4:
            statsStrings = _context3.sent;
            return _context3.abrupt('return', statsStrings.reduce(function (acc, text) {
              if (_constants.STATS_RE.test(text)) {
                // eslint-disable-next-line no-unused-vars
                var _text$match = text.match(_constants.STATS_RE),
                    _text$match2 = (0, _slicedToArray3.default)(_text$match, 3),
                    _ = _text$match2[0],
                    val = _text$match2[1],
                    key = _text$match2[2];

                return (0, _extends4.default)({}, acc, (0, _defineProperty3.default)({}, _constants.KEY_MAP[key], parseInt(val.replace(/\D/g, ''), 10)));
              }
              return acc;
            }, {}));

          case 6:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function getRatios(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

var getScreenshotAndRatios = exports.getScreenshotAndRatios = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(url) {
    var _ref6, page, browser, screenshot, ratios;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return openPage({ url: url });

          case 2:
            _ref6 = _context4.sent;
            page = _ref6.page;
            browser = _ref6.browser;
            _context4.prev = 5;
            _context4.next = 8;
            return screenshotTweet(page);

          case 8:
            screenshot = _context4.sent;
            _context4.next = 11;
            return getRatios(page);

          case 11:
            ratios = _context4.sent;
            _context4.next = 14;
            return browser.close();

          case 14:
            return _context4.abrupt('return', { screenshot: screenshot, ratios: ratios });

          case 17:
            _context4.prev = 17;
            _context4.t0 = _context4['catch'](5);

            console.log('Error:', _context4.t0);
            browser.close();
            return _context4.abrupt('return', {});

          case 22:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[5, 17]]);
  }));

  return function getScreenshotAndRatios(_x4) {
    return _ref5.apply(this, arguments);
  };
}();

var getRatiosFromUrl = exports.getRatiosFromUrl = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(url) {
    var _ref8, page, browser, stats;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return openPage({ url: url });

          case 2:
            _ref8 = _context5.sent;
            page = _ref8.page;
            browser = _ref8.browser;
            _context5.prev = 5;
            _context5.next = 8;
            return getRatios(page);

          case 8:
            stats = _context5.sent;
            _context5.next = 11;
            return browser.close();

          case 11:
            return _context5.abrupt('return', stats);

          case 14:
            _context5.prev = 14;
            _context5.t0 = _context5['catch'](5);

            console.log('Error:', _context5.t0);
            browser.close();
            return _context5.abrupt('return', {});

          case 19:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[5, 14]]);
  }));

  return function getRatiosFromUrl(_x5) {
    return _ref7.apply(this, arguments);
  };
}();