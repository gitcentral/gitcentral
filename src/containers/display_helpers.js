/**
 * display_helpers.js
 *
 * Contains helper function used in repo_display.js
 */

import generateCoordinates from './coordinate_generator';

export default {
  generateCoordinates,

  /**
   * Create an HTML anchor tag
   * @param  {String} linkedText - the text you wish to appear
   * @param  {String} site - the site to link to
   * @return {String} - the anchor HTML element
   */
  makeAnchor: function (linkedText, site) {
    return `<a href="${site}" target="_blank">${linkedText}</a>`;
  },

  //https://bl.ocks.org/mbostock/6123708
  zoomed: function(svg) {
    const { translate, scale } = d3.event;
    svg.selectAll('g')
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
    svg.selectAll('line')
      .attr("transform", "translate(" + translate + ")scale(" + d3.event.scale + ")");

    //To make the tip essentially disappear from the page we remove its HTML.
    //It is still present on the page, but now consists of a tiny invisible square.
    d3.selectAll('.d3-tip')
      .style('opacity', 0)
      .html('');
  },

  //give each branch a different color property
  addColors: function(branches) {
    const colors = [
      '#FA8072',  //salmon
      "#7D3C98",  //purple
      "#2471A3",  //blue
      "#F1C40F",  //yellow
      '#E67E22',  //orange
      "#A93226",  //red
      "#17A589",  //aqua
      '#839192',  //grey
      '#000000',  //black
    ];

    let i = 0;
    for(let branch in branches) {
      branches[branch].color = colors[i++ % colors.length];
    }
  },

  //Create an object with some statistics for the 
  //commits and branches passed in
  analyzeRepo: function(commits, branchLookup) {
    function countCommitsPerAuthor(author) {
      return commits.reduce((authorCount, commit) => {
        if(commit.author.login === author) authorCount++;
        return authorCount;
      }, 0);
    }

    function countCommitsPerBranch(branch) {
      return commits.reduce((branchCount, commit) => {
        if(commit.branch === branch) branchCount++;
        return branchCount;
      }, 0);
    }

    const stats = {
      branches: {},
      contributors: {},
    };

    const { branches, contributors } = stats;

    for(let branch in branchLookup) {
      branches[branch] = branches[branch] || countCommitsPerBranch(branch);
    }

    commits.forEach((commit) => {
      const author = commit.author.login;
      contributors[author] = contributors[author] || countCommitsPerAuthor(author);
    });

    return stats;
  },

  //////////////////////////////////////////////////////////////////
  // NOT DRY. COPIED FROM ORIGINAL LINE RENDERING IN repo_display //
  //////////////////////////////////////////////////////////////////
  /**
   * Flip the x and y-values of each node to make the graph vertical.
   * Delete all lines, then re-render lines.
   */
  flipXY: function() {
    d3.selectAll('circle')
      .each(function(node) {
        const x = node.y;
        const y = node.x;
        d3.select(this)
          .attr('cx', x)
          .attr('cy', y);
      });

    d3.selectAll('.line')
      .remove();

    d3commits.forEach(commit => {
      commit.children.forEach(child => {
        let childObj = githubTranslator.getCommit(child);

        //this is where the magic happens. Just flip x and y.
        const curveData = [
          { x:commit.y, y:commit.x },
          { x:childObj.y,  y:childObj.x },
        ];

        const edge = d3.select("svg").append('g');
        const diagonal = d3.svg.diagonal()
          .source(function(d) {return {"x":d[0].y, "y":d[0].x}; })            
          .target(function(d) {return {"x":d[1].y, "y":d[1].x}; })
          .projection(function(d) { return [d.y, d.x]; });
           
        d3.select("g")
            .datum(curveData)
          .append("path")
            .attr("class", "line")
            .attr("d", diagonal)
            .attr("stroke-width", 1)
          .attr('stroke', branchLookup[commit.branch].color)
          .attr('fill', 'none');
      });
    });
  },

  //Confusing indentation due to the string interpolation:
  //-----------------------------------------------------------------------------
  //Show the tooltip with proper commit content.
  showToolTip: function(commit) {
    const { branch, sha, html_url: url, author: { login: authorName } } = commit;
    const repoName = url.match(/\/\/[\w\.]*\/[\w\.]*\/(\w*)\//);

    //the ternary operator below: if the branch name is not fake (e.g. master, dev, etc.)
    //then make it a hyperlink; otherwise, don't display branch name
    const branchLink = `https://github.com/${authorName}/${repoName[1]}/commits/${branch}`;

    const tooltipContent =
`${originalBranches.includes(branch) ? 'Branch: ' + makeAnchor(branch, branchLink) + '\n' : '' }SHA:     ${makeAnchor(sha.slice(0, 9) + '...', url)}
Author:  ${authorName}

Message: ${commit.commit.message}`;

    infoTip.html(`<pre>${tooltipContent}</pre>`);
    infoTip.show();
  },
  //-----------------------------------------------------------------------------
};
