/* eslint-disable */
class GithubApiInterface {
  constructor(JSONCommits, JSONBranches) {
    this.JSONCommits = JSONCommits;
    this.JSONBranches = JSONBranches;
    this.SHALookup = {};
    this.branchLookup = {};
    this.branchLengths = {};

    // initialization
    this.setupShaLookup();
    this.setupBranchLookup();
    this.addChildren();
    this.addBranchName();
    // json obj transformation
    this.addOrphanBranch();
    this.addGitCommands();
  }
  /**
   * Set up table to look up commit objects by sha
   * Initialize children array on each commit object
   */
  getOrFakeShaToCommitLookup(sha) {
    let commit = this.SHALookup[sha];
    if (commit === undefined) {
      console.log("undefined commit", sha);
      commit = { sha : sha,
                 commit : { message : "hahaha" },
                 parents : [] };
      this.SHALookup[sha] = commit;
    }
    return commit;
  }
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
    const sortedBranches = this.JSONBranches.map((branch) => {
      const length = this.visitParents(this.getOrFakeShaToCommitLookup(branch.commit.sha), () => 1);
      return { sha: branch.sha, name : branch.name, length : length };
    }).sort((branchA, branchB) => {
      // -1 smaller, 0 equal, 1 bigger
      if (branchA.name === 'master') { return 1; }
      if (branchB.name === 'master') { return -1; }
      return branchA.length - branchB.length;
    });
    sortedBranches.forEach((branch) => {

      const commit = this.getOrFakeShaToCommitLookup(branch.sha); //here
      this.nameBranch(commit);
    });
  }

  visitParents(commit, cb){
    let val = cb(commit);
    if (commit.parents.length === 0) { return val; }
    val += this.visitParents(this.getOrFakeShaToCommitLookup(commit.parents[0].sha), cb); //here
    return val;
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

/**
 * Adds gitCommands property to commit and assigns universal git commands
 */
 addGitCommands(){
   this.JSONCommits.map((commit) => {
     return analyzeCommit(commit);
   });
 }

/**
 * Applies universal git commands and checks if commit is a tail
 */
  analyzeCommit(commit){
    const universalCommands = [];
    commit.gitCommands = universalCommands.slice(0);
    if (!commit.children.length){
      addTailCommands(commit);
    }
    return commit;
  }

/**
 * Add tails node commands
 */
  addTailCommands(commit) {
    const tailNodeCommands = [
      `git reset HEAD(~[n]), [n] = number of commits to reset
       options:
       --hard: obliterate last n commits (can't be undone)
       --soft: remove last n commits but leave working
               directory unchanged`,
      'git merge',
      'git rebase',
      'git pull',
    ];

    commit.gitCommands = commit.gitCommands.concat(tailNodeCommands);
    return commit;
  }

  makeConfig (commit) {
    return {
      dotColor: branch.color,
      // ${timestamp()} <-- replace w/ library
      gitCommands:
      `Possible git commands:
      git checkout [branch name]
      options:
      -b: create and check out new branch
      git branch [branch name]
      options:
      -d: delete branch
      -D: delete branch, suppress warnings
      git tag [tag name]`,
    };
  }

}

//module.exports = GithubApiInterface;
