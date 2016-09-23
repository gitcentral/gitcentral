import React, { Component } from 'react';

export default class App extends Component {
  onLinkEnter(link) {
    // preventDefault();
    console.log(link);
  }

  render() {
    return (
      <div>
        <form onSubmit={event => this.onLinkEnter(event.target)}>
          <input
            className="search-bar"
            type="url"
            placeholder="Enter repo link"
          />
        </form>
        <canvas id="gitGraph"/>
        {this.props.children}
      </div>
    );
  }
}