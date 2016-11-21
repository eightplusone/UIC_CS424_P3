$(document).ready(function(){

  // Canvas
  let svg_left = d3.select("body").select("div.textViz").append("svg")
    .attr("width","100%")
    .attr("height","100%");

  let categories = 0;
   
  // Load data
  d3.json("./data/abstracts.json", function(err0, abstracts) {
    if (err0) throw err0;
    d3.json("./data/labelleddata.json", function(err1, label) {
      if (err1) throw err1;
      d3.json("./data/edge1.json", function(err2, edge){
        if(err2) throw err2;
        display_textviz(abstracts.content, label, edge, categories);
      })
    })
  })

  // Display TextViz
  function display_textviz(content, label, edge, categories) {
    let doc = svg_left.append("p").text(content)
      .style("font-size", "14px")
      .style("font-color", "#000000");

  }

});