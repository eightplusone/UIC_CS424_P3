$(document).ready(function(){

  // Canvas
  let svg_left = d3.select("body").select("div.textViz").append("svg")
      .attr("width", "10000%")
      .attr("height", "100%")
      .attr("id", "svg_left");

  //let container_width = 36000;
  let margin = 10;
  let line_h = 50;  // Initial line height
  let font_size = "14px";

  // Selected categories
  let categories = {};

  // Position of words and edges (in pixel)
  let w_pos = {};
  let e_pos = [];

  // Arrow
  let thickness = 2;
  let arrow_w = 2;
  let arrow_h = 4;
  let color_n2n = "#0098ce";
  let color_n2e = "#3ad531";
  let color_e2n = "#ff7376";
  let color_e2e = "#8a6ad4";
  
   
  // Load data
  d3.json("./data/labelleddata.json", function(err1, labels) {
    if (err1) throw err1;
    d3.json("./data/edge.json", function(err2, edges){
      if(err2) throw err2;
      textviz(labels, edges, categories);
    })
  })

  // Display TextViz
  function textviz(labels, edges, categories) {
    // Container
    let doc = svg_left.append("text")
        .attr("x", 0)
        .attr("y", 200)
        ;
    let curr_length = margin;

    labels.forEach(function(paragraph, paragraph_idx) {
      paragraph.forEach(function(sentence, sentence_idx) {
        sentence.forEach(function(w, word_idx) {
          // Append this word a tspan and measure its width.
          let temp_tspan = svg_left.append("text")
              .text(w.word)
              .style("font-size", font_size)
              ;

          // Width of the word
          let w_width = Math.round( temp_tspan.node().getComputedTextLength() );

          // Put the word into doc
          doc.append("tspan")
            .attr("dx", margin)
            .text(w.word)
            .style("font-size", font_size)
            ;

          // Log the word's data
          w_pos[w.Id] = {
            "x": curr_length + margin,
            //"y": 0,
            "length": w_width
          };

          // Update the length of the sentence
          curr_length += w_width;

        })
      })
    });

    // Convert the edges object to an array
    var edge_array = $.map(edges, function(value, index) {
      return [value];
    });

    // Sort edge_array by their distance
    edge_array.sort(function(a, b) {
      if (parseInt(a.sourceid) < parseInt(b.sourceid)) {
        return -1;
      }
    });

  }
});


