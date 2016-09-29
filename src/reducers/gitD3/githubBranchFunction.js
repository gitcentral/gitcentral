/* eslint-disable */
export default class GithubApiInterface {
  constructor(JSONCommits, JSONBranches) {
    this.JSONCommits = JSONCommits;
    this.JSONBranches = JSONBranches;
    this.SHALookup = {};
    this.branchLookup = {};
    this.branchLookupByName = {};
    this.branchLengths = {};

    // initialization
    this.setupShaLookup();
    this.setupBranchLookupByName();
    this.setupBranchLookup();
    this.addChildren();
    this.addBranchName();
    // json obj transformation
    this.addOrphanBranch();
    this.addGitCommands();
    this.formatMessages();
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

  getCommit(sha){
    return this.SHALookup[sha];
  }
  /**
   * Setup Branch Lookup
   */
  //  filteredBranches (branchArray) {
  //    branchArray.filter((branch) => {
  //      let exists = false;
  //      commits.forEach((commit) => {
  //        if (commit.sha === branch.commit.sha){
  //          exists = true;
  //        }
  //      })
  //    });
  //    return exists;
  //  }

   setupBranchLookupByName(){
     this.JSONBranches.forEach((branch) => this.branchLookupByName[branch.name] = branch);
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

      // here
      const length = this.visitParents(this.SHALookup[branch.commit.sha], () => 1);
      return { sha: branch.commit.sha, name: branch.name, length: length };
    }).sort((branchA, branchB) => {
      // -1 smaller, 0 equal, 1 bigger
      if (branchA.name === 'master') { return 1; }
      if (branchB.name === 'master') { return -1; }
      return branchA.length - branchB.length;
    });
    sortedBranches.forEach((branch) => {
      const commit = this.branchLookup[branch.sha]; // HERE
      this.nameBranch(commit);
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

    if (!this.branchLookupByName[JSONCommitObj.branch]){
      this.branchLookupByName[JSONCommitObj.branch] = {
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
     this.JSONCommits.map((commit) => {
       return this.analyzeCommit(commit);
     });
   }

  /**
   * [AnalyzeCommit] Applies universal git commands and checks if commit is a tail
   * [params] commit object
   * [return value] modified commit
   */
    analyzeCommit(commit){
      const universalCommands = `Possible git commands:
      git checkout [branch name]
      options:
      -b: create and check out new branch
      git branch [branch name]
      options:
      -d: delete branch
      -D: delete branch, suppress warnings
      git tag [tag name]`;

      const tailCommands = [
        `git reset HEAD(~[n]), [n] = number of commits to reset
         options:
         --hard: obliterate last n commits (can't be undone)
         --soft: remove last n commits but leave working
                 directory unchanged`,
        'git merge',
        'git rebase',
        'git pull',
      ];

      commit.gitCommands = universalCommands;

      if (!commit.children.length){
        this.addTailCommands(commit, tailCommands);
      }
      return commit;
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

    /**
     * [formatMessages]Formats messages
     */
    formatMessages(){
      return this.JSONCommits.map((commitObj) => {
        commitObj.commit.message = this.addLineBreak(commitObj.commit.message);
        return commitObj;
      });
    }

    addLineBreak(message, tempMessage = ''){
      let line = [];
      message.split(' ').forEach((word, i) => {
        line.push(word);
        if (i % 5 === 0){
          tempMessage += `\n${line.join(' ')}`;
          line = [];
        }
      });
      return tempMessage;
    }

}
