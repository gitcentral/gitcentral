/* eslint-disable */
const mocha = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;
const commits = require('./repoJSON.js');
const branches = require('./branchJSON.js');
const GithubAPI = require('../githubBranchFunction.js');

describe('Data', () => {
  // describe('Raw Branches Object', () => {
    it('should have a name', () => {
      branches.JSONbranches.forEach((branch) => {
        assert.isDefined(branch.name, 'branch has been defined');
        assert.isDefined(branch.commit.sha, 'branch sha has been defined');
      });
    });
  // });
// });

// describe('Commits', () => {
  // describe('Raw Commit Objects', () => {
    it('should not have children or branch properties', () => {
      commits.JSONcommits.forEach( (commit) => {
        assert.isUndefined(commit.branch, 'no branch defined');
        assert.isUndefined(commit.children, 'no children defined');
      });
    });

    it('should have a unique sha code', () => {
      commits.JSONcommits.forEach((commit) => {
        assert.isDefined(commit.sha, 'sha has been defined');
        assert.isDefined(commit.commit.message, 'message has been defined');
        assert.isDefined(commit.author, 'author has been defined');
        assert.isDefined(commit.parents, 'parents has been defined');
      });
    });

    // describe('Processed Commit Objects', () => {
      it('should have children', () => {
        let gitGraph = new GithubAPI(commits.JSONcommits, branches.JSONbranches);

        gitGraph.JSONCommits.forEach((commit) => {
          assert.isDefined(commit.children, 'children has been defined');
        });
      })

      it('should have a branch', () => {
        let gitGraph = new GithubAPI(commits.JSONcommits, branches.JSONbranches);

        gitGraph.JSONCommits.forEach((commit) => {
          assert.isDefined(commit.branch, 'branch has been defined');
        });
      })
    // });

    it("current commit's child's parent should be current commit" , () => {
      let gitGraph = new GithubAPI(commits.JSONcommits, branches.JSONbranches);

      gitGraph.JSONCommits.forEach((currentCommit) => {
        if (currentCommit.children){

          let childrenCommits = currentCommit.children.reduce( (result, sha) => {
            let childCommit = gitGraph.SHALookup[sha];
            if (childCommit) {
              result.push(childCommit);
            }
            return result;
          }, []);

          let parentsSha = childrenCommits.map( (childCommit) => {
            if (childCommit.parents){
              let parent_sha_list = childCommit.parents.map( (parent) => {
                return parent.sha;
              });
              assert(parent_sha_list.includes(currentCommit.sha), "bad...");
            }

          });
        }
      });

    });

    it("should be included in current commit's parent's children" , () => {
      let gitGraph = new GithubAPI(commits.JSONcommits, branches.JSONbranches);

      gitGraph.JSONCommits.forEach((currentCommit) => {
        if (currentCommit.children){
          currentCommit.children = [ "sha1", ]

          let childrenCommits = currentCommit.children.reduce( (result, sha) => {
            let childCommit = gitGraph.SHALookup[sha];
            if (childCommit) {
              result.push(childCommit);
            }
            return result;
          }, []);

          let parentsSha = childrenCommits.map( (childCommit) => {
            if (childCommit.parents){
              let parent_sha_list = childCommit.parents.map( (parent) => {
                parent.sha;
              })
              assert(parent_sha_list.include(currentCommit.sha), "bad...");
            }

          });
        }
      });

    });

  // });
});
