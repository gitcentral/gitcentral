
// let {JSONcommits, SHALookup, JSONbranches} = require ('./a.js');

// let {JSONcommits, JSONbranches} = require ('./testJSON.js');
let {JSONcommits, JSONbranches} = require ('./jsonTogitGraph.js');

let SHALookup = { "sha" : {}};
/**
 * Set up SHALookup hash table
 * @type {Array}
 */
JSONcommits.reduce(function initCommitsAndLookupTable(results, commit, index, collection) {
  results[commit.sha] = commit;
  commit.children = [];
  return results;
}, SHALookup);
// console.log(SHALookup);

/**
 * Add childrens to each node
 * @type {[type]}
 */
JSONcommits.map(function insertChildren(commit, index, collection) {
  commit.parents.map(function (parentInfo) {
    var parentCommit = SHALookup[parentInfo.sha];
    if(parentCommit===undefined){
      return;
    }
    parentCommit.children.push(commit.sha);
  });
})

var branchLookUp={};

JSONbranches.reduce(function makeBranchesHash(results, branch, index, collection) {
  results[branch.commit.sha] = branch;
  return results;
}, branchLookUp);


JSONbranches.filter((branch)=>{
  return branch.name !== "master";
}).forEach((branch)=>{
  const commit = branchLookUp[branch.commit.sha];
  checkBranch(commit);
});

JSONbranches.filter((branch)=>{
  console.log(branch.name);
  return branch.name === "master";
}).forEach((branch)=>{
  const commit = branchLookUp[branch.commit.sha];
  checkBranch(commit);
});

/**
 * Recurse through each commit's parents and pass on its branch name
 * @param  {[type]} name   [name property of branch]
 * @param  {[type]} sha [sha property of branch]
 * @return {[type]}        [description]
 */
function checkBranch({name,commit:{sha}}){
  const commit = SHALookup[sha];
  const checkBranchName = (commitObj)=>{
    if(commitObj===undefined){
      return;
    }
    commitObj.branch = name;

    commitObj.parents.forEach((parent)=>{
      checkBranchName(SHALookup[parent.sha]);
    })
  }
  checkBranchName(commit);
}

// const checkOrphan = (commitObj)=>{
//   if(commitObj===undefined){
//     return;
//   }
//   if(commitObj.children > 1){
//     return;
//   }
//   console.log(commitObj.children,"??????");
//   commitObj.branch = SHALookup[commitObj.children[0]].branch;
//   checkOrphan(SHALookup[commitObj.parents[0].sha]);
// }

// const makeOrphan = (commitObj)=>{
//
//   let branchName = commitObj.branch + commitObj.sha.slice(0,3);
//
//
//   commitObj.branch = branchName;
//
//   checkOrphan(SHALookup[commitObj.parents[0].sha]);
//
//
// }
//
// const checkMerge = (commitObj) => {
//   //check if current branch is not equal to incoming branch or else break
//   if(commitObj===undefined){
//     return;
//   }
//   if(commitObj.parents===undefined){
//     return;
//   }
//   // console.log(commitObj.parents);
//   if(commitObj.parents[1]){
//     makeOrphan(SHALookup[commitObj.parents[1].sha]);
//   }
//   checkMerge(SHALookup[commitObj.parents[0].sha]);
//
// }

const filter2Parents = (JSONcommitObj)=>{
  return JSONcommitObj.parents.length > 1;
}

const getRightParent = (JSONcommitObj)=>{
  return SHALookup[JSONcommitObj.parents[1].sha];
}

const renameOrphanParent = (JSONcommitObj)=>{
  JSONcommitObj.branch += JSONcommitObj.sha.slice(0,5);

  const checkOrphan = (commitObj,branchName)=>{
    if(commitObj===undefined){
      return;
    }
    if(commitObj.children.length > 1){
      return;
    }
    commitObj.branch = branchName;
    if(commitObj.parents.length > 0){
      checkOrphan(SHALookup[commitObj.parents[0].sha],branchName);
    }
  }
  let leftParent = SHALookup[JSONcommitObj.parents[0].sha];
  checkOrphan(leftParent,JSONcommitObj.branch);
}

JSONcommits.filter(filter2Parents).map(getRightParent).map(renameOrphanParent);

JSONbranches.forEach((branch)=>{
  const commit = SHALookup[branch.commit.sha];

  // console.log(commit);
  // checkMerge(commit);
});



console.log("after-=============branches");
JSONcommits.forEach(function(commit) {
  console.log({ sha: commit.sha.slice(0,5), branch:commit.branch});

})
