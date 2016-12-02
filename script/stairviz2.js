$(document).ready(function(){
		
  //svg
  let svg = d3.select("body").select("div.stairViz").append("svg")
			.attr("width","100%")
			.attr("height","100%");
				
	var div = d3.select("body").select("div.stairViz").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);			
     
	d3.json("./data/labelleddata.json", function(error,datao) {
	  if (error) {  //If error is not null, something went wrong.
	      console.log(error);  //Log the error.
	  } else {  
		d3.json("./data/edge1.json", function(error, edge) {
			if(error) {
				console.log(error);  
			}
			else{
				var temp_holder= [];
				var max_x = $(".stairViz").width() - 10;
				var max_y = $(".stairViz").height() -10;
				var paragraph= [];
				var i=0;
				var j=0;
				var k=0;
				for(i =0;i<datao.length;i++){
					paragraph[i]= datao[i];
					for(j=0;j<paragraph[i].length;j++){
						var len= paragraph[i][j].length;
						var rect_w = max_x/(len+1);
						var rect_h = max_y/(len+1);	
						for(k=0;k < len;k++){
							temp_holder[k] = paragraph[i][j][k];
										
							var sq = svg
								.append("rect")
								.attr("x", function(){  temp_holder[k].x = rect_w*k;
														return rect_w*k;})
								.attr("y",function(){ temp_holder[k].y = rect_h*k;
														return rect_h*k;})
								.attr("width", rect_w)
								.attr("height", rect_h)
								.style("fill","yellow")
								.attr("stroke-width","1");
						
							
						}
					break;	
					}
					break
				}
			
				for( var l=0;l < edge.length ;l++) {
					//var sourceid = edge[l].sourceid;
					//var destid = edge[l].destinationid;
					//var tag = edge[l].label;
					var canvas = svg.append("g");
					canvas.append("canvas:defs").append("canvas:marker")
							.attr("id", "triangle")
							.attr("refX", 3)
							.attr("refY", 3)
							.attr("markerWidth", 15)
							.attr("markerHeight", 15)
							.attr("orient", "auto")
							.append("path")
							.attr("d", "M 0 0 6 3 0 6 1.5 3")
							.style("fill","black");			//change to the color of the line see how
					
					var link = canvas.append("path")
								.attr("label",edge[l].label)
								.attr("src",edge[l].sourceid)
								.attr("dest",edge[l].destinationid)
								.attr("class","link")
								.attr("d",function(){
										var sourcex= getsourcex(edge[l]).srcx;
										var sourcey = getsourcey(edge[l]).srcy;
										var destx = getdestx(edge[l]).desx;
										var desty = getdesty(edge[l]).desy;
										var val = "M "+ sourcex +" "+sourcey+" "+(max_x-20)+" "+sourcey+" "+(max_x-20)+" "+desty+" "+destx+" "+desty;
										return val;})
								.attr("marker-end", "url(#triangle)")
								.attr("stroke",function(){ var col = getedgecolor(edge[l]);
															return col;})
								.style("fill","none")							
								.on("mouseover",funcmouseover)
								.on("mouseout",funcmouseout);					
				}
			
				function getedgecolor(edg) {	
					if((edg.sourceid).includes("T")){
						if((edg.destinationid).includes("T")){
							return "#0098ce";
						}
						else{
							return "#3ad531"
						}
					}
					else if((edg.sourceid).includes("E")){
						if((edg.destinationid).includes("T")){
							return "#ff376";
						}
						else{
							return "#38a6ad4"
						}
					}
				}
			
				function funcmouseover() {
					div.transition()
						.duration(200)
						.style("opacity", .9);
					var label = d3.select(this).attr("label");
					var src = d3.select(this).attr("src");
					var dest = d3.select(this).attr("dest");
					div.html("Label: "+ label +"<br> Relationship: <br>" + getword(src,dest,label))
							.style("left",d3.event.pageX +"px")
							.style("top", d3.event.pageY - 28 +"px")
							.style("color", "white");
				}
			
				function getword(src,dest,label) {
					var relation=" ";
					var stack = [];
					stack.push(dest);
					stack.push(label);
					stack.push(src);
								
					do{
						var pattern = /E[0-9]+/g;
						var pattern2 = /T[0-9]+/g;
						node = stack.pop();
						if(node.includes("T") && pattern2.test(node)){
							relation = relation +lookup(node);
						}
						else if(node.includes("E") && pattern.test(node)){
							relation = relation + "(";
							stack.push(")");
							var temp_edge = lookupedge(node);			
							stack.push(temp_edge.destinationid);
							stack.push(temp_edge.label);
							stack.push(temp_edge.sourceid);
											
						}
						else if(node==")"){
								relation = relation+ node;
											
						}
						else{
							relation = relation+ "->"+node+"->";
						}
					
					}while(stack.length !=0);
					return relation;	
				}
			
				function lookup(id){
					for(var i =0;i< temp_holder.length;i++){
						if(id == temp_holder[i].Id){
						return temp_holder[i].word;
						}
					}
				}
			
				function lookupedge(id){
					for(var i =0;i< edge.length;i++){
						if(id == edge[i].Id){
							return edge[i];
						}
					}
				}
			
				function funcmouseout(d)
            {
                div.transition()
                        .duration(2)
                        .style("opacity", 0);
            }
			
				function getsourcex(edg){
					if((edg.sourceid).includes("T")){
						for(var count =0;count < temp_holder.length;count++){
							if(temp_holder[count].Id == edg.sourceid){
								edg.srcx = rect_w*count;
								return edg;
							}
						}
					}
					else{  // for this to work make sure the source edges are sorted in ascending order
						for(var e=0;e < edge.length;e++){
							if(edge[e].Id ==edg.sourceid){
								return edge[e];
							}
						}
					}
				}
			
				function getsourcey(edg){
					if((edg.sourceid).includes("T")){
						for(var count =0;count < temp_holder.length;count++){
							if(temp_holder[count].Id == edg.sourceid){
								edg.srcy = rect_h*count;
								return edg;
							}
						}
					}
					else{  // for this to work make sure the source edges are sorted in ascending order
						for(var e=0;e < edge.length;e++){
							if(edge[e].Id ==edg.sourceid){
								return edge[e];
							}
						}
					}
				}

				function getdesty(edg){
					if((edg.destinationid).includes("T")){
						for(var count =0;count < temp_holder.length;count++){
							if(temp_holder[count].Id == edg.destinationid){
								edg.desy = rect_h*count;
								return edg;
							}
						}
					}
					else{  // for this to work make sure the source edges are sorted in ascending order
						for(var e=0;e < edge.length;e++){
							if(edge[e].Id ==edg.destinationid){
								return edge[e];
							}
						}
					}
				}
			
				function getdestx(edg){
					if((edg.destinationid).includes("T")){
						for(var count =0;count < temp_holder.length;count++){
							if(temp_holder[count].Id == edg.destinationid){
								edg.desx = rect_w*count;
								return edg;
							}
						}
					}
					else{  // for this to work make sure the source edges are sorted in ascending order
						for(var e=0;e < edge.length;e++){
							if(edge[e].Id ==edg.destinationid){
								return edge[e];
							}
						}
					}
				}
			}
		})
			
	}
})	

	let width = $(".stairViz").width();
	let height = $(".stairViz").height();

	let zoom = d3.zoom()
    .scaleExtent([1, 40])
    .translateExtent([[-10000, -10000], [width + 9000, height + 10000]])
    .on("zoom", zoomed);

  var x = d3.scaleLinear()
    .domain([-1, width + 1])
    .range([-1, width + 1]);

	var y = d3.scaleLinear()
	    .domain([-1, height + 1])
	    .range([-1, height + 1]);

	// Define the gradient
	var gradient = svg.append("svg:defs")
	    .append("svg:linearGradient")
	    .attr("id", "gradient")
	    .attr("x1", "0%")
	    .attr("y1", "0%")
	    .attr("x2", "100%")
	    .attr("y2", "100%")
	    .attr("spreadMethod", "pad");
	// Define the gradient colors
	gradient.append("svg:stop")
	    .attr("offset", "0%")
	    .attr("stop-color", "#a00000")
	    .attr("stop-opacity", 1);
	gradient.append("svg:stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#aaaa00")
	    .attr("stop-opacity", 1);

	var view = svg.append("rect")
	    .attr("class", "view")
	    .attr("x", 0.5)
	    .attr("y", 0.5)
	    .attr("width", width - 1)
	    .attr("height", height - 1)
	    .attr('fill', 'url(#gradient)')
	    ;
	view.append("svg").append("circle")
			.attr("r", 15)
			.attr("cx", 20)
			.attr("cy", 35)
			.style("fill", "#333");

	var gX = svg.append("g")
	    .attr("class", "axis axis--x")
	    ;

	var gY = svg.append("g")
	    .attr("class", "axis axis--y")
	    ;

	//view.call(zoom);
	svg.call( d3.zoom()
    .scaleExtent([0.5, 10])
    .on("zoom", zoomed));

	function zoomed() {
	  view.attr("transform", d3.event.transform);
	}


});