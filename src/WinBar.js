var React = require('react');
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

export class WinBar extends React.Component {
  render() {
    return (
      <AppBar
        title="Glih"
        showMenuIconButton={false}
        iconElementRight={
            <IconButton iconClassName="material-icons">close</IconButton>
        }
      />
    );
  }
}
