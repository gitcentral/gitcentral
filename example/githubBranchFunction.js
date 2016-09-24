let SHALookup = { "sha" : {}};
let branchLookUp = {};

JSONcommits.reduce(function initCommitsAndLookupTable(results, commit, index, collection) {
  results[commit.sha] = commit;
  commit.children = [];
  return results;
}, SHALookup);

JSONcommits.map(function insertChildren(commit, index, collection) {
  commit.parents.map(function (parentInfo) {
    var parentCommit = SHALookup[parentInfo.sha];
    if(parentCommit===undefined){
      return;
    }
    parentCommit.children.push(commit.sha);
  });
})

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

const filter2Parents = (JSONcommitObj)=>{
  return JSONcommitObj.parents.length > 1;
}

const getRightParent = (JSONcommitObj)=>{
  return SHALookup[JSONcommitObj.parents[1].sha];
}

const renameOrphanParent = (JSONcommitObj)=>{
  if (JSONcommitObj.children.length > 1) { return; }

  JSONcommitObj.branch += "[" + JSONcommitObj.sha.slice(0,5) + "]";

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

console.log("after-=============branches");
JSONcommits.forEach(function(commit) {
  console.log({ sha: commit.sha.slice(0,5), branch:commit.branch});
})

var cytoNodeCols = JSONcommits.reduce(setupMajorBranch, {});
var cytoNodes = JSONcommits.reverse().map(mapNode(cytoNodeCols));
var cytoEdges = JSONcommits.reduce(mapEdge, []);

function mapNode(cytoNodeCols) {

  const scale = 100;
  const columnPosition = reorder(cytoNodeCols, scale);

  return function(jsonCommit, index) {

    const branch = jsonCommit.branch;
    const msg0 = jsonCommit.commit.message.slice(0, 20);
    const sha5 = branch + ': ' + jsonCommit.sha.slice(0, 4);
    const sha1 = jsonCommit.sha;

    const x = (index  + 1) * scale;
    const y = -columnPosition[branch];

    const node = { data : { id : sha1, branch: branch, name : sha5, message: msg0 },
                   position : { x : x, y: y } };
    return node;
  }

  function reorder(lookup, scale) {

    const lookupTable = { master : 1 * scale };

    Object.keys(lookup).filter(selectSubBranch).map(assignColumn(lookupTable));
    Object.keys(lookup).filter(selectBigBranch).map(assignColumn(lookupTable));

    return lookupTable;

    // functions
    function selectBigBranch(branch) {
      return !selectSubBranch(branch);
    }

    function selectSubBranch(branch) {
      const openBracket = '[[]'
      const closeBracket = '[]]'
      return branch.match(openBracket);
    }

    function assignColumn(lookupTable) {
      return function(branch) {
        lookupTable[branch] = Object.keys(lookupTable).length * scale;
      }
    }
  }
}

function setupMajorBranch(lookup, jsonCommit) {

  const branch = jsonCommit.branch;
  const scale = 100;

  if (lookup[branch] === undefined) {
    lookup[branch] = (Object.keys(lookup).length + 1) * scale;
  }
  return lookup;
}


function mapEdge(edges, jsonCommit) {

  return jsonCommit.parents.reduce(function (parentEdges, parent) {
           const target = parent.sha;
           const source = jsonCommit.sha;
           const edge = { data : { id : [source, target].join('_'), source : source, target : target } };
           parentEdges.push(edge);
           return parentEdges;
         }, edges);

}