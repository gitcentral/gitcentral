/**
   * Generate the x and y-coordinates for each commit. Place them as properties
   * on the commit.
   */
export default function generateCoordinates(sortedCommits, commitObj, allBranches) {
  /**
   * Given a range of start and end values, determine if there is any
   * overlap.
   * @param  {Object} range1 - the first range, an object with properties
   *                         start and end
   * @param  {Object} range2 - the 2nd range, same properties
   * @return {Boolean} - whether or not they overlap
   */
  function checkOverlap(range1, range2) {
    return (range2.start <= range1.start && range1.start <= range2.end) ||
      (range2.start <= range1.end && range1.end <= range2.end);
  }

  /**
   * Generate an x-value for each commit. Each commit sent in will
   * have a higher x-value than the one before it. Useful for placing
   * elements in order. If the next commit will flow off of the screen,
   * reset the x-value.
   */
  function generateX(node) {
    const nextValue = 40 + numCommits++ * 30;
    // if(nextValue + 60 > pageWidth) resetXandY();
    return nextValue;
  }

  function resetXandY() {
    numCommits = 1;
    firstCheckForY += 80;
  }

  /**
   * Determine if the y-position we're checking will have overlaps. If so,
   * put in a different place. Recursively checks the next y-value if the current
   * one is already taken.
   * @param  {String} branch - the branch name
   * @param  {Number} y - the y-value we're checking. Is set automatically,
   *                    or recursively.
   * @return {Number} - the y position.
   */
  function generateY(branchName, y = firstCheckForY) {
    //if we're at a new branch we need to jump to another level
    if(branchName !== lastBranch) {
      lastBranch = branchName;
      return generateY(branchName, y + yOffset);
    }

    let overlap = false;

    const { start: thisBranchStartPoint, end: thisBranchEndPoint } = branchXCoordinates[branchName];

    taken.forEach(set => {
      if(set.y === y) {
        if((set.start <= thisBranchStartPoint && thisBranchStartPoint <= set.end) ||
          (set.start <= thisBranchEndPoint && thisBranchEndPoint <= set.end)) {
          overlap = true;
        }
      }
    });

    return overlap ? generateY(branchName, y + yOffset) : y;
  }

  /**
   * branchXCoordinates will contain the start and end x-values for
   * each commit.
   * @type {Object}
   */
  const branchXCoordinates = {};

  /**
   * branchYCoordinates will the y-coordinate of each branch.
   * @type {Object}
   */
  const branchYCoordinates = { master: 360 };
  let firstCheckForY = 360;
  let numCommits = 0;
  const yOffset = 40;

  //Create the x-value for each commit.
  sortedCommits.forEach(commit => {
    commit.x = generateX(commit);

    //if it's the first time we're processing a commit from this branch, create an object
    if(!branchXCoordinates[commit.branch]) {
      branchXCoordinates[commit.branch] = { start: commit.x };
    }

    branchXCoordinates[commit.branch].end = commit.x;
  });


  /**
   * List the positions that are taken. Properties of each object are
   * a y-value and the range (start and end) of the x-values taken for that
   * y-value. Initialize with a hard-coded master.
   * @type {Array}
   */
  const taken = [{
    y: 360,
    start: branchXCoordinates['master'].start,
    end: branchXCoordinates['master'].end,
  }];

  /**
   * A variable to store the last branch location. Every commit, when being
   * placed, will be compared to the last commit to see if the branch was
   * different. If it was different, the new branch will be placed lower.
   */
  let lastBranch;

  //get the y-coordinates for each branch
  Object.keys(allBranches).forEach(branch => {
    if(!branchXCoordinates[branch] || branch === 'master') return;

    const { start, end } = branchXCoordinates[branch];
    const yCoordinate = generateY(branch);
    lastBranch = branch;
    branchYCoordinates[branch] = yCoordinate;
    taken.push({ start, end, y: yCoordinate });
  });

  // if there are 2 branches connected and on the same line, move one
  let changed = false;
  do{
    changed = false;
    sortedCommits.forEach(commit => {
      commit.children.forEach(child => {
        const childObj = commitObj[child];
        if(childObj && commit.branch !== childObj.branch) {
          if(branchYCoordinates[commit.branch] === branchYCoordinates[childObj.branch]) {
            branchYCoordinates[childObj.branch] += yOffset;
            changed = true;
          }
        }
      });
    });
  } while(changed);

  //If there are 2 branches overlapping, move one
  const branchNames = Object.keys(branchXCoordinates);
  let altered = false;
  do{
    altered = false;
    branchNames.forEach(thisBranch => {
      const thisBranchSet = branchXCoordinates[thisBranch];
      branchNames.forEach(branchToCheck => {
        //make sure it's not the same branch
        if(thisBranch !== branchToCheck){
          //make sure they have the same y-coordinate
          if(branchYCoordinates[thisBranch] === branchYCoordinates[branchToCheck]){
            const branchToCheckSet = branchXCoordinates[branchToCheck];

            //Make sure they overlap somewhere along their x-coordinates
            if(thisBranch !== branchToCheck && checkOverlap(thisBranchSet, branchToCheckSet)) {
              branchYCoordinates[branchToCheck] += yOffset;
              altered = true;
            }
          }
        }
      });
    });
  } while(altered);

  //map the branchYCoordinates values over to their commits
  sortedCommits.forEach(commit => commit.y = branchYCoordinates[commit.branch]);
}