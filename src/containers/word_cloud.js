import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GithubApiInterface from '../reducers/gitD3/githubBranchFunction';

class WordCloud extends Component {

  makeWordCloud(){



  }

  render(){
    return(
      <div>
        {this.makeWordCloud()}
      </div>
    )
  }
}


function mapStateToProps(state) {
  return { currentRepo: state.currentRepo };
}

export default connect(mapStateToProps)(WordCloud);
