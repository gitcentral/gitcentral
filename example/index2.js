$(function() {

  const branches = "https://api.github.com/repos/mangonada/mangonada/branches";
  const commits = "https://api.github.com/repos/mangonada/mangonada/commits";

  makeGraph();

  function makeGraph() {
    var cy_id = document.getElementById('cy');
    var elements = cytoNodes.concat(cytoEdges);

    console.log(elements);
    var data = {
      container: cy_id,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(name)'
          }
        }
      ],
      layout: {
        name: 'preset'
      }
    };
    
    var cy = cytoscape(data);

    cy.on('tapstart', 'node', { foo: 'start' }, showEvent);
    cy.on('tapend', 'node', { foo: 'end' }, showEvent);
    // cy.on('tapdrag', 'node', { foo: 'drag' }, showEvent);
    cy.on('taphold', 'node', { foo: 'hold' }, showEvent);
    cy.on('tapdragout', 'node', { foo: 'dragout' }, showEvent);
    cy.on('tapdragover', 'node', { foo : 'dragover'}, showEvent);

    cy.on('drag', 'node', { foo : 'drag'}, showEvent);

    function showEvent(evt){
      var node = evt.cyTarget;
      console.log( evt.data.foo, node.id(), node.position() );
    }
  }
});
