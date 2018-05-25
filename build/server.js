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

var queue = new _pQueue2.default({ concurrency: 8 });

var startServer = function startServer() {
  var app = (0, _express2.default)();
  app.use(_bodyParser2.default.json());
  var browser = _puppeteer2.default.launch((0, _extends3.default)({}, process.env.CHROME_EXECUTABLE_PATH ? {
    executablePath: process.env.CHROME_EXECUTABLE_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  } : {}, {
    timeout: 10000 // must launch in 10 seconds
  }));

  app.get('/ping', function (req, res) {
    res.send('pong');
  });

  var queueCount = function queueCount() {
    return 'queue len: ' + queue.size + '; queue pending: ' + queue.pending;
  };
  app.get('/queue', function (req, res) {
    res.send(queueCount());
  });

  var runRatios = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res, url) {
      var page;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              page = void 0;
              _context2.next = 3;
              return queue.add((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var _ref3, newPage, ratios;

                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;

                        console.log('running ratio...');
                        console.log('queueCount()', queueCount());
                        // const { url } = req.body;
                        _context.next = 5;
                        return (0, _pageActions.openPage)({
                          url: url,
                          closeOnError: false,
                          browser: browser
                        });

                      case 5:
                        _ref3 = _context.sent;
                        newPage = _ref3.page;

                        page = newPage;
                        _context.next = 10;
                        return (0, _pageActions.getRatios)(page);

                      case 10:
                        ratios = _context.sent;

                        console.log('ratios', ratios);
                        _context.next = 14;
                        return page.close();

                      case 14:
                        res.json(ratios);
                        _context.next = 24;
                        break;

                      case 17:
                        _context.prev = 17;
                        _context.t0 = _context['catch'](0);

                        if (!page) {
                          _context.next = 22;
                          break;
                        }

                        _context.next = 22;
                        return page.close();

                      case 22:
                        console.log('error!', _context.t0);
                        res.json({ error: true, msg: _context.t0.message });

                      case 24:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined, [[0, 17]]);
              })));

            case 3:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function runRatios(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();

  app.post('/ratios', function (req, res) {
    return runRatios(req, res, req.body.url);
  });
  app.get('/ratios', function (req, res) {
    return runRatios(req, res, req.query.url);
  });

  app.post('/screenshot', function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
      var page;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              page = void 0;
              _context4.next = 3;
              return queue.add((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                var url, _ref6, newPage, ratios, screenshot;

                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.prev = 0;
                        url = req.body.url;
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
                        _context3.next = 12;
                        return (0, _pageActions.screenshotTweet)(page);

                      case 12:
                        screenshot = _context3.sent;
                        _context3.next = 15;
                        return page.close();

                      case 15:
                        res.json({ screenshot: process.cwd() + '/' + screenshot, ratios: ratios });
                        _context3.next = 24;
                        break;

                      case 18:
                        _context3.prev = 18;
                        _context3.t0 = _context3['catch'](0);

                        if (!page) {
                          _context3.next = 23;
                          break;
                        }

                        _context3.next = 23;
                        return page.close();

                      case 23:
                        res.json({ error: true, msg: _context3.t0.message });

                      case 24:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined, [[0, 18]]);
              })));

            case 3:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    }));

    return function (_x4, _x5) {
      return _ref4.apply(this, arguments);
    };
  }());

  console.log('Starting server on port 3001');
  var server = app.listen(3001);
  return { server: server, browser: browser };
};

exports.default = startServer;