import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetchRepo from '../actions/index';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/svg-icons/navigation/menu';
import AppBar from 'material-ui/AppBar';

import RaisedButton from 'material-ui/RaisedButton'

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class SearchBar extends Component {
  constructor() {
    super();

    this.state = { 
      term: '',
      open: false,
    };
  }

  onInputChange(event) {
    console.log(event.target.value);
    this.setState({ term: event.target.value });
  }

  onFormSubmit(event) {
    if(event.keyCode === 13){
      event.preventDefault();
      this.props.fetchRepo(this.state.term);
      this.setState({ term: '' });
    }
  }

  handleToggle(event) {
    event.preventDefault();
    console.log(this.state.open);
    this.setState({ open: !this.state.open });
    setTimeout(() => console.log(this.state.open), 40);
  }

  handleClose() {
    this.setState({ open: false });
  }

  //  render() {
  //   return (
  //     <div>
  //       <RaisedButton
  //         label="Open Drawer"
  //         onTouchTap={this.handleToggle}
  //       />
  //       <Drawer
  //         docked={false}
  //         width={200}
  //         open={this.state.open}
  //         onRequestChange={(open) => this.setState({open})}
  //       >
  //         <MenuItem onTouchTap={this.handleClose}>Menu Item</MenuItem>
  //         <MenuItem onTouchTap={this.handleClose}>Menu Item 2</MenuItem>
  //       </Drawer>
  //     </div>
  //   );
  // }

  render() {
    const styles = {
      title: {
        cursor: 'pointer',
      },
    };

    const log = () => console.log('aasdfasd');
    //fuck
    return (
      <div>
        <MuiThemeProvider>
          <AppBar
            title={<span style={styles.title}>Mangonada</span>}
            iconElementLeft={<IconButton onClick={this.handleToggle.bind(this)}><Menu /></IconButton>}
          >
            <TextField
              onChange={this.onInputChange.bind(this)}
              value={this.state.term}
              onKeyDown={this.onFormSubmit.bind(this)}
              hintText="Enter repo URL"
            />
          </AppBar>
        </MuiThemeProvider>

        <MuiThemeProvider>
          <Drawer
            docked={false}
            width={200}
            open={this.state.open}
            onRequestChange={this.handleClose.bind(this)}
            >
            <MenuItem onClick={log && this.handleClose.bind(this)}>X</MenuItem>
          </Drawer>
        </MuiThemeProvider>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchRepo }, dispatch);
}

export default connect(null, mapDispatchToProps)(SearchBar);
