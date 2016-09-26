import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { SHALookup } from '../reducers/gitGraphDemo/jsonTogitGraph';
import { SHALookup } from '../reducers/gitGraphDemo/sampleObj';

class RepoDisplay extends Component {
  makeGitGraph() {
    const gitGraphOptions = {
      template: 'metro',      // could be: "blackarrow" or "metro" or `myTemplate` (custom Template object)
      orientation: 'horizontal'
    };

    let JSONcommits;
    if(this.props.currentRepo.length === 2) {
      if(this.props.currentRepo[0].length > this.props.currentRepo[1].length) {
        JSONcommits = this.props.currentRepo[0];
      } else {
        JSONcommits = this.props.currentRepo[1];
      }
    } else {
      JSONcommits = this.props.currentRepo;
    }
    

    /**
     * Loop through each item in commit and render each commit in gitGraph
     */
    const gitGraph = new GitGraph(gitGraphOptions);
    let branches = {};
    JSONcommits.reverse().forEach((commitObj)=>{
      //this is a commit
      console.log(commitObj)
      if(commitObj.parents.length===0){
        const master = gitGraph.branch('master');
        master.commit({message: commitObj.branch +" = "+ commitObj.commit.message, sha1: commitObj.sha});
        branches["master"] = master;
      }else if(commitObj.parents.length===1){
        //check if its a new branch
        if(!branches[commitObj.branch]){
          branches[commitObj.branch] = gitGraph.branch(commitObj.branch);
          // console.log(commitObj.branch,"commitObj.branch");
        }
        
        branches[commitObj.branch].commit({
          sha1 : commitObj.sha.slice(0,5),
          message : commitObj.branch +" = "+ commitObj.commit.message,
          sha1: commitObj.sha
        });
      }else if(commitObj.parents.length===2){
        //this is a Merge
        //LOL
        if(!SHALookup[commitObj.parents[0].sha]) return;

        let parent0Branch =SHALookup[commitObj.parents[0].sha].branch;
        let parent1Branch =SHALookup[commitObj.parents[1].sha].branch;
        let mergeTo = branches[parent0Branch];
        let mergeFrom = branches[parent1Branch];
        if(!mergeTo){
          branches[parent0Branch] = mergeTo = gitGraph.branch(parent0Branch);
        }
        if(!mergeFrom){
          branches[parent1Branch] = mergeFrom = gitGraph.branch(parent1Branch);
        }
        mergeFrom.merge(mergeTo, { sha1: commitObj.sha.slice(0,5), message :
          parent1Branch + " -> " + parent0Branch + " "+commitObj.commit.message});
      }
    });
  }

  render() {

    return (
      <div>
        {this.makeGitGraph()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { currentRepo: state.currentRepo };
}

export default connect(mapStateToProps)(RepoDisplay);
