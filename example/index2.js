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
      console.log(456, data[0], data[1]);
      const tx = new GithubApiInterface(data[1], data[0]);
      console.log(789, tx.JSONBranches, tx.JSONCommits);
      const rx = new CytoGraph(tx.JSONBranches, tx.JSONCommits);
      rx.addGraph('cy');
    });
  }

  class CytoGraph {

    constructor(JSONbranches, JSONcommits) {
      // console.log(JSONbranches, JSONcommits);
      this.JSONbranches = JSONbranches;
      this.JSONcommits = JSONcommits;

      this.cytoCols = this.JSONbranches.reduce(this.setupMajorBranch, {});
      this.cytoNodes = this.JSONcommits.reverse().map(this.mapNode(this.cytoCols));
      this.cytoEdges = this.JSONcommits.reduce(this.mapEdge, []);
      console.log("cols ", this.cytoCols);
      console.log("nodes", this.cytoNodes);
      console.log("edges", this.cytoEdges);
    }

    mapNode(cytoCols) {

      const scale = 100;
      const columnPosition = reorder(cytoCols, scale);
      let printed = false;
      return function(jsonCommit, index) {
        if ((!printed) && (jsonCommit.commit.message === undefined)) {
          printed = true;
          // console.log(777, jsonCommit);
        }
        const sha1 = jsonCommit.sha;
        const branch = jsonCommit.branch;
        const msg0 = jsonCommit.commit.message.slice(0, 10);
        const sha5 = branch;// + ': ' + sha1.slice(0, 5);


        const x = (index  + 1) * scale;
        const y = -columnPosition[branch];

        const node = { data : { id : sha1, branch: branch, name : sha5, message: msg0 },
                       position : { x : x, y: y } };
        return node;
      }

      function reorder(lookup, scale) {

        const lookupTable = { master : 1 * scale };

        Object.keys(lookup).filter(selectSubBranch).map(assignColumn(lookupTable));
        Object.keys(lookup).filter(selectBigBranch).map(assignColumn(lookupTable));

        return lookupTable;

        // functions
        function selectBigBranch(branch) {
          return !selectSubBranch(branch);
        }

        function selectSubBranch(branch) {
          const openBracket = '[[]'
          const closeBracket = '[]]'
          return branch.match(openBracket);
        }

        function assignColumn(lookupTable) {
          return function(branch) {
            lookupTable[branch] = Object.keys(lookupTable).length * scale;
          }
        }
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
               const target = parent.sha;
               const source = jsonCommit.sha;
               const edge = { data : { id : [source, target].join('_'), source : source, target : target } };
               parentEdges.push(edge);
               return parentEdges;
             }, edges);

    }

    addGraph(elementId) {
      const cy_id = document.getElementById(elementId);
      const elements = this.cytoNodes.concat(this.cytoEdges);
      const layout =  { name: 'preset' };
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
        console.log( evt.data.foo, node.id(), node.position() );
      }
    }
  }


});
