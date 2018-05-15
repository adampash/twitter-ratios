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

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _puppeteer = require('puppeteer');

var _puppeteer2 = _interopRequireDefault(_puppeteer);

var _pageActions = require('./page-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  app.post('/ratios', function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
      var page, url, _ref2, newPage, ratios;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              page = void 0;
              _context.prev = 1;
              url = req.body.url;
              _context.next = 5;
              return (0, _pageActions.openPage)({
                url: url,
                closeOnError: false,
                browser: browser
              });

            case 5:
              _ref2 = _context.sent;
              newPage = _ref2.page;

              page = newPage;
              _context.next = 10;
              return (0, _pageActions.getRatios)(page);

            case 10:
              ratios = _context.sent;
              _context.next = 13;
              return page.close();

            case 13:
              res.json(ratios);
              _context.next = 22;
              break;

            case 16:
              _context.prev = 16;
              _context.t0 = _context['catch'](1);

              if (!page) {
                _context.next = 21;
                break;
              }

              _context.next = 21;
              return page.close();

            case 21:
              res.json({ error: true, msg: _context.t0.message });

            case 22:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[1, 16]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  app.post('/screenshot', function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
      var page, url, _ref4, newPage, ratios, screenshot;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              page = void 0;
              _context2.prev = 1;
              url = req.body.url;
              _context2.next = 5;
              return (0, _pageActions.openPage)({
                url: url,
                closeOnError: false,
                browser: browser
              });

            case 5:
              _ref4 = _context2.sent;
              newPage = _ref4.page;

              page = newPage;
              _context2.next = 10;
              return (0, _pageActions.getRatios)(page);

            case 10:
              ratios = _context2.sent;
              _context2.next = 13;
              return (0, _pageActions.screenshotTweet)(page);

            case 13:
              screenshot = _context2.sent;
              _context2.next = 16;
              return page.close();

            case 16:
              res.json({ screenshot: process.cwd() + '/' + screenshot, ratios: ratios });
              _context2.next = 25;
              break;

            case 19:
              _context2.prev = 19;
              _context2.t0 = _context2['catch'](1);

              if (!page) {
                _context2.next = 24;
                break;
              }

              _context2.next = 24;
              return page.close();

            case 24:
              res.json({ error: true, msg: _context2.t0.message });

            case 25:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined, [[1, 19]]);
    }));

    return function (_x3, _x4) {
      return _ref3.apply(this, arguments);
    };
  }());

  console.log('Starting server on port 3000');
  var server = app.listen(3000);
  return { server: server, browser: browser };
};

exports.default = startServer;