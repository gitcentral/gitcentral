const express = require('express');
const request = require('request-promise');
const router = express.Router();

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
  let userAgent = 'help';
  let secrets = "client_id=423335fdf206466ccd3b&client_secret=bc10a999efc0335d06b6d84d470b76eda5a97b30";
  let branches = [];

  console.log(1);
  const branchOpt = { uri : `${branchesURL}?${secrets}`, headers : { 'User-Agent' : userAgent } };
  request(branchOpt)
  .then(function (branches) {
    console.log(11);
    branches = JSON.parse(branches);
    var requestBranchCommits = branches.reduce(makeRequestBranchCommits, []);
    var requestAllCommits = { accum : [], lookup : {} };
    console.log(111);
    Promise.all(requestBranchCommits).then(allCommits => {
      console.log(1111);
      const allFlattenCommits = allCommits.reduce( (r, c) => r.concat(JSON.parse(c)), []);
      allFlattenCommits.map((branchCommits) => {
        console.log(111111111);
        let branchCommitArray = JSON.parse(branchCommits);
        // Filter duplicates
        branchCommitArray.sort((lhs, rhs) => {
          return Date.parse(lhs.committer.date) - Date.parse(rhs.committer.date);
        });
        
        const { accum : uniqCommitArray } = branchCommitArray.reduce((container, branchCommit)=>{
          if (container.lookup[branchCommit.sha] === undefined) {
            container.lookup[branchCommit.sha] = true;
            container.accum.push(branchCommit);
           }
           return container;
         }, requestAllCommits);
      });

      res.status(200).end('youooo');
      // res.status(200).json("hey");
    }, (reason) => {
      // console.log(7777, reason);
      res.status(401).end('noooooo');
    });
    
    // functions
    function makeRequestBranchCommits(results, branch, index) {
      const commitsOpt = { uri : `${commitsURL}?sha=${branch.commit.sha}&${secrets}`,
                           headers : { 'User-Agent' : userAgent } };
      const branchPromise = request(commitsOpt);
      results.push(branchPromise);
      return results;
    }
    
    
  })

});


module.exports = router;

