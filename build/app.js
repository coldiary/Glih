'use strict';

var _reactTapEventPlugin = require('react-tap-event-plugin');

var _reactTapEventPlugin2 = _interopRequireDefault(_reactTapEventPlugin);

var _darkBaseTheme = require('material-ui/styles/baseThemes/darkBaseTheme');

var _darkBaseTheme2 = _interopRequireDefault(_darkBaseTheme);

var _getMuiTheme = require('material-ui/styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _colors = require('material-ui/styles/colors');

var _MuiThemeProvider = require('material-ui/styles/MuiThemeProvider');

var _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);

var _WinBar = require('WinBar');

var _WinBar2 = _interopRequireDefault(_WinBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var React = require('react');
var ReactDOM = require('react-dom');


(0, _reactTapEventPlugin2.default)();

var theme = (0, _getMuiTheme2.default)({
  palette: {
    primary1Color: _colors.darkBlack
  }
});

var App = function App() {
  return React.createElement(_MuiThemeProvider2.default, { muiTheme: theme });
};

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));