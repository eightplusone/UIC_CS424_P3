$(document).ready(function(){

  // Canvas
  let svg_left = d3.select("body").select("div.textViz").append("svg")
      .attr("width", "100%")
      .attr("height", "600%")
      .attr("id", "svg_left");

  let container_width = 360;
  let margin = 10;
  let line_h = 50;
  let font_size = "15px";
  let line_width = 0;  // Total width of each line of text
  let line_counter = 1;  // 

  // Selected categories
  let categories = {};

  // Position of words and edges (in pixel)
  let w_pos = {};
  let e_pos = [];

  // Arrow
  let thickness = 2;
  let edge_distance = 10;
  let arrow_w = 2;
  let arrow_h = 4;
  let color_n2n = "#0098ce";
  let color_n2e = "#3ad531";
  let color_e2n = "#ff7376";
  let color_e2e = "#8a6ad4";
  let num_edges_on_line = [];
   
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
        .attr("y", line_h)
        ;
    
    // Calculate position of each word and display the words
    init_text();

    // Initialize edge counter for each line
    for (i = 0; i < line_counter; i++) { num_edges_on_line[i] = 0; }

    // Calculate position of the edges
    for (edge_idx = 1; edge_idx <= edges.length; edge_idx++) {
      let color = "#000000";
      let e = edges[edge_idx-1];
      let s = e.sourceid;
      let d = e.destinationid;
      e_pos[edge_idx-1] = [];

      // n2n
      if (s.indexOf("T") == 0 && d.indexOf("T") == 0) {
        color = color_n2n;

        if ( w_pos[s][1] == w_pos[d][1] ) {  // Words on the same line
          let line = "M ";
          // Source
          line += (w_pos[s][0] - Math.round(w_pos[s][2]/4)) 
                + " " 
                + (w_pos[s][1] - Math.round(line_h/4));
          // Up
          line += " L " 
                  + (w_pos[s][0] - Math.round(w_pos[s][2]/4)) 
                  + " " 
                  + (w_pos[s][1] - Math.round(line_h/2));
          // Turn
          line += " L " 
                  + (w_pos[d][0] + Math.round(w_pos[d][2]/6)) 
                  + " " 
                  + (w_pos[s][1] - Math.round(line_h/2));
          // Destination
          line += " L " 
                  + (w_pos[d][0] + Math.round(w_pos[d][2]/6)) 
                  + " " 
                  + (w_pos[s][1] - Math.round(line_h/4));
          // Add to list
          e_pos[edge_idx-1].push({line, color});
          num_edges_on_line[ Math.round( w_pos[s][1]/line_h ) - 1 ] ++;

          // Arrowhead
          line = "M " 
                  + (w_pos[d][0] + Math.round(w_pos[d][2]/6) - arrow_w) 
                  + " " 
                  + (w_pos[d][1] - Math.round(line_h/4));
          line += " L " 
                  + (w_pos[d][0] + Math.round(w_pos[d][2]/6)) 
                  + " " 
                  + (w_pos[d][1] - Math.round(line_h/4) + arrow_h);
          line += " L " 
                  + (w_pos[d][0] + Math.round(w_pos[d][2]/6) + arrow_w) 
                  + " " 
                  + (w_pos[d][1] - Math.round(line_h/4));
          // Add to list
          e_pos[edge_idx-1].push({line, color});
      


        } else {  // The two words are not on the same line
          // Source
          let line = "M " 
                  + (w_pos[s][0] - Math.round(w_pos[s][2]/4)) 
                  + " " 
                  + (w_pos[s][1] - Math.round(line_h/4));
          // Up
          line += " L " 
                  + (w_pos[s][0] - Math.round(w_pos[s][2]/4)) 
                  + " " 
                  + (w_pos[s][1] - Math.round(line_h/2));
          

          if (parseInt(s.substring(1)) < parseInt(d.substring(1))) {  // Go down/right
            let curr_h = w_pos[s][1] - Math.round(line_h/2);

            // Span over multiple lines.
            // Instead of drawing segments, we go "out of the box" to have
            // one continous line.
            while (curr_h < w_pos[d][1]) {
              // Right
              line += " L " + (container_width + 100) + " " + curr_h;
              // Up
              line += " L " + (container_width + 100) + " " + (-100);
              // Left
              line += " L -100 -100";
              // Increase height
              curr_h += line_h;
              // Down
              line += " L -100 " + curr_h;
              // Update number of edges on that line
              num_edges_on_line[ Math.round( curr_h/line_h ) - 1 ] ++;
            }

            // Destination
            line += " L " 
                    + w_pos[d][0] 
                    + " " 
                    + w_pos[d][1];
            e_pos[edge_idx-1].push({line, color});

            // Arrowheads
            curr_h = w_pos[s][1] - Math.round(line_h/2);
            while (curr_h < w_pos[d][1]) {
              line = "M " + (container_width - arrow_h) + " " + (curr_h - arrow_w);
              line += " L " + container_width + " " + curr_h;
              line += " L " + (container_width - arrow_h) + " " + (curr_h + arrow_w);
              curr_h += line_h;
              // Add to list
              e_pos[edge_idx-1].push({ line, color });
            }


          } else {  // Go up/left
            let curr_h = (w_pos[s][1] - Math.round(line_h/2));

            // Span over multiple lines.
            // Instead of drawing segments, we go "out of the box" to have
            // one continous line.
            while (curr_h > w_pos[d][1]) {
              // Left
              line += " L " + (-100) + " " + curr_h;
              // Up
              line += " L -100 -100";
              // Right
              line += " L " + (container_width + 100) + " " + (-100);
              // Increase height
              curr_h -= line_h;
              // Down
              line += " L " + (container_width + 100) + " " + curr_h;
              // Update number of edges on that line
              num_edges_on_line[ Math.round( curr_h/line_h ) - 1 ] ++;
            }

            // Destination
            line += " L " 
                  + (w_pos[d][0] + Math.round(w_pos[d][2]/6)) 
                  + " " 
                  + (w_pos[d][1] - Math.round(line_h/2));
            line += " L " 
                  + (w_pos[d][0] + Math.round(w_pos[d][2]/6)) 
                  + " " 
                  + (w_pos[d][1] - Math.round(line_h/4));
            // Add to list
            e_pos[edge_idx-1].push({line, color});

            // Arrowheads
            curr_h = (w_pos[s][1] - Math.round(line_h/2));
            while (curr_h > w_pos[d][1]) {
              line = "M " + arrow_h + " " + (curr_h - arrow_w);
              line += " L 0 " + curr_h;
              line += " L " + arrow_h + " " + (curr_h + arrow_w);
              curr_h -= line_h;
              // Add to list
              e_pos[edge_idx-1].push({ line, color });
            }
          }

          // Arrowhead
          line = "M " 
                  + (w_pos[d][0] + Math.round(w_pos[d][2]/6) - arrow_w) 
                  + " " 
                  + (w_pos[d][1] - Math.round(line_h/4));
          line += " L " 
                  + (w_pos[d][0] + Math.round(w_pos[d][2]/6)) 
                  + " " 
                  + (w_pos[d][1] - Math.round(line_h/4) + arrow_h);
          line += " L " 
                  + (w_pos[d][0] + Math.round(w_pos[d][2]/6) + arrow_w) 
                  + " " 
                  + (w_pos[d][1] - Math.round(line_h/4));
          // Add to list
          e_pos[edge_idx-1].push({line, color});
        }
      }
    }

    // Get the maximum number of edges on the lines.
    // The positions (of words and edges) will be updated so no edge will
    // overlap the texts.
    let max_num_edges = Math.max.apply(null, num_edges_on_line);

    // Stretch the space (Re-calculate the position of each word and each edge)
    updateWordDistance(max_num_edges);

    // Clear the SVG
    d3.select("svg_left > *").remove();

    // Display text again

    // Draw the edges
    e_pos.forEach(function(_edge_, _i_) {
      _edge_.forEach(function(_e_, __i__) {
        svg_left.append("path")
          .attr("d", _e_["line"])
          .attr("stroke-width", thickness)
          .attr("stroke", _e_["color"])
          .style("fill", "transparent");
      });
    });    

    // Calculate the initial position of each word
    function init_text() {
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
            if (line_width + margin*2 + w_width < container_width) {
              // Put the word into textviz
              doc.append("tspan")
                .attr("dx", margin)
                .text(w.word)
                .style("font-size", font_size)
                ;
              // Log its coordinates
              w_pos[w.Id] = [
                line_width + margin + Math.round( w_width/2 ), 
                line_counter * line_h,
                w_width
              ]
              // Update line_width
              line_width = line_width + margin + w_width;

            } else {
              // New line
              line_counter += 1;
              // Put the word into textviz
              doc.append("tspan")
                .attr("x", margin)
                .attr("dy", line_h)
                .text(w.word)
                .style("font-size", font_size)
                ;
              // Log its coordinates
              w_pos[w.Id] = [
                margin + Math.round( w_width/2 ), 
                line_counter * line_h,
                w_width
              ]
              // Update line_width
              line_width = margin + w_width;
            }

            temp_tspan.remove();
          })
        })

        // Add an extra blank line to separate two paragraphs.
        doc.append("tspan")
          .attr("x", margin)
          .attr("dy", line_h)
          .text(" ")
          .style("font-size", font_size)
          ;
      })
    }

    // Stretch the gap between lines more to fit in more arrows
    function updateWordDistance(num_edges) {
      for (let key in w_pos) {
        w_pos[key][1] += (max_num_edges * edge_distance - line_h);
      };
    }

    // Display text after stretching
    function display_text() {

    }
  }
});


