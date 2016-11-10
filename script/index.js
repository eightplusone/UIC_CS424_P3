$(document).ready(function(){
  /*
  // Load data
  // I'm having a weird Uncaught Error alert.
  d3.queue()
    .defer(d3.json("./data/abstracts.json"))
    .defer(d3.json("./data/annotations.json"))
    .await(anno);
  */

  let width = window.innerWidth,
      height = window.innerHeight;
    
  /* 
   * Responsive svg 
   */
  let svg = d3.select("body").select("div.main-wrapper").append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox","0 0 " + Math.min(width,height) + " " + Math.min(width,height))
    .attr("preserveAspectRatio","xMinYMin");

  d3.json("./data/abstracts.json", function(error1, abstracts) {
    if (error1) throw error1;
    d3.json("./data/annotations.json", function(error2, annotations) {
      if (error2) throw error2;
      abstracts.paragraph.forEach(function(para, i) {
        console.log(para);
        //console.log(JSON.stringify(paragraph));
        sentence = JSON.stringify(para).replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
        //sentence = JSON.stringify(paragraph).split(/[^\.!\?]+[\.!\?]+/g);
        console.log(i, sentence[1]);
      });
    });
  });
});