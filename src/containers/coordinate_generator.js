/**
 * coordinate_generator.js
 * 
 * This is the file that contains the logic for generating x and y-values
 * for each commit. The values will be placed on that commit as properties.
 */

/**
 * Given a range of start and end values, determine if there is any
 * overlap.
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
function generateX(node, commitNum) {
  return  40 + commitNum * 30;
}

/**
 * Determine if the y-position we're checking will have overlaps. If so,
 * put in a different place. Recursively checks the next y-value if the current
 * one is already taken.
 */
function generateY(branchXCoordinates, takenSpaces, y, yOffset) {
  let overlap = false;

  takenSpaces.forEach(set => {
    if(set.y === y) {
      overlap = checkOverlap(set, branchXCoordinates);
    }
  });

  //if there was an overlap present, recursively try the next y-value
  return overlap ? generateY(branchXCoordinates, takenSpaces, y + yOffset, yOffset) : y;
}

//Edit the y-coordinates for branches that are
//connected but on the same y-value. If there are 2 branches
//connected and on the same line, move one.
function shiftChildrenFromParents(commitsArr, commitsObj, yCoordinates) {
  let changed = false;
 
  commitsArr.forEach(commit => {
    commit.children.forEach(child => {
      const childObj = commitsObj[child];
      if(childObj && commit.branch !== childObj.branch) {
        if(yCoordinates[commit.branch] === yCoordinates[childObj.branch]) {
          yCoordinates[childObj.branch] += yOffset;
          changed = true;
        }
      }
    });
  });

  //repeat until there's nothing left to change
  if(changed) shiftChildFromParent(commits, yCoordinates);
}

/**
 * Given a set of branches and their x and y-coordinate values,
 * fix any overlaps. Recursively call until there are no overlaps. Meant
 * to fix any overlaps created by shiftChildrenFromParents.
 * @param  {Object} xCoordinates - the x-coordinates (start and end) for
 *                               each branch
 * @param  {Object} yCoordinates - the y-coordinate for each branch
 * @param  {Number} yOffset - tells us how far to shift an overlapping branch
 */
function fixOverlaps(xCoordinates, yCoordinates, yOffset) {
  const branchNames = Object.keys(xCoordinates);
  let altered = false;

  branchNames.forEach(thisBranch => {
    const thisBranchSet = xCoordinates[thisBranch];
    branchNames.forEach(branchToCheck => {
      //make sure it's not the same branch
      if(thisBranch !== branchToCheck){
        //make sure they have the same y-coordinate
        if(yCoordinates[thisBranch] === yCoordinates[branchToCheck]){
          const branchToCheckSet = xCoordinates[branchToCheck];

          //Make sure they overlap somewhere along their x-coordinates
          if(checkOverlap(thisBranchSet, branchToCheckSet)) {
            yCoordinates[branchToCheck] += yOffset;
            altered = true;
          }
        }
      }
    });
  });

  //repeat until there's nothing left to change
  if(altered) fixOverlaps(xCoordinates, yCoordinates, yOffset);
}

export default function generateCoordinates(sortedCommits, commitsObj, allBranches) {
  /**
   * branchXCoordinates will contain the start and end x-values for
   * each commit.
   * @type {Object}, format:
   *       { branchname1: { start: i, end: j }, branchname2: { start: m, end: n }, ...}
   */
  const branchXCoordinates = {};

  /**
   * branchYCoordinates will the y-coordinate of each branch.
   * @type {Object}, format: { branchname1: n, branchname2: m, ...}
   */
  const branchYCoordinates = { master: 360 };

  //the default y-value to start placing branches at
  const defaultY = 360;
  let numCommits = 0;
  const yOffset = 40;

  /**
   * A variable to store the last branch location. Every commit, when being
   * placed, will be compared to the last commit to see if the branch was
   * different. If it was different, the new branch will be placed lower.
   */
  let lastBranch;
    
  ///////////////////////////////////////////////////////////
  //Create the x-value for each commit. Simple and linear. //
  ///////////////////////////////////////////////////////////
  sortedCommits.forEach(commit => {
    commit.x = generateX(commit, numCommits++);

    //if it's the first time we're processing a commit from
    //this branch, create an object
    if(!branchXCoordinates[commit.branch]) {
      branchXCoordinates[commit.branch] = { start: commit.x };
    }

    branchXCoordinates[commit.branch].end = commit.x;
  });

  /**
   * Contains the positions that are taken. Properties of each object are
   * a y-value and the range (start and end) of the x-values taken for that
   * y-value. Initialize with a hard-coded master.
   */
  const taken = [{
    y: 360,
    start: branchXCoordinates['master'].start,
    end: branchXCoordinates['master'].end,
  }];

  ////////////////////////////////////////////////////////
  //Create the y-coordinates for each branch. Complex.  //
  ////////////////////////////////////////////////////////
  Object.keys(allBranches).forEach(branch => {
    if(!branchXCoordinates[branch] || branch === 'master') return;

    const xCoordinates = branchXCoordinates[branch];
    const { start, end } = xCoordinates;

    //If we're at a new branch, we want to move it down, so we start at
    //a different y-value
    const startYValue = defaultY + (branch === lastBranch ? 0 : 40);
    const yCoordinate = generateY(xCoordinates, taken, startYValue, yOffset);
    lastBranch = branch;
    branchYCoordinates[branch] = yCoordinate;
    taken.push({ start, end, y: yCoordinate });
  });

  //Move children away from their parents and move overlapping branches
  shiftChildrenFromParents(sortedCommits, commitsObj, branchYCoordinates);
  fixOverlaps(branchXCoordinates, branchYCoordinates, yOffset);

  //Using the y-values for the branches, set the y-values on the commits.
  sortedCommits.forEach(commit => commit.y = branchYCoordinates[commit.branch]);
};
