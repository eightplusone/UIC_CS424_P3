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
		d3.json("./data/edge1.json", function(error, edge){
			if(error) {
				console.log(error);  
			}
			else{
			edge.sort(function(a, b) {			//sort in asending order of sourceid
				return (a.sourceid) - (b.sourceid);
			});
			var temp_holder= [];
			var max_x = $(".stairViz").width() - 10;
			var max_y = $(".stairViz").height() -10;
			var paragraph= [];
			var i=0;
			var j=0;
			var k=0;
			var min_text;
			var max_text;
			for(i =0;i<datao.length;i++){
				paragraph[i]= datao[i];	
				for(j=0;j<paragraph[i].length;j++){	
					
					var len= paragraph[i][j].length;
					for(k=0;k < len;k++){
						var id=paragraph[i][j][k].Id
						temp_holder[id] = paragraph[i][j][k];
					}
				}
			}	
			for(i =0;i<datao.length;i++){		//remove when get id from html div
				paragraph[i]= datao[i];			//
				for(j=0;j<paragraph[i].length;j++){		//get value of i ,j from that div remove this line as well
					var len= paragraph[i][j].length;	
					var rect_w = max_x/(len+1);
					var rect_h = max_y/(len+1);
					min_text = paragraph[i][j][0];
					max_text = paragraph[i][j][len-1];	
					for(k=0;k < len;k++){
						var id=paragraph[i][j][k].Id
						//temp_holder[id] = paragraph[i][j][k];
									
						var sq = svg
							.append("rect")
							.attr("word",temp_holder[id].word)
							.attr("x", function(){  temp_holder[id].x = rect_w*k;
													return rect_w*k;})
							.attr("y",function(){ temp_holder[id].y = rect_h*k;
													return rect_h*k;})
							.attr("width", rect_w)
							.attr("height", rect_h)
							.style("fill","yellow")
							.attr("stroke-width","1")
							.on("mouseover",function(){
							var word = d3.select(this).attr("word");
							div.transition()
								.duration(200)
								.style("opacity", .9);
							div.html("Text: "+ word)
							.style("left",d3.event.pageX +"px")
								.style("top", d3.event.pageY - 28 +"px")
								.style("color", "white");})
							.on("mouseout",funcmouseout);		
					
						
					}
				break;		//remove after getting value	
				}			//remove after getting value
				break;		//remove
			}
					//remove
					
			var edge_map={};
			var stack_des=[];
			for( var l=0;l < edge.length ;l++)
			{
				var id = edge[l].Id;
				if(edge[l].sourceid.includes("T") && edge[l].destinationid.includes("T")){
					var src = edge[l].sourceid.split(/(\d+)/);
					var des = edge[l].destinationid.split(/(\d+)/);
					if(parseInt(src[1]) >= parseInt(min_text.wordindex) && parseInt(src[1]) <= parseInt(max_text.wordindex)){
						if(parseInt(des[1]) >= parseInt(min_text.wordindex) && parseInt(des[1]) <= parseInt(max_text.wordindex)){
							edge_map[id] = edge[l];
							edge_map[id].flag =0;
							edge_map[id].sourcex = getsourcex(edge[l]).srcx;
							edge_map[id].sourcey = getsourcey(edge[l]).srcy;
							edge_map[id].destx = getdestx(edge[l]).desx;
							edge_map[id].desty = getdesty(edge[l]).desy;
						}
						else{
							edge_map[id] = edge[l];
							edge_map[id].flag =1;				//destination absent
							edge_map[id].sourcex = getsourcex(edge[l]).srcx;
							edge_map[id].sourcey = getsourcey(edge[l]).srcy;
							
						}
					}
					else{
						if(parseInt(des[1]) >= parseInt(min_text.wordindex) && parseInt(des[1]) <= parseInt(max_text.wordindex)){
							
							edge_map[id] = edge[l];
							edge_map[id].flag =2;				//source absent
							edge_map[id].destx = getdestx(edge[l]).desx;
							edge_map[id].desty = getdesty(edge[l]).desy;
						}
					}
				}
				else if(edge[l].sourceid.includes("T") && edge[l].destinationid.includes("E")){
					var src = edge[l].sourceid.split(/(\d+)/);
					if(parseInt(src[1]) >= parseInt(min_text.wordindex) && parseInt(src[1]) <= parseInt(max_text.wordindex)){		//in range check destination edge
						if(edge[l].destinationid in edge_map)	{				//both present in range
							edge_map[id] = edge[l];
							edge_map[id].flag =0;
							
							edge_map[id].sourcex = getsourcex(edge[l]).srcx;
							edge_map[id].sourcey = getsourcey(edge[l]).srcy;
							edge_map[id].destx = getdestx(edge[l]).desx;
							edge_map[id].desty = getdesty(edge[l]).desy;
						}
						else{		//destination edge not there
							//add to a stack
							stack_des.push({parent:edge[l],edge:edge[l].destinationid,flag:1});
						}
					}
					else{//source not in range check destination edge
						if(edge[l].destinationid in edge_map)	{
							edge_map[id] = edge[l];		//destination present in range
							edge_map[id].flag =2;
							edge_map[id].destx = getdestx(edge[l]).desx;
							edge_map[id].desty = getdesty(edge[l]).desy;
							
							
						}
						else{		//destination edge not there
							//add to a stack
							stack_des.push({parent:edge[l],edge:edge[l].destinationid,flag:2});
						}		
					}
				}	
				else if(edge[l].sourceid.includes("E") && edge[l].destinationid.includes("T")){
					var des = edge[l].destinationid.split(/(\d+)/);
					if(parseInt(des[1]) >= parseInt(min_text.wordindex) && parseInt(des[1]) <= parseInt(max_text.wordindex)){		//in range check destination edge
						if(edge[l].sourceid in edge_map)	{				//both present in range
							edge_map[id] = edge[l];
							edge_map[id].flag =0;
							edge_map[id].sourcex = getsourcex(edge[l]).srcx;
							edge_map[id].sourcey = getsourcey(edge[l]).srcy;
							edge_map[id].destx = getdestx(edge[l]).desx;
							edge_map[id].desty = getdesty(edge[l]).desy;
						}
						else{		//destination edge not there
							//add to a stack
							stack_des.push({parent:edge[l],edge:edge[l].sourceid,flag:1});
						}
					}
					else{//source not in range check source edge
						if(edge[l].sourceid in edge_map)	{				//both present in range
							edge_map[id] = edge[l];
							edge_map[id].flag =1;
							edge_map[id].sourcex = getsourcex(edge[l]).srcx;
							edge_map[id].sourcey = getsourcey(edge[l]).srcy;
							
							
						}
						else{		//destination edge not there
							//add to a stack
							stack_des.push({parent:edge[l],edge:edge[l].sourceid,flag:1});
							
						}		
					}
				}
				else if(edge[l].sourceid.includes("E") && edge[l].destinationid.includes("E")){
					if(edge[l].sourceid in edge_map){
						if(edge[l].destinationid in edge_map)	{				//both present in range
							edge_map[id] = edge[l];
							edge_map[id].flag =0;
							edge_map[id].sourcex = getsourcex(edge[l]).srcx;
							edge_map[id].sourcey = getsourcey(edge[l]).srcy;
							edge_map[id].destx = getdestx(edge[l]).desx;
							edge_map[id].desty = getdesty(edge[l]).desy;
						}
						else{ //if destination is not there
							//add to a stack
							stack_des.push({parent:edge[l],edge:edge[l].destinationid,flag:2});
						}
					}
					else{
						if(edge[l].destinationid in edge_map)	{				//destination present in range
							edge_map[id] = edge[l];
							edge_map[id].flag =2;
							edge_map[id].destx = getdestx(edge[l]).desx;
							edge_map[id].desty = getdesty(edge[l]).desy; // this block doubtful
						}
						else{
							stack_des.push({parent:edge[l],edge:edge[l].destinationid,flag:2});
							stack_des.push({parent:edge[l],edge:edge[l].sourceid,flag:1});
						}
					}	
				}
							
			}
			stack_des.sort(function(a, b) {	
				var edge1=a.edge.split(/(\d+)/);
				var edge2=b.edge.split(/(\d+)/);				
				return (edge1[1]) - (edge2[1]);
			});
			while(stack_des.length!=0)
				{
					var popped = stack_des.pop();
					
					//if(popped.edge in edge_map){
						var parent = popped.parent;
						if(popped.flag ==1){		//destination missing source present
							if(popped.parent.destinationid in edge_map){
								var temp_id = popped.parent.Id;
								edge_map[temp_id] = popped.parent;
								edge_map[temp_id].flag =0;
								edge_map[temp_id].sourcex = getsourcex(popped.parent).srcx;
								edge_map[temp_id].sourcey = getsourcey(popped.parent).srcy;
								edge_map[temp_id].destx = getdestx(popped.parent).desx;
								edge_map[temp_id].desty = getdesty(popped.parent).desy;
							}
							else{			//not in edge map may be in stack
								if(popped.parent.destinationid in stack_des){
									var index = stack_des.indexOf(popped.parent.destinationid);
									stack_des.splice(index,1);
									var temp_id = popped.parent.Id;
									edge_map[temp_id] = popped.parent;
									edge_map[temp_id].flag =0;
									edge_map[temp_id].sourcex = getsourcex(popped.parent).srcx;
									edge_map[temp_id].sourcey = getsourcey(popped.parent).srcy;
									edge_map[temp_id].destx = getdestx(popped.parent).desx;
									edge_map[temp_id].desty = getdesty(popped.parent).desy;
								}
								else{
									var temp_id = popped.parent.Id;
									edge_map[temp_id] = popped.parent;
									edge_map[temp_id].flag =1;
									edge_map[temp_id].sourcex = getsourcex(popped.parent).srcx;
									edge_map[temp_id].sourcey = getsourcey(popped.parent).srcy;
								}
							}
						}
					
					else{
							if(popped.parent.sourceid in edge_map){
								var temp_id = popped.parent.Id;
								edge_map[temp_id] = popped.parent;
								edge_map[temp_id].flag =0;
								edge_map[temp_id].sourcex = getsourcex(popped.parent).srcx;
								edge_map[temp_id].sourcey = getsourcey(popped.parent).srcy;
								edge_map[temp_id].destx = getdestx(popped.parent).desx;
								edge_map[temp_id].desty = getdesty(popped.parent).desy;
							}
							else{			//not in edge map may be in stack
								if(popped.parent.sourceid in stack_des){
									var index = stack_des.indexOf(popped.parent.destinationid);
									stack_des.splice(index,1);
									var temp_id = popped.parent.Id;
									edge_map[temp_id] = popped.parent;
									edge_map[temp_id].flag =0;
									edge_map[temp_id].sourcex = getsourcex(popped.parent).srcx;
									edge_map[temp_id].sourcey = getsourcey(popped.parent).srcy;
									edge_map[temp_id].destx = getdestx(popped.parent).desx;
									edge_map[temp_id].desty = getdesty(popped.parent).desy;
								}
								else{
									var temp_id = popped.parent.Id;
									edge_map[temp_id] = popped.parent;
									edge_map[temp_id].flag =2;
									edge_map[temp_id].destx = getdestx(popped.parent).desx;
									edge_map[temp_id].desty = getdesty(popped.parent).desy;
								}
							}
							
						}
					
				
				}
				
			function size(obj) {
					var size = 0, key;
					for (key in obj) {
						if (obj.hasOwnProperty(key)) size++;
					}
					return size;
			};
			
			
				
			for( e in edge_map)
				{
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
						.style("fill","black");	
					var link = canvas.append("path")
								.attr("label",edge_map[e].label)
								.attr("src",edge_map[e].sourceid)
								.attr("dest",edge_map[e].destinationid)
								.attr("ed_id",edge_map[e].Id)
								.attr("flag",edge_map[e].flag)
								.attr("class","link")
								.attr("d",function(){
										
										var id =edge_map[e].Id;
										var val;
										if(edge_map[e].flag==0){
											
											val = "M "+ edge_map[e].sourcex +" "+edge_map[e].sourcey+" "+(max_x-20)+" "+edge_map[e].sourcey+" "+(max_x-20)+" "+edge_map[e].desty+" "+edge_map[e].destx+" "+edge_map[e].desty;
										}
										else if(edge_map[e].flag==1){
											val = "M "+ edge_map[e].sourcex +" "+edge_map[e].sourcey+" "+(max_x-20)+" "+edge_map[e].sourcey;
										}
										else if(edge_map[e].flag==2){
											val = "M "+(max_x-20)+" "+edge_map[e].desty+" "+edge_map[e].destx+" "+edge_map[e].desty;
										}
										return val;})
								.attr("marker-end", "url(#triangle)")
								.attr("stroke",function(){ var col = getedgecolor(edge_map[e]);
															return col;})
								.attr("stroke-dasharray",dash)							
														
								.style("fill","none")							
								.on("mouseover",funcmouseover)
								.on("mouseout",funcmouseout);					
				}
			function dash()
			{
				if(d3.select(this).attr("flag")!=0){
					console.log("here");
					return "3,3";
				}
				else 
					return "0,0";
			}
			function getedgecolor(edg)
			{	
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
			
			function funcmouseover()
            {		
					div.transition()
						.duration(200)
						.style("opacity", .9);
					var label = d3.select(this).attr("label");
					var src = d3.select(this).attr("src");
					var dest = d3.select(this).attr("dest");
					var ed_id = d3.select(this).attr("ed_id");
					div.html("Id: "+ed_id+"<br>Label: "+ label +"<br> Relationship: <br>" + getword(src,dest,label))
							.style("left",d3.event.pageX +"px")
								.style("top", d3.event.pageY - 28 +"px")
								.style("color", "white");
			}
			
			function getword(src,dest,label)
			{
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
						console.log(node);
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
				return temp_holder[id].word;	
				}
			
			function lookupedge(id){			//change this to look up in all the edges not just the current sentence
			for(var i=0;i<edge.length;i++)
			{
				if(edge[i].Id == id)
					return edge[i];
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
							
							edg.srcx = temp_holder[edg.sourceid].x;
							return edg;
				}
				else{ 		
							var temp_edg = lookupedge(edg.sourceid);
							
							return getsourcex(temp_edg);
					}
			}
			
			function getsourcey(edg){
			
				if((edg.sourceid).includes("T")){
							edg.srcy = temp_holder[edg.sourceid].y;
							return edg;
				}
				else{ 		
							var temp_edg = lookupedge(edg.sourceid);
							return getsourcey(temp_edg);
						
				}
			}
			
			function getdesty(edg){
			
				if((edg.destinationid).includes("T")){
							edg.desy = temp_holder[edg.destinationid].y;
							return edg;
				}
				else{  		
							var temp_edg = lookupedge(edg.destinationid);
							return getdesty(temp_edg);
						
				}
			}
			
			function getdestx(edg){
			
				if((edg.destinationid).includes("T")){
							edg.desx = temp_holder[edg.destinationid].x;
							return edg;
				}
				else{  
							
							var temp_edg = lookupedge(edg.destinationid);
							return getdestx(temp_edg);
					}
			}

			
			}
			})
			
	}
})	

});