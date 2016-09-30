import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GithubApiInterface from '../reducers/gitD3/githubBranchFunction';
import d3 from '../reducers/gitD3/d3';
import crossfilter from '../reducers/chartD3/crossfilter';

class CrossfilterChart extends Component {
  makeCrossfilterChart(){
    crossfilter(JSON)
  }


  render(){
    return(
      <div>
        {this.makeCrossfilterChart()}
      </div>
    );
  }

}


function mapStateToProps(state) {
  return { currentRepo: state.currentRepo };
}

export default connect(mapStateToProps)(CrossfilterChart);
