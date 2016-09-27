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

  // requesting branch list of a repo
  const branchOpt = { uri : `${branchesURL}?${secrets}`, headers : { 'User-Agent' : userAgent } };
  request(branchOpt)
  .then(function (branches) {
    branches = JSON.parse(branches);

    // requesting all the commits of each branch
    var requestBranchCommits = branches.reduce(makeRequestBranchCommits, []);

    //
    Promise.all(requestBranchCommits).then(allCommits => {
      var requestAllCommits = { commits : [], lookup : {} };
      let allFlattenCommits = allCommits.reduce( (r, c) => {
        console.log(JSON.parse(c).sha, 'length:', JSON.parse(c).length);
        return r.concat(JSON.parse(c))
      }, []);

      // sorts the branch's commits
      allFlattenCommits.sort((lhs, rhs) => {
        return Date.parse(lhs.committer.date) - Date.parse(rhs.committer.date);
      });

      // filters duplicates out of the branch's commits
      allFlattenCommits.reduce((container, branchCommit) => {
        if (container.lookup[branchCommit.sha] === undefined) {
          container.lookup[branchCommit.sha] = true;
          container.commits.push(branchCommit);
        }
        return container;
      }, requestAllCommits);

      console.log('unique length', requestAllCommits.commits.length);

      res.status(200).json([branches, requestAllCommits.commits]);

    }, (reason) => {
      res.status(401).end('noooooo');
    });

    // functions
    function makeRequestBranchCommits(results = [], branch, index) {
      const commitsOpt = { uri : `${commitsURL}?sha=${branch.commit.sha}&per_page=100&${secrets}`,
                           headers : { 'User-Agent' : userAgent } };
      // don't we want to call .then on this request?
      const branchPromise = request(commitsOpt).then();
      // save last result's sha and pass it as arg in recursive api GET request
      // to continue pagination

      results.push(branchPromise);
      console.log(branch.name);
      return results;
    }});

});

module.exports = router;
