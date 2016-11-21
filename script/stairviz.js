$(document).ready(function(){
		
    //svg
    let svg = d3.select("body").select("div.stairViz").append("svg")
				.attr("width","100%")
				.attr("height","100%");
     
     d3.json("./data/labelleddata.json", function(error,datao) {
        if (error) {  //If error is not null, something went wrong.
            console.log(error);  //Log the error.
        } else {  
		d3.json("./data/edge1.json", function(error, edge){
			if(error) {
				console.log(error);  
			}
			else{
			var temp_holder= [];
			var max_x = $(".stairViz").width() - 10;
			console.log(max_x);
			var max_y = $(".stairViz").height() -10;
			console.log(max_y);
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
			
			for( var l=0;l < edge.length ;l++)
				{
					var sourceid = edge[l].sourceid;
					var destid = edge[l].destinationid;
					var tag = edge[l].label;
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
							.style("fill", "black");
							
					var link = canvas.append("line")
								.attr("x1",function(){ var dummy =  getsourcex(edge[l]);
														return dummy.srcx;})
								.attr("y1",function(){ var dummy = getsourcey(edge[l]);
														return dummy.srcy; })
								.attr("x2",function(){ var dummy =  getsourcex(edge[l]);
														return dummy.srcx+40;})
								.attr("y2",function(){ var dummy = getsourcey(edge[l]);
														return dummy.srcy; })	
								.attr("stroke-width","2")
								.attr("stroke","black");
														
					canvas.append("line")
								.attr("x1",function(){ var dummy =  getsourcex(edge[l]);
														return dummy.srcx+40;})
								.attr("y1",function(){ var dummy = getsourcey(edge[l]);
														return dummy.srcy; })									
								.attr("x2",function(){ var dummy = getsourcex(edge[l]);
														return dummy.srcx+40; })
								.attr("y2",function(){ var dummy = getdesty(edge[l]);
														return dummy.desy; })
								.attr("stroke-width","2")
								.attr("stroke","black");
								
					canvas.append("line")
								.attr("x1",function(){ var dummy =  getsourcex(edge[l]);
														return dummy.srcx+40;})
								.attr("y1",function(){ var dummy = getdesty(edge[l]);
														return dummy.desy; })									
								.attr("x2",function(){ var dummy = getdestx(edge[l]);
														return dummy.desx; })
								.attr("y2",function(){ var dummy = getdesty(edge[l]);
														return dummy.desy; })
								.attr("stroke-width","2")
								.attr("stroke","black")
								.attr("marker-end", "url(#triangle)");
								
								
								
;
						
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
			/*var canvas = svg.append("g");
			for( var l=0;l < edge.length ;l++)
				{
					var sourceid = edge[i].sourceid;
					var destid = edge[i].destinationid;
					var tag = edge[i].label;
					var link = canvas.append("line")
								.attr("x",retrievex)
				}
			function retrievex()	
			{
				
			}*/
	}
})	

});