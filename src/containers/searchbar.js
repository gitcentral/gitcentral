import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetchRepo from '../actions/index';

class SearchBar extends Component {
  constructor() {
    super();

    this.state = { term: '' };
  }

  onInputChange(event) {
    this.setState({ term: event.target.value });
  }

  onFormSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    console.log(this.props);
    this.props.fetchRepo(this.state.term);
    this.setState({ term: '' });
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit.bind(this)}>
        <input
          onChange={this.onInputChange.bind(this)}
          value={this.state.term}
          className="search-bar"
          type="url"
          placeholder="Enter repo link"
        />
        <span className="input-group-btn">
          <button type="submit" className="btn btn-secondary">Submit</button>
        </span>
      </form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchRepo }, dispatch);
}

export default connect(null, mapDispatchToProps)(SearchBar);
