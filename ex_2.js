// Documentation:
// http://gitgraphjs.com/docs/GitGraph.html
// https://github.com/nicoespeon/gitgraph.js/blob/develop/examples/index.js
const myTemplateConfig = {
  colors: ['#F00', '#0F0', '#00F'], // branches colors, 1 per column
  branch: {
    lineWidth: 8,
    spacingX: 50,
  },
  commit: {
    spacingY: -80,
    dot: {
      size: 12,
    },
    message: {
      displayAuthor: true,
      displayBranch: false,
      displayHash: false,
      font: 'normal 12pt Arial',
    },
    shouldDisplayTooltipsInCompactMode: false, // default = true
    tooltipHTMLFormatter(commit) {
      return '<b>' + commit.sha1 + '</b>' + ': ' + commit.message;
    },
  },
};
const myTemplate = new GitGraph.Template(myTemplateConfig);

/** *********************
 *    INITIALIZATION   *
 ***********************/

const config = {
  template: 'metro',      // could be: "blackarrow" or "metro" or `myTemplate` (custom Template object)
  orientation: 'horizontal'
};
/**
 * Loop through each item in commit and render each commit in gitGraph
 */

const makeGitGraph = (JSONcommits,gitGraphOptions)=>{
  const gitGraph = new GitGraph(gitGraphOptions);
  let branches = {};
  JSONcommits.reverse().forEach((commitObj)=>{
    //this is a commit
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
      branches[commitObj.branch].commit({ sha1 : commitObj.sha.slice(0,5), message : commitObj.branch +" = "+ commitObj.commit.message, sha1: commitObj.sha});
    }else if(commitObj.parents.length===2){
      //this is a Merge
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
};

makeGitGraph(JSONcommits, config);
