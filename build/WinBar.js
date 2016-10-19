'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WinBar = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AppBar = require('material-ui/AppBar');

var _AppBar2 = _interopRequireDefault(_AppBar);

var _IconButton = require('material-ui/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

var WinBar = exports.WinBar = function (_React$Component) {
  _inherits(WinBar, _React$Component);

  function WinBar() {
    _classCallCheck(this, WinBar);

    return _possibleConstructorReturn(this, (WinBar.__proto__ || Object.getPrototypeOf(WinBar)).apply(this, arguments));
  }

  _createClass(WinBar, [{
    key: 'render',
    value: function render() {
      return React.createElement(_AppBar2.default, {
        title: 'Glih',
        showMenuIconButton: false,
        iconElementRight: React.createElement(
          _IconButton2.default,
          { iconClassName: 'material-icons' },
          'close'
        )
      });
    }
  }]);

  return WinBar;
}(React.Component);