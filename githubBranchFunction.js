
class GithubApiInterface {
  constructor(JSONCommits, JSONBranches) {
      this.JSONCommits = JSONCommits;
      this.JSONBranches = JSONBranches;
      this.SHALookup = {};
      this.branchLookup = {};

      // initialization
      this.setupShaLookup();
      this.setupBranchLookup();
      this.addChildren();
      this.addBranchName();
      // json obj transformation
      this.addOrphanBranch();
  }

  setupShaLookup() {
    this.JSONCommits.reduce(function initCommitsAndLookupTable(results, commit, index, collection) {
      results[commit.sha] = commit;
      commit.children = [];
      return results;
    }, this.SHALookup);
  }

  addChildren() {
    var self = this;
    this.JSONCommits.map(function insertChildren(commit, index, collection) {
      commit.parents.map(function (parentInfo) {
        var parentCommit = self.SHALookup[parentInfo.sha];
        if(parentCommit===undefined){
          return;
        }
        parentCommit.children.push(commit.sha);
      });
    });
  }

  setupBranchLookup() {
    this.JSONBranches.reduce(function makeBranchesHash(results, branch, index, collection) {
      results[branch.commit.sha] = branch;
      return results;
    }, this.branchLookup);
  }

  addBranchName() {
    this.JSONBranches.filter((branch)=>{
      return branch.name !== "master";
    }).forEach((branch)=>{
      const commit = this.branchLookup[branch.commit.sha];
      this.checkBranch(commit);
    });

    this.JSONBranches.filter((branch)=>{
      console.log(branch.name);
      return branch.name === "master";
    }).forEach((branch)=>{
      const commit = this.branchLookup[branch.commit.sha];
      this.checkBranch(commit);
    });
  }

  checkBranch({name,commit:{sha}}){
    const commit = this.SHALookup[sha];
    const checkBranchName = (commitObj)=>{
      if(commitObj===undefined){
        return;
      }
      commitObj.branch = name;

      commitObj.parents.forEach((parent)=>{
        checkBranchName(this.SHALookup[parent.sha]);
      })
    }
    checkBranchName(commit);
  }

  filter2Parents(JSONcommitObj) {
    return JSONcommitObj.parents.length > 1;
  }

  getRightParent(JSONcommitObj){
    return this.SHALookup[JSONcommitObj.parents[1].sha];
  }

  renameOrphanParent(JSONcommitObj){
    JSONcommitObj.branch += JSONcommitObj.sha.slice(0,5);

    const checkOrphan = (commitObj,branchName)=>{
      if(commitObj===undefined){
        return;
      }
      if (commitObj.children.length > 1){
        return;
      }
      commitObj.branch = branchName;
      if(commitObj.parents.length > 0){
        checkOrphan(this.SHALookup[commitObj.parents[0].sha],branchName);
      }
    }
    let leftParent = this.SHALookup[JSONcommitObj.parents[0].sha];
    checkOrphan(leftParent,JSONcommitObj.branch);
  }

  addOrphanBranch() {
    this.JSONCommits
      .filter(this.filter2Parents.bind(this))
      .map(this.getRightParent.bind(this))
      .map(this.renameOrphanParent.bind(this));

  }
}
