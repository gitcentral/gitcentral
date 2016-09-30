/* eslint-disable */
$(function() {

  getGithubApiJSON(); // on ready, call it once

  $('form').on('submit', function(e){
    e.preventDefault();

    let url = $('#url-input').val();
    url = url.split('/').reverse();
    [repo, user, ...rest] = url;

    getGithubApiJSON(user, repo);

  });

  function getGithubApiJSON(user, repo) {
    if ((user === undefined) || (repo === undefined)) {
      let url = $('#url-input').val();
      url = url.split('/').reverse();
      [repo, user, ...rest] = url;
    }
    const uri = `/api/repos/${user}/${repo}`;
    // console.log(123, user, repo, uri);
    $.get(uri, function (data) {
      // console.log(456, data.JSONBranches, data.JSONCommits);
      const tx = new GithubApiInterface(data.JSONCommits, data.JSONBranches);
      // console.log(789, tx.JSONBranches, tx.JSONCommits);
      const rx = new CytoGraph(tx.JSONBranches, tx.JSONCommits);
      rx.addGraph('cy');
    });
  }

  class CytoGraph {

    constructor(JSONbranches, JSONcommits) {
      // console.log(JSONbranches, JSONcommits);
      this.JSONbranches = JSONbranches;
      this.JSONcommits = JSONcommits;

      // console.log("json commits", this.JSONcommits);
      this.cytoBranches = this.JSONbranches.reduce(this.setupMajorBranch, {});
      this.JSONcommits.map(this.addSubBranchLookup(this.cytoBranches));
      this.cytoNodes = this.JSONcommits.reverse().map(this.mapNode(this.cytoBranches));
      this.cytoEdges = this.JSONcommits.reduce(this.mapEdge, []); // <--
      console.log("branches ", this.cytoBranches);
      console.log("nodes", this.cytoNodes);
      console.log("edges", this.cytoEdges);
    }

    addSubBranchLookup(branchLookup) {
      const scale = 100;
      return function(commit) {
        if (branchLookup[commit.branch] === undefined) {
          branchLookup[commit.branch] = Object.keys(branchLookup).length * scale;
        }
      };
    }
    mapNode(cytoBranches) {

      const scale = 100;
      // const columnPosition = reorder(cytoBranches, scale);
      const columnPosition = cytoBranches;
      return function(jsonCommit, index) {
        const sha1 = jsonCommit.sha;
        const branch = jsonCommit.branch;
        const msg0 = jsonCommit.commit.message.slice(0, 10);
        const sha5 = branch + "/" +sha1.slice(0, 5);


        const x = (index  + 1) * scale;
        const y = columnPosition[branch];

        const node = { data : { id : sha1, branch: branch, name : sha5, message: msg0 },
                       position : { x : -x, y: -y } };
        // console.log(node, columnPosition, jsonCommit);
        // good node: 807ba7177e64eec020d41a0b59cd11224af8f4fe
        // bad node: a56e73eb92e51b89302a3c802313722831ffcc28
        return node;
      }

      function reorder(lookup, scale) {
        // update to render longest row last **need to generate which is the longest <- FINISH

        // guarantee master is in first row
        const lookupTable = { master : 1 * scale };

        Object.keys(lookup).filter(selectBigBranch).map(assignRow(lookupTable));
        Object.keys(lookup).filter(selectSubBranch).map(assignRow(lookupTable));

        return lookupTable;

        // functions
        function selectBigBranch(branch) {
          return !selectSubBranch(branch);
        }

        function selectSubBranch(branch) {
          const openBracket = '[[]'; // <- subbranch
          const closeBracket = '[]]';
          return branch.match(openBracket);
        }

        function assignRow(lookupTable) {
          return function(branch) {
            lookupTable[branch] = Object.keys(lookupTable).length * scale;
          }
        }

        // need function to color branches

      }
    }

    setupMajorBranch(lookup, jsonBranch) {
      // console.log(999, jsonBranch);

      const branch = jsonBranch.name;
      const scale = 100;


      if ((branch) && (lookup[branch] === undefined)) {
        const location = (Object.keys(lookup).length + 1) * scale;
        lookup[branch] = location;
        // console.log(888, branch, location);
      }
      return lookup;
    }


    mapEdge(edges, jsonCommit) {
      return jsonCommit.parents.reduce(function (parentEdges, parent) {
               const source = parent.sha;
               const target = jsonCommit.sha;
               // console.log("source", source, "target", target);
               const edge = { data : { id : [source, target].join('_'), source : source, target : target } };
               parentEdges.push(edge);
               return parentEdges;
             }, edges);

    }

    addGraph(elementId) {
      const cy_id = document.getElementById(elementId);
      const elements = this.cytoNodes.concat(this.cytoEdges);
      const layout =  { name: 'preset' };
      const nodeStyles = {
        "master" : { selector : "master" , 'background-color' : '#999' },
        "hey" : { selector : "hey", 'background-color' : '#7F7' },
        "hello" : { selector : "hello", 'background-color' : '#111' },
        "onelinechange" : { selector : "onelinechange", 'background-color' : '#f0f' }
      };
      const styles = [ {
        selector: 'node',
        style: {
          'background-color': '#666',
          'label': 'data(name)'
        }
      } ];

      const data = {
        container: cy_id,
        elements: elements,
        style: styles,
        layout: layout
      };

      const cy = cytoscape(data);

      cy.on('tapstart', 'node', { foo: 'start' }, showEvent);
      cy.on('tapend', 'node', { foo: 'end' }, showEvent);
      // cy.on('tapdrag', 'node', { foo: 'drag' }, showEvent);
      cy.on('taphold', 'node', { foo: 'hold' }, showEvent);
      cy.on('tapdragout', 'node', { foo: 'dragout' }, showEvent);
      cy.on('tapdragover', 'node', { foo : 'dragover'}, showEvent);

      cy.on('drag', 'node', { foo : 'drag'}, showEvent);

      function showEvent(evt){
        const node = evt.cyTarget;
        console.log("showEvent", evt.data.foo, node.id(), node.position() );
      }

    }
  }


});
