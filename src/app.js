var React = require('react');
var ReactDOM = require('react-dom');
import injectTapEventPlugin from 'react-tap-event-plugin';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {darkBlack} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import WinBar from './WinBar';

injectTapEventPlugin();

var theme = getMuiTheme({
  palette: {
    primary1Color: darkBlack
  }
});

const App = () => (
  <MuiThemeProvider muiTheme={theme}>
    
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);