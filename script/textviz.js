$(document).ready(function(){

  // Canvas
  let svg_left = d3.select("body").select("div.textViz").append("svg")
      .attr("width", "200%")
      .attr("height", "200%")
      .attr("id", "svg_left");

  let word_distance = 7;
  let line_height = "2em";
  let font_size = "1em";
  let container_width = $(".textViz").width() - word_distance*2;
  let categories = 0;
  console.log(container_width);
   
  // Load data
  d3.json("./data/abstracts.json", function(err0, abstracts) {
    if (err0) throw err0;
    d3.json("./data/labelleddata.json", function(err1, labels) {
      if (err1) throw err1;
      d3.json("./data/edge1.json", function(err2, edges){
        if(err2) throw err2;
        display_textviz(abstracts.content, labels, edges, categories);
      })
    })
  })

  // Display TextViz
  function display_textviz(content, labels, edges, categories) {

    //console.log(doc.node().getComputedTextLength());
    //console.log(doc.node().getBBox().width);

    let doc = svg_left.append("text")
        .attr("x", 0)
        .attr("y", line_height)
        ;

    labels.forEach(function(paragraph, i) {
      paragraph.forEach(function(sentence, i) {
        let line_width = 0;

        sentence.forEach(function(w, i) {
          // Append this word a tspan and measure its width.
          let temp_tspan = svg_left.append("text")
              .text(w.word)
              .style("font-size", font_size)
              ;
          let w_width = Math.round( temp_tspan.node().getComputedTextLength() );
          console.log(w.word, w_width, line_width);

          // Measure the current width of the paragraph.
          //let curr_width = 
          //  Math.round( doc.node().getComputedTextLength() ) % container_width;

          //console.log(w.word, w_width, curr_width + word_distance + w_width);
          
          // If adding this word to the paragraph exceeds the container's 
          // width, move the word to the next line.
          if (line_width + word_distance*2 + w_width < container_width) {
            doc.append("tspan")
              .attr("dx", word_distance)
              .text(w.word)
              .style("font-size", font_size)
              ;
            line_width = line_width + word_distance + w_width;
          } else {
            doc.append("tspan")
              .attr("x", word_distance)
              .attr("dy", line_height)
              .text(w.word)
              .style("font-size", font_size)
              ;
            line_width = word_distance + w_width;
          }

          
          temp_tspan.remove();
          
        })
      })
    })
  }
});