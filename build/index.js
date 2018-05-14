#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _pageActions = require('./page-actions');

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cli = (0, _meow2.default)('\n    A CLI for getting the stats of a tweet: replies, likes, and retweets. Can also return\n    a screenshot along with those stats. Uses puppeteer as a headless browser.\n\n    Usage\n      $ twitter-ratios <url> [options]\n \n    Options\n      --ratios, -r  Return ratios (default)\n      --screenshot, -s  Screenshot tweet\n      --server Start server, use same browser instance for calls\n \n    Examples\n      $ twitter-ratios https://twitter.com/PhilipRucker/status/899802454895861760 --screenshot\n', {
  flags: {
    ratios: {
      type: 'boolean',
      alias: 'r'
    },
    screenshot: {
      type: 'boolean',
      alias: 's'
    },
    server: {
      type: 'boolean'
    }
  }
});

var main = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var _cli$input, url, data, _startServer, server, browser, _data;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(cli.input.length === 0 && !cli.flags.server)) {
              _context3.next = 3;
              break;
            }

            cli.showHelp();
            return _context3.abrupt('return');

          case 3:
            _cli$input = (0, _slicedToArray3.default)(cli.input, 1), url = _cli$input[0];

            if (!cli.flags.screenshot) {
              _context3.next = 10;
              break;
            }

            _context3.next = 7;
            return (0, _pageActions.getScreenshotAndRatios)(url);

          case 7:
            data = _context3.sent;

            console.log(JSON.stringify(data));
            return _context3.abrupt('return');

          case 10:
            if (cli.flags.server) {
              _startServer = (0, _server2.default)(), server = _startServer.server, browser = _startServer.browser;

              process.on('SIGTERM', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        console.log('closing gracefully');
                        server.close();
                        console.log('server closed; exiting');
                        _context.next = 5;
                        return browser.close();

                      case 5:
                        console.log('browser closed');
                        process.exit(0);

                      case 7:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              })));
              process.on('SIGINT', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        console.log('closing gracefully');
                        server.close();
                        console.log('server closed; exiting');
                        _context2.next = 5;
                        return browser.close();

                      case 5:
                        console.log('browser closed');
                        process.exit(0);

                      case 7:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              })));
            }

            if (!(cli.flags.ratios || !cli.flags.ratios && !cli.flags.screenshot)) {
              _context3.next = 16;
              break;
            }

            _context3.next = 14;
            return (0, _pageActions.getRatiosFromUrl)(url);

          case 14:
            _data = _context3.sent;

            console.log(JSON.stringify(_data));

          case 16:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function main() {
    return _ref.apply(this, arguments);
  };
}();

main();