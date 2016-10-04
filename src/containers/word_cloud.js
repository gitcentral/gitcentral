import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

class WordCloud extends Component {

  makeWordCloud() {
    $('#word-cloud').empty();
    const w = window.innerWidth;
    const h = window.innerHeight;


    // create single string consisting of all words in commit messages
    let words = this.props.currentRepo.JSONCommits.reduce((currentString, word) => currentString.concat(' ', word.commit.message), '');
    words = words.replace(/[!\.,:;\?]/g, '').split(' ')

    // count frequency of each word and create new arr of non duplicates
    const frequencyCount = {};
    const uniqueWords = [];
    words.forEach((word) => {
      if (frequencyCount[word] === undefined) {
        frequencyCount[word] = 0;
        uniqueWords.push(word);
      }
      frequencyCount[word]++;
    })
    words = uniqueWords.map((d) => {
      return { text: d, size: (frequencyCount[d]) + 30 };
    })
    // order in descending size order
    words = words.sort((a,b) => {
      if (a.size < b.size) {
        return 1;
      } else if (a.size > b.size) {
        return -1;
      }
      return 0;
    });

    // scale of colors for words
    const fill = d3.scale.category20();

    // Construct the word cloud's SVG element
    const svg = d3.select('#word-cloud').append('svg')
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', `translate(${[w >> 1, h >> 1]})`);


    // Draw the word cloud
    function draw(words) {
      const cloud = svg.selectAll('g text')
                      .data(words, d => d.text);

      //Entering words
      cloud.enter()
          .append('text')
          .style("font-family", 'Impact')
          .style("fill", function(d, i) { return fill(i); })
          .attr("text-anchor", "middle")
          .attr('font-size', 1)
          .text(d => d.text);

      //Entering and existing words
      cloud.transition()
           .duration(600)
           .style("font-size", function(d) { return d.size + "px"; })
           .attr("transform", function(d) {
              console.log(d.rotate,"d.rotate?")
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
           })
           .style("fill-opacity", 1);
    }

    d3.layout.cloud().size([w*.90, h*.70])
      .words(words)
      .rotate(function() { return ~~(Math.random() * 6 - 2.5) * 30; })
      .text(function(d) { return d.text; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();
  }

  render(){
    return(
      <div>
        {this.makeWordCloud()}
      </div>
    )
  }
}


function mapStateToProps(state) {
  return { currentRepo: state.currentRepo };
}

export default connect(mapStateToProps)(WordCloud);
