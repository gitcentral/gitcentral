import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetchRepo from '../actions/index';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';

import AppBar from 'material-ui/AppBar';

class SearchBar extends Component {
  constructor() {
    super();

    this.state = { term: '' };
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

  render() {
    return (
      <MuiThemeProvider>
        <AppBar
          title="Mangonada"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        >
          <TextField
            onChange={this.onInputChange.bind(this)}
            value={this.state.term}
            onKeyDown={this.onFormSubmit.bind(this)}
            hintText="Enter Repo URL"
          />
        </AppBar>
      </MuiThemeProvider>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchRepo }, dispatch);
}

export default connect(null, mapDispatchToProps)(SearchBar);
