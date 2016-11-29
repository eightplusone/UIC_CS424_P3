$(document).ready(function(){

  // Canvas
  let svg_left = d3.select("body").select("div.textViz").append("svg")
      .attr("width", "200%")
      .attr("height", "1000%")
      .attr("id", "svg_left");

  let word_distance = 10;
  let line_height = "60px";
  let font_size = "12px";
  let container_width = $(".textViz").width() - word_distance*2;
  let categories = 0;
   
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
    let doc = svg_left.append("text")
        .attr("x", 0)
        .attr("y", line_height)
        ;

    let line_width = 0;
    labels.forEach(function(paragraph, i) {
      paragraph.forEach(function(sentence, i) {
        sentence.forEach(function(w, i) {
          // Append this word a tspan and measure its width.
          let temp_tspan = svg_left.append("text")
              .text(w.word)
              .style("font-size", font_size)
              ;
          let w_width = Math.round( temp_tspan.node().getComputedTextLength() );
          
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

      // Add an extra blank line to separate two paragraphs.
      doc.append("tspan")
          .attr("x", word_distance)
          .attr("dy", line_height)
          .text(" ")
          .style("font-size", font_size)
          ;
    })
  }
});