'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _pQueue = require('p-queue');

var _pQueue2 = _interopRequireDefault(_pQueue);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _puppeteer = require('puppeteer');

var _puppeteer2 = _interopRequireDefault(_puppeteer);

var _pageActions = require('./page-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = require('logger').createLogger();
var queue = new _pQueue2.default({ concurrency: 1 });
var pagesOpened = 0;
var browser = void 0;

var launchBrowser = function launchBrowser() {
  return _puppeteer2.default.launch((0, _extends3.default)({}, process.env.CHROME_EXECUTABLE_PATH ? {
    executablePath: process.env.CHROME_EXECUTABLE_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  } : {}, {
    timeout: 10000 // must launch in 10 seconds
  }));
};

var relaunchBrowser = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!browser) {
              _context.next = 3;
              break;
            }

            _context.next = 3;
            return browser.close();

          case 3:
            _context.next = 5;
            return launchBrowser();

          case 5:
            browser = _context.sent;

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function relaunchBrowser() {
    return _ref.apply(this, arguments);
  };
}();

var startServer = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
    var app, countPages, queueCount, runRatios, runScreenshot, server;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            app = (0, _express2.default)();

            app.use(_bodyParser2.default.json());

            _context8.next = 4;
            return relaunchBrowser();

          case 4:
            countPages = function () {
              var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(fn) {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!(pagesOpened > 10)) {
                          _context2.next = 11;
                          break;
                        }

                        _context2.prev = 1;

                        logger.info('closing and reopening browser');
                        _context2.next = 5;
                        return relaunchBrowser();

                      case 5:
                        pagesOpened = 0;
                        _context2.next = 11;
                        break;

                      case 8:
                        _context2.prev = 8;
                        _context2.t0 = _context2['catch'](1);

                        logger.info('Error restarting browser:', _context2.t0);

                      case 11:
                        pagesOpened += 1;
                        fn();

                      case 13:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined, [[1, 8]]);
              }));

              return function countPages(_x) {
                return _ref3.apply(this, arguments);
              };
            }();

            app.get('/ping', function (req, res) {
              res.send('pong');
            });

            queueCount = function queueCount() {
              return 'queue len: ' + queue.size + '; queue pending: ' + queue.pending;
            };

            app.get('/queue', function (req, res) {
              res.send(queueCount());
            });

            runRatios = function () {
              var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res, url) {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return queue.add(countPages((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                          var page, _ref6, newPage, ratios;

                          return _regenerator2.default.wrap(function _callee3$(_context3) {
                            while (1) {
                              switch (_context3.prev = _context3.next) {
                                case 0:
                                  page = void 0;
                                  _context3.prev = 1;
                                  _context3.next = 4;
                                  return (0, _pageActions.openPage)({
                                    url: url,
                                    closeOnError: false,
                                    browser: browser
                                  });

                                case 4:
                                  _ref6 = _context3.sent;
                                  newPage = _ref6.page;

                                  page = newPage;
                                  _context3.next = 9;
                                  return (0, _pageActions.getRatios)(page);

                                case 9:
                                  ratios = _context3.sent;

                                  logger.info('ratios', ratios);
                                  _context3.next = 13;
                                  return page.close();

                                case 13:
                                  res.json(ratios);
                                  _context3.next = 28;
                                  break;

                                case 16:
                                  _context3.prev = 16;
                                  _context3.t0 = _context3['catch'](1);

                                  if (!page) {
                                    _context3.next = 21;
                                    break;
                                  }

                                  _context3.next = 21;
                                  return page.close();

                                case 21:
                                  logger.info('error!', _context3.t0);

                                  if (!(_context3.t0.message.trim() === 'Error: not opened')) {
                                    _context3.next = 27;
                                    break;
                                  }

                                  logger.info('Browser closed unexpectedly; reopening, running again');
                                  _context3.next = 26;
                                  return relaunchBrowser();

                                case 26:
                                  runRatios(req, res, url);

                                case 27:
                                  res.json({ error: true, msg: _context3.t0.message });

                                case 28:
                                case 'end':
                                  return _context3.stop();
                              }
                            }
                          }, _callee3, undefined, [[1, 16]]);
                        }))));

                      case 2:
                      case 'end':
                        return _context4.stop();
                    }
                  }
                }, _callee4, undefined);
              }));

              return function runRatios(_x2, _x3, _x4) {
                return _ref4.apply(this, arguments);
              };
            }();

            runScreenshot = function () {
              var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res, url) {
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return queue.add(countPages((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                          var page, _ref9, newPage, ratios, screenshot;

                          return _regenerator2.default.wrap(function _callee5$(_context5) {
                            while (1) {
                              switch (_context5.prev = _context5.next) {
                                case 0:
                                  page = void 0;
                                  _context5.prev = 1;
                                  _context5.next = 4;
                                  return (0, _pageActions.openPage)({
                                    url: url,
                                    closeOnError: false,
                                    browser: browser
                                  });

                                case 4:
                                  _ref9 = _context5.sent;
                                  newPage = _ref9.page;

                                  page = newPage;
                                  _context5.next = 9;
                                  return (0, _pageActions.getRatios)(page);

                                case 9:
                                  ratios = _context5.sent;
                                  _context5.next = 12;
                                  return (0, _pageActions.screenshotTweet)(page);

                                case 12:
                                  screenshot = _context5.sent;
                                  _context5.next = 15;
                                  return page.close();

                                case 15:
                                  res.json({ screenshot: process.cwd() + '/' + screenshot, ratios: ratios });
                                  _context5.next = 29;
                                  break;

                                case 18:
                                  _context5.prev = 18;
                                  _context5.t0 = _context5['catch'](1);

                                  if (!page) {
                                    _context5.next = 23;
                                    break;
                                  }

                                  _context5.next = 23;
                                  return page.close();

                                case 23:
                                  if (!(_context5.t0.message.trim() === 'Error: not opened')) {
                                    _context5.next = 28;
                                    break;
                                  }

                                  logger.info('Browser closed unexpectedly; reopening, running again');
                                  _context5.next = 27;
                                  return relaunchBrowser();

                                case 27:
                                  runRatios(req, res, url);

                                case 28:
                                  res.json({ error: true, msg: _context5.t0.message });

                                case 29:
                                case 'end':
                                  return _context5.stop();
                              }
                            }
                          }, _callee5, undefined, [[1, 18]]);
                        }))));

                      case 2:
                      case 'end':
                        return _context6.stop();
                    }
                  }
                }, _callee6, undefined);
              }));

              return function runScreenshot(_x5, _x6, _x7) {
                return _ref7.apply(this, arguments);
              };
            }();

            app.post('/ratios', function (req, res) {
              return runRatios(req, res, req.body.url);
            });
            app.get('/ratios', function (req, res) {
              return runRatios(req, res, req.query.url);
            });

            app.post('/screenshot', function (req, res) {
              return runScreenshot(req, res, req.body.url);
            });
            app.get('/screenshot', function (req, res) {
              return runScreenshot(req, res, req.query.url);
            });

            app.get('/restart-browser', function () {
              var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(req, res) {
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return relaunchBrowser();

                      case 2:
                        logger.info('Browser restarted');
                        res.send('Browser restarted');

                      case 4:
                      case 'end':
                        return _context7.stop();
                    }
                  }
                }, _callee7, undefined);
              }));

              return function (_x8, _x9) {
                return _ref10.apply(this, arguments);
              };
            }());

            logger.info('Starting server on port 3000');
            server = app.listen(3000);
            return _context8.abrupt('return', { server: server, browser: browser });

          case 18:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function startServer() {
    return _ref2.apply(this, arguments);
  };
}();

exports.default = startServer;