/* eslint-disable */
const mocha = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;
const commits = require('./repoJSON.js');
const branches = require('./branchJSON.js');
const GithubAPI = require('../githubBranchFunction.js');

describe('Data', () => {

    it('should have a name', () => {
      branches.JSONbranches.forEach((branch) => {
        assert.isDefined(branch.name, 'branch has been defined');
        assert.isDefined(branch.commit.sha, 'branch sha has been defined');
      });
    });

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

    describe("Invalid Data Handling", function() {
      var b1 = { name : "hello", commit : { sha : "234" } };
      var b2 = { name : "master", commit : { sha : "345" } };
      var b3 = { name : "test", commit : { sha : "456" } };


      var c1 = { sha : "123", parents : [ { sha : "parent???"} ], children : [ "234"] };
      var c2 = { sha : "234", parents : [ { sha : "123!!"} ], children : ["345"] };
      var c3 = { sha : "345", parents : [ { sha : "234#@#@R"} ], children : ["456"] };
      var c4 = { sha : "456", parents : [ { sha : "345^$#^$#"} ], children : ["nokidding???"] };

      var branches = [b1, b2, b3];
      var commits = [c1, c2, c3, c4];
      var githubAPI = new GithubAPI(commits, branches);
        
      it("first commit should not have a parent", function() {
        assert.notEqual(githubAPI.JSONCommits[0].parents.length, 0, "have no parents");
        // TBD : use assert.fail()
      });

      it("last commit should not have children", function() {
          assert.equal(githubAPI.JSONCommits.slice(-1).pop().children.length, 0, "have no children");
        // TBD : use assert.fail()
      });

      it("should find its commit object by its sha", function() {
          githubAPI.JSONCommits.forEach(function (commit) {
              let sha_list = githubAPI.getParentShas(commit);
              sha_list.forEach(function(parent) {
                  let parentCommit = githubAPI.SHALookup[parent.sha];
                  assert.equal(parentCommit, undefined, "there is no validate parents");
              }); 
        });

        // TBD : use assert.fail()
      });

    });
});
