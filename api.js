/* eslint-disable */
const express = require('express');
const request = require('request-promise');
const router = express.Router();

// module.exports = router;

router.param('userName', function(req, res, next, userLabel) {
  req.user = userLabel;
  next();
});

router.param('repoName', function(req, res, next, repoLabel) {
  req.repo = repoLabel;
  next();
});

router.param('endpoint', function(req, res, next, endpointLabel) {
  req.endpoint = endpointLabel;
  next();
});

router.route('/repos/:userName/:repoName')
.all(function(req, res, next) {
  // console.log(req.user, req.repo, req.endpoint);
  next();
})
.get(function(req, res) {

  let gitURL = `https://api.github.com/repos/${req.user}/${req.repo}`;
  let branchesURL = `${gitURL}/branches`;
  let commitsURL = `${gitURL}/commits`;
  let userAgent = 'cadeban';
  let secrets = "client_id=423335fdf206466ccd3b&client_secret=bc10a999efc0335d06b6d84d470b76eda5a97b30";
  let branches = [];
  var count = 0;

  // requesting branch list of a repo
  const branchOpt = { uri : `${branchesURL}?${secrets}`, headers : { 'User-Agent' : userAgent } };
  request(branchOpt)
  .then(function (branches) {
    branches = JSON.parse(branches);

    // requesting all the commits of each branch
    //let requestBranchCommits = branches.reduce(makeRequestBranchCommits, []);
    //
    ////branches is an array of branches
    ///loop through each branch and run recursion func on the first commit sha thing
    let requestBranchCommits =  [];
    branches.forEach((branch)=>{
      requestBranchCommits.push(makeRequestBranchCommits(branch.commit.sha,[]));
    });
    console.log(requestBranchCommits,"requestBranchCommits");
    //
    Promise.all(requestBranchCommits).then(allCommits => {
      // allCommits = ...allCommits;
      console.log(allCommits.length,"ALL COMMITS");
      let requestAllCommits = { commits : [], lookup : {} };
      let allFlattenCommits = [].concat(...allCommits);
      // let allFlattenCommits = allCommits.reduce( (r, c) => {
      //   console.log(JSON.parse(c).sha, 'length:', JSON.parse(c).length);
      //   return r.concat(JSON.parse(c))
      // }, []);

      // sorts the branch's commits
      allFlattenCommits.sort((lhs, rhs) => {
        // console.log(lhs,rhs);
        // console.log(Date.parse(lsh,committer.date), Date.parse(rhs.committer.date));
        return Date.parse(lhs.commit.committer.date) - Date.parse(rhs.commit.committer.date);
      });

      // console.log(allFlattenCommits[0]);
      // filters duplicates out of the branch's commits
      allFlattenCommits.reduce((container, branchCommit) => {
        if (container.lookup[branchCommit.sha] === undefined) {
          container.lookup[branchCommit.sha] = true;
          container.commits.push(branchCommit);
        }
        return container;
      }, requestAllCommits);



      console.log('unique length', requestAllCommits.commits.length);
      console.log(requestAllCommits.commits[requestAllCommits.commits.length-2],"flattened?");

      res.status(200).json([branches, requestAllCommits.commits]);

    }, (reason) => {
      res.status(401).end('noooooo');
    });

    // functions
    function makeRequestBranchCommits(lastSha) {

      return new Promise(function(resolve, reject){

        function getNextCommits(lastSha, commitArr = []){
          let commitsOpt = { uri : `${commitsURL}?sha=${lastSha}&per_page=100&${secrets}`,
          headers : { 'User-Agent' : userAgent } };

          request(commitsOpt).then((commits)=>{
            commitObjs = JSON.parse(commits);
            commitArr.push(...commitObjs);

            if(commitObjs.length < 100 || commitObjs[commitObjs.length-1].parents.length === 0){
              resolve(commitArr);
              return;
            }
            //maybe a race condition problem here...
            commitObjs[commitObjs.length-1].parents.forEach((parent)=>{
              getNextCommits(parent.sha, commitArr);
            })
          })
        };

        getNextCommits(lastSha, []);

      });


    }});

});

module.exports = router;
