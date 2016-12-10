$(document).ready(function(){

  // Canvas
  let svg_left = d3.select("body").select("div.textViz").append("svg")
      .attr("width", "10000%")
      .attr("height", "100%")
      .attr("id", "svg_left");

  let margin = 20;
  let line_h = 300;  // Initial line height
  let font_size = "14px";

  // Selected categories
  let categories = {};

  // Position of words and edges (in pixel)
  let w_pos = {};
  let e_pos = [];

  // Arrow
  let thickness = 3;
  let arrow_w = 2;
  let arrow_h = 4;
  let color_n2n = "#0098ce";
  let color_n2e = "#3ad531";
  let color_e2n = "#ff7376";
  let color_e2e = "#8a6ad4";
  let color_black = "#000000";
  
   
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
    let curr_length = 0;

    labels.forEach(function(paragraph, paragraph_idx) {
      paragraph.forEach(function(sentence, sentence_idx) {
        sentence.forEach(function(w, word_idx) {
          // Append this word a tspan and measure its width.
          let temp_tspan = svg_left.append("text")
              .text(w.word)
              .style("font-size", font_size)
              ;

          // Width of the word
          let w_width = temp_tspan.node().getComputedTextLength();

          // Put the word into doc
          doc.append("tspan")
            .attr("dx", margin)
            .attr("y", line_h)
            .text(w.word)
            .style("font-size", font_size)
            ;

          // Log the word's data
          w_pos[w.Id] = {
            x: curr_length + margin,
            y: line_h,
            length: w_width,
            inX: curr_length + margin + w_width/3,  // Gate for incoming edges
            inY: line_h,
            outX: curr_length + margin + w_width*2/3,  // Gate for outcoming edges
            outY: line_h
          }

          // Update the length of the sentence
          curr_length = curr_length + margin + w_width;

          temp_tspan.remove();
        })
      })
    });

    /*
     * Load & calculate the length of each edge
     * 
     * Except n2n connections, other connections depend on either the source
     * or the destination connection has existed or not. Because of that, we
     * cannot simply iterate through the list of edges and hope that two
     * ends of every connection are already available.
     *
     * Steps:
     *   1. Pre-load the edges to see the dependencies between.
     *   2. Put n2n edges on top of the order first.
     *   3. Next, load edges of which both source & destination exists.
     *   4. Now as we have known in which order should we load the edges,
     *      we can start grabbing & calculating their details from json.
     */

    // Pre-load the edges to see the dependencies between them.
    let preloaded_edges = [];
    edges.forEach(function(e, i) {
      preloaded_edges[i] = { id: e.Id, src: e.sourceid, des: e.destinationid };
    })

    // An array to store the sorted IDs
    let L = [];

    // Load n2n edges first and remove them from preloaded_edges
    let _i_ = 0;
    while (_i_ < preloaded_edges.length) {
      let e = preloaded_edges[_i_];
      if ( e.src.indexOf("T") == 0 && e.des.indexOf("T") == 0 ) {
        L.push(e.id);
        preloaded_edges.splice(_i_, 1);
      } 
      else { _i_++; }
    }

    // Put the rest into L
    _i_ = 0;  // No need to waste a variable
    while (preloaded_edges.length > 1) {
      let e = preloaded_edges[_i_];
      let isSkipped = true;

      // If each of the source and destination is either a node or an 
      // already-loaded edge, this edge is ready to be loaded
      if ((typeof e !== "undefined")
        && ( e.src.indexOf("T") == 0 || ( e.src.indexOf("E") == 0 && L.indexOf(e.src) != -1 ))
        && ( e.des.indexOf("T") == 0 || ( e.des.indexOf("E") == 0 && L.indexOf(e.des) != -1 ))) { 
          L.push(e.id);
          preloaded_edges.splice(_i_, 1);
          isSkipped = false;
      }
      if (isSkipped && preloaded_edges.length > 0) { 
        _i_ = (_i_ + 1) % preloaded_edges.length; 
      }
    }

    // For future convenience, edges should be converted into a dictionary
    // so we can reference an edge's info by its ID.
    let edges_dict = {};
    edges.forEach(function(e, i) {
      edges_dict[e.Id] = {
        srcId: e.sourceid,
        desId: e.destinationid
      };
    });

    // Also for convenience, we should remember the index of each edge in
    // edge_pos so we can point the edge's dependencies to it later.
    let index_edge = {};

    // Check which row (of height) the arrow belongs to
    let height_lvl = [];

    // Find a height level for an edge such that it does not overlap any
    // other edge
    function find_height_lvl(index, curr_height_lvl, left_most, right_most) {
      if (index == 0) return curr_height_lvl;

      let isOverlapped = true;
      while (isOverlapped) {
        isOverlapped = false;
        for (let j = 0; j < index; j++) {
          let e = edges_dict[L[j]];

          if (e.height == curr_height_lvl) {
            let left = Math.min(e.srcX, e.desX);
            let right = Math.max(e.srcX, e.desX);

            if (left <= right_most && right >= left_most) {
              curr_height_lvl++;
              isOverlapped = true;
              j = index;
            } 
          }
        }
      }

      return curr_height_lvl;
    }

    // Order of the edges is ready, now it is time to load all info of the edges
    for (let i = 0; i < L.length; i++) {
      let e = edges_dict[L[i]];

      // n2n
      if (e.srcId.indexOf("T") == 0 && e.desId.indexOf("T") == 0) {
        let e_length = Math.abs( w_pos[e.srcId].outX - w_pos[e.desId].inX );
        let left = Math.min( w_pos[e.srcId].outX, w_pos[e.desId].inX );
        
        height_lvl[L[i]] = 1;
        height_lvl[L[i]] = find_height_lvl(
          i, 
          1, 
          Math.min( w_pos[e.srcId].outX, w_pos[e.desId].inX ),
          Math.max( w_pos[e.srcId].outX, w_pos[e.desId].inX )
        );

        //console.log(Math.min( w_pos[e.srcId].outX, w_pos[e.desId].inX ),
        //  Math.max( w_pos[e.srcId].outX, w_pos[e.desId].inX ));

        e_pos[i] = {
          id: L[i],
          srcId: e.srcId,
          desId: e.desId,
          srcX: w_pos[e.srcId].outX,  // Source
          srcY: w_pos[e.srcId].outY,
          desX: w_pos[e.desId].inX,  // Destination
          desY: w_pos[e.desId].inY,
          length: e_length,  // For sorting
          inX: left + e_length/3,  // Gate for incoming connections
          inY: w_pos[e.srcId].outY,
          outX: left + e_length*2/3,  // Gate for outgoing connections
          outY: w_pos[e.desId].inY,
          height: height_lvl[L[i]],
          baseline: line_h,
          color: color_n2n
        }
        index_edge[L[i]] = i;
      }

      // n2e
      else if (e.srcId.indexOf("T") == 0 && e.desId.indexOf("E") == 0) {
        let dest = e_pos[index_edge[e.desId]];
        let e_length = Math.abs( w_pos[e.srcId].outX - dest.inX );
        let left = Math.min( w_pos[e.srcId].outX, dest.inX );
        
        height_lvl[L[i]] = height_lvl[e.desId] + 1;
        height_lvl[L[i]] = find_height_lvl(
          i, 
          height_lvl[e.desId] + 1, 
          Math.min( w_pos[e.srcId].outX, dest.inX ),
          Math.max( w_pos[e.srcId].outX, dest.inX )
        );
        
        e_pos[i] = {
          id: L[i],
          srcId: e.srcId,
          desId: e.desId,
          srcX: w_pos[e.srcId].outX,  // Source
          srcY: w_pos[e.srcId].outY,
          desX: dest.inX,  // Destination
          desY: dest.inY - height_lvl[e.desId] * margin,
          length: e_length,  // For sorting
          inX: left + e_length/3,  // Gate for incoming connections
          inY: w_pos[e.srcId].outY,
          outX: left + e_length*2/3,  // Gate for outgoing connections
          outY: dest.inY - height_lvl[e.desId] * margin,
          height: height_lvl[L[i]],
          baseline: line_h,
          color: color_n2e
        }
        index_edge[L[i]] = i;
      } 

      // e2n
      else if (e.srcId.indexOf("E") == 0 && e.desId.indexOf("T") == 0) {
        let src = e_pos[index_edge[e.srcId]];
        let e_length = Math.abs( w_pos[e.desId].inX - src.outX );
        let left = Math.min( w_pos[e.desId].inX, src.outX );
        
        height_lvl[L[i]] = height_lvl[e.srcId] + 1;
        height_lvl[L[i]] = find_height_lvl(
          i, 
          height_lvl[e.srcId] + 1, 
          Math.min( w_pos[e.desId].inX, src.outX ),
          Math.max( w_pos[e.desId].inX, src.outX )
        );
        
        e_pos[i] = {
          id: L[i],
          srcId: e.srcId,
          desId: e.desId,
          srcX: src.outX,  // Source
          srcY: src.outY - height_lvl[e.srcId] * margin,
          desX: w_pos[e.desId].inX,  // Destination
          desY: w_pos[e.desId].inY,
          length: e_length,  // For sorting
          inX: left + e_length/3,  // Gate for incoming connections
          inY: line_h,
          outX: left + e_length*2/3,  // Gate for outgoing connections
          outY: line_h,
          height: height_lvl[L[i]],
          baseline: line_h,
          color: color_e2n
        }
        index_edge[L[i]] = i;
      } 

      // e2e
      if (e.srcId.indexOf("E") == 0 && e.desId.indexOf("E") == 0) {
        let src = e_pos[index_edge[e.srcId]];
        let dest = e_pos[index_edge[e.desId]];
        let e_length = Math.abs( src.outX - dest.inX );
        let left = Math.min( src.outX, dest.inX );
        
        height_lvl[L[i]] = Math.max( height_lvl[e.srcId], height_lvl[e.desId] ) + 1;
        height_lvl[L[i]] = find_height_lvl(
          i, 
          Math.max( height_lvl[e.srcId], height_lvl[e.desId] ) + 1, 
          Math.min( src.outX, dest.inX ),
          Math.max( src.outX, dest.inX )
        );

        e_pos[i] = {
          id: L[i],
          srcId: e.srcId,
          desId: e.desId,
          srcX: src.outX,  // Source
          srcY: src.outY - height_lvl[e.srcId] * margin,
          desX: dest.inX,  // Destination
          desY: dest.inY - height_lvl[e.desId] * margin,
          length: e_length,  // For sorting
          inX: left + e_length/3,  // Gate for incoming connections
          inY: line_h,
          outX: left + e_length*2/3,  // Gate for outgoing connections
          outY: line_h,
          height: height_lvl[L[i]],
          baseline: line_h,
          color: color_e2e
        }
        index_edge[L[i]] = i;
      } 
    }

    // Sort the edges by length
    e_pos.sort(function(e1, e2) {
      if (e1.length < e2.length) { return -1; }
      else if (e1.length > e2.length) { return 1; }
      else return (e1.srcId < e2.srcId);
    });
    
    //console.log(e_pos);

    // Build edges
    let arrow = [];
    for (let i = 0; i < e_pos.length; i++) {
      let e = e_pos[i];
      arrow[i] = "M ";
      arrow[i] += e.srcX + " " + (e.srcY - margin);
      arrow[i] += " L " + e.srcX + " " + (e.baseline - e.height*margin - margin);
      arrow[i] += " L " + e.desX + " " + (e.baseline - e.height*margin - margin);
      arrow[i] += " L " + e.desX + " " + (e.desY - margin);
    }
    //console.log(arrow);

    // Draw edges
    let infoWindow = svg_left.append("div")
                        .attr("class", "tooltip")
                        .style("background-color", "#000000")
                        .style("opacity", 0); 
    let path = [];
    for (let i = 0; i < arrow.length; i++) {
      path[i] = svg_left.append("path")
                  .attr("d", arrow[i])
                  .attr("stroke-width", thickness)
                  .attr("stroke", e_pos[i].color)
                  .style("fill", "transparent")
                  .on("mouseover", function() {
                    console.log(i);
                    infoWindow.transition()
                      .duration(200)
                      .style("opacity", .9);
                    infoWindow.html("haha")
                      .style("color", "white");
                  });
    }

  }
});


