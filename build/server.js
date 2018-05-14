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

  app.post('/ratios', function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
      var url, _ref2, page, ratios;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              url = req.body.url;
              _context.next = 4;
              return (0, _pageActions.openPage)({ url: url, closeOnError: false, browser: browser });

            case 4:
              _ref2 = _context.sent;
              page = _ref2.page;
              _context.next = 8;
              return (0, _pageActions.getRatios)(page);

            case 8:
              ratios = _context.sent;
              _context.next = 11;
              return page.close();

            case 11:
              res.json(ratios);
              _context.next = 17;
              break;

            case 14:
              _context.prev = 14;
              _context.t0 = _context['catch'](0);

              res.json({ error: true, msg: _context.t0.message });

            case 17:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 14]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  app.post('/screenshot', function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
      var url, _ref4, page, ratios, screenshot;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              url = req.body.url;
              _context2.next = 4;
              return (0, _pageActions.openPage)({ url: url, closeOnError: false, browser: browser });

            case 4:
              _ref4 = _context2.sent;
              page = _ref4.page;
              _context2.next = 8;
              return (0, _pageActions.getRatios)(page);

            case 8:
              ratios = _context2.sent;
              _context2.next = 11;
              return (0, _pageActions.screenshotTweet)(page);

            case 11:
              screenshot = _context2.sent;
              _context2.next = 14;
              return page.close();

            case 14:
              res.json({ screenshot: process.cwd() + '/' + screenshot, ratios: ratios });
              _context2.next = 20;
              break;

            case 17:
              _context2.prev = 17;
              _context2.t0 = _context2['catch'](0);

              res.json({ error: true, msg: _context2.t0.message });

            case 20:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined, [[0, 17]]);
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