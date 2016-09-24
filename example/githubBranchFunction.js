/* eslint-disable */
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
  /**
   * Set up table to look up commit objects by sha
   * Initialize children array on each commit object
   */
  setupShaLookup() {
    this.JSONCommits.reduce((results, commit) => {
      results[commit.sha] = commit;
      commit.children = [];
      return results;
    }, this.SHALookup);
  }
  /**
   * Iterate through each commit to link children and parents
   */
  addChildren() {
    this.JSONCommits.forEach((commit) => {
      commit.parents.forEach((parentInfo) => {
        const parentCommit = this.SHALookup[parentInfo.sha];
        if (parentCommit !== undefined) {
          parentCommit.children.push(commit.sha);
        }
      });
    });
  }
  getParentShas(commit) {
    return commit.parents.map( parent => parent.sha);
  }
  /**
   * Set up table to look up branch objects by sha
   */
  setupBranchLookup() {
    this.JSONBranches.reduce((results, branch) => {
      const branchLookup = results;
      branchLookup[branch.commit.sha] = branch;
      return branchLookup;
    }, this.branchLookup);
  }
  /**
   * Iterate through each branch that is not master, and name branches
   */
  addBranchName() {
    this.JSONBranches.filter(branch => branch.name !== 'master')
                     .forEach((branch) => {
                       const commit = this.branchLookup[branch.commit.sha];
                       this.nameBranch(commit);
                     });

    this.JSONBranches.filter(branch => branch.name === 'master')
                     .forEach((branch) => {
                       const commit = this.branchLookup[branch.commit.sha];
                       this.nameBranch(commit);
                     });
  }
  /**
   * Assign branch property to each commit object
   * name: name of current branch
   * sha: sha of current commit
   */
  nameBranch({ name, commit: { sha } }) {

    const commit = this.SHALookup[sha];
    const checkBranchName = (commitObj) => {
      if (commitObj !== undefined) {
        commitObj.branch = name;
        commitObj.parents.forEach(parent => checkBranchName(this.SHALookup[parent.sha]));
      }
    }
    checkBranchName(commit);
  }
  /**
   * Return commit objects with more than one parent
   * [Filter function]
   */
  filter2Parents(JSONCommitObj) {
    return JSONCommitObj.parents.length > 1;
  }
  /**
   * Return the parent at index 1
   * [Map function]
   */
  getRightParent(JSONCommitObj) {
    return this.SHALookup[JSONCommitObj.parents[1].sha];
  }
  /**
   * Rename Orphan branches
   * [Map function]
   */
  renameOrphanParent(JSONCommitObj) {
    if (JSONCommitObj.children.length > 1) {
      return;
    }
    JSONCommitObj.branch += JSONCommitObj.sha.slice(0, 5);
    const checkOrphan = (commitObj, branchName) => {
      if (commitObj === undefined) {
        return;
      }
      if (commitObj.children.length > 1) {
        return;
      }
      commitObj.branch = branchName;
      if (commitObj.parents.length > 0) {
        checkOrphan(this.SHALookup[commitObj.parents[0].sha], branchName);
      }
    }
    const leftParent = this.SHALookup[JSONCommitObj.parents[0].sha];
    checkOrphan(leftParent, JSONCommitObj.branch);
  }
  /**
   * Alter JSONCommits object to have Orphan branch names
   */
  addOrphanBranch() {
    this.JSONCommits
        .filter(this.filter2Parents)
        .map(this.getRightParent.bind(this))
        .map(this.renameOrphanParent.bind(this));
  }
}
