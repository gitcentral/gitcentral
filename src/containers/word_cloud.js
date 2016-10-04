import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GithubApiInterface from '../reducers/gitD3/githubBranchFunction';
import $ from 'jquery';

class WordCloud extends Component {

  makeWordCloud() {
    $('#word-cloud').empty();
    let words = this.props.currentRepo.JSONCommits.reduce((currentString,word)=>{
      return currentString.concat(" ",word.commit.message);
    },"")
    console.log(words);
    words = words.replace(/[!\.,:;\?]/g, '').split(' ')

    //count frequency of each word and create new arr of non duplicates
    var frequencyCount = {};
    var uniqueWords = [];
    words.forEach((word)=>{
      if(frequencyCount[word] === undefined){
        frequencyCount[word] = 0;
        uniqueWords.push(word);
      }
      frequencyCount[word]++;
    })
    words = uniqueWords.map(function(d) {
      return {text: d, size: (frequencyCount[d]) + 30};
    })
    //order in descending size order
    words = words.sort((a,b)=>{
      if(a.size < b.size){
        return 1;
      }else if (a.size > b.size){
        return -1;
      }else{
        return 0;
      }
    });

    // scale of colors for words
    var fill = d3.scale.category20();

    //Construct the word cloud's SVG element
    var svg = d3.select('#word-cloud').append("svg")
      .attr("width", 1000)
      .attr("height", 1000)
      .append("g")
      .attr("transform", "translate(500,500)");


    //Draw the word cloud
    function draw(words) {
      var cloud = svg.selectAll("g text")
                      .data(words, function(d) { return d.text; })

      //Entering words
      cloud.enter()
          .append("text")
          .style("font-family", "Impact")
          .style("fill", function(d, i) { return fill(i); })
          .attr("text-anchor", "middle")
          .attr('font-size', 1)
          .text(function(d) { return d.text; });

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

    d3.layout.cloud().size([1000, 1000])
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
