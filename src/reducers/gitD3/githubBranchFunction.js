/* eslint-disable */
export default class GithubApiInterface {
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
  }
  /**
   * Set up table to look up commit objects by sha
   * Initialize children array on each commit object
   */
  setupShaLookup() {
    this.JSONCommits.forEach(commit => this.SHALookup[commit.sha] = commit);
  }

  //Iterate through each commit to link children and parents
  addChildren() {
    this.JSONCommits.forEach(commit => commit.children = []);
    this.JSONCommits.forEach(commit => {
      commit.parents.forEach(parent => {
        const parentCommit = this.SHALookup[parent.sha];
        if (parentCommit !== undefined) {
            parentCommit.children.push(commit.sha);
        }
      });
    });
  }

  getCommit(sha){
    return this.SHALookup[sha];
  }

  setupBranchLookup(){
    this.JSONBranches.forEach(branch => this.branchLookup[branch.name] = branch);
  }

  getParentShas(commit) {
    return commit.parents.map(parent => parent.sha);
  }

  /**
   * Iterate through each branch that is not master, and name branches
   */
  addBranchName() {
    const sortedBranches = this.JSONBranches.map((branch) => {

      // here
      const length = this.visitParents(this.SHALookup[branch.commit.sha], () => 1);
      return { sha: branch.commit.sha, name: branch.name, length: length };
    }).sort((branchA, branchB) => {
      // -1 smaller, 0 equal, 1 bigger
      if (branchA.name === 'master') { return 1; }
      if (branchB.name === 'master') { return -1; }
      return branchA.length - branchB.length;
    });

    sortedBranches.forEach(branch => {
      this.nameBranch(this.branchLookup[branch.name]);
    });
  }

  visitParents(commit, cb){
    if (commit === undefined) return 0;
    let val = cb(commit);
    if (!commit.parents || !commit.parents.length) { return val; }
    val += this.visitParents(this.SHALookup[commit.parents[0].sha], cb);
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
      if (commitObj !== undefined){
        commitObj.branch = name;
        if (commitObj.parents.length < 1){
          return;
        }
        commitObj.parents.forEach(parent => checkBranchName(this.SHALookup[parent.sha]));
      }
      if (commitObj === undefined){
        return;
      }
    };

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
  urlParser(url, replacementSha){
    let splitUrl = url.split('/');
    splitUrl[splitUrl.length - 1] = replacementSha;
    return splitUrl.join('/');
  }

  renameOrphanParent(JSONCommitObj) {
    if (JSONCommitObj.children.length > 1) {
      return;
    }
    JSONCommitObj.branch += JSONCommitObj.sha.slice(0, 5);

    if (!this.branchLookup[JSONCommitObj.branch]){
      this.branchLookup[JSONCommitObj.branch] = {
        'name': JSONCommitObj.branch,
        'commit': {
          'sha': JSONCommitObj.sha,
          'url': this.urlParser(JSONCommitObj.commit.url, JSONCommitObj.sha),
        }
      }
    }

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
     this.JSONCommits.forEach(commit => this.analyzeCommit(commit));
   }

  /**
   * [addTailCommands] Adds possible git commands for most recent branch nodes
   * to git menu
   * [params] commit, list of commands
   * [return value] modified commit
   */
    addTailCommands(commit, ...commands) {
       commands.forEach(command => commit.gitCommands += ('\n ' + command));
      return commit;
    }

    // addLineBreak(message, tempMessage = ''){
    //   let line = [];
    //   message.split(' ').forEach((word, i) => {
    //     line.push(word);
    //     if (i % 5 === 0){
    //       tempMessage += `\n${line.join(' ')}`;
    //       line = [];
    //     }
    //   });
    //   return tempMessage;
    // }

}
