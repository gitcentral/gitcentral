import React, { Component } from 'react';
import RepoDisplay from '../containers/repo_display';
import SearchBar from '../containers/searchbar';

export default class App extends Component {
  render() {
    return (
      <div>
        <SearchBar />
        <RepoDisplay />
      </div>
    );
  }
}