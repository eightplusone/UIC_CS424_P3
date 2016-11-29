$(document).ready(function(){

  // Canvas
  let svg_left = d3.select("body").select("div.textViz").append("svg")
      .attr("width", "100%")
      .attr("height", "600%")
      .attr("id", "svg_left");

  let word_position = {};
  let word_distance = 10;
  let line_height = 50;
  let font_size = "12px";
  let line_width = 0;
  let line_counter = 1;

  let container_width = 320;
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
    // Container
    let doc = svg_left.append("text")
        .attr("x", 0)
        .attr("y", line_height)
        ;

    // Display the text
    labels.forEach(function(paragraph, paragraph_idx) {
      paragraph.forEach(function(sentence, sentence_idx) {
        sentence.forEach(function(w, word_idx) {
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

            word_position[w.Id] = [
              line_width + word_distance + Math.round( w_width/2 ), 
              line_counter * line_height
            ]
            
            line_width = line_width + word_distance + w_width;

          } else {
            doc.append("tspan")
              .attr("x", word_distance)
              .attr("dy", line_height)
              .text(w.word)
              .style("font-size", font_size)
              ;

            line_counter += 1;

            word_position[w.Id] = [
              word_distance + Math.round( w_width/2 ), 
              line_counter * line_height
            ]
            
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
    
    // Draw the edges
    edges.forEach(function(edge, edge_idx) {
      if (edge.destinationid.indexOf("T") > -1) {
        console.log(word_position[ edge.sourceid ][0], word_position[ edge.sourceid ][1]);

        let arrow = "M ";
        arrow += word_position[ edge.sourceid ][0] + ", " + word_position[ edge.sourceid ][1];
        arrow += " L ";
        arrow += word_position[ edge.destinationid ][0] + ", " + word_position[ edge.destinationid ][1];

        svg_left.append("path")
          .attr("d", arrow)
          .style("fill", "#000000");
      }
    })
  }
});