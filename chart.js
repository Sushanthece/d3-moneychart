  var grpIndex=0,catIndex=0,elementIndex=0,range_val1=200,range_val2=400,range_val3=600;
  var objSVG=new Object();
      objSVG.h=0;
      objSVG.mT=0;
      objSVG.svgvalue=0;
      objSVG.uid="";
      objSVG.sw=0;
      objSVG.svgcolor="";
      objSVG.stroke="";
// ----------- Report Heading ------------------      
  var main_cont=d3.select("body").append("div")
                    .attr("id","main_container");
                
  var main_title_cont=main_cont.append("div")
                              .attr("id","main_title_container");
              
  main_title_cont.append("div")
                  .attr("id","title_container")
                  .text("MONEY Chart");
//----------------data manupulation------------  
  d3.csv("org_chart.csv", function(data){        
    var nest_cat=d3.nest()
            .key(function(d){ return  d.order;})
            .sortKeys(d3.ascending)
            .key(function(d){ return  d.category;})
            .entries(data.sort(function(d){return d.category;}));  
            
    for(grpIndex=0;grpIndex<nest_cat.length;grpIndex++){
    
      var main_div=main_cont.append("div")
                            .attr("class","group_div")
                            .attr("id","main_div"+grpIndex);
              
      main_div.append("div")
              .attr("id","groups")
              .text(nest_cat[grpIndex].values[0].values[0].group);  
              
      for(catIndex=0;catIndex<nest_cat[grpIndex].values.length;catIndex++){
      
         main_div.append("div")
                 .attr("id","category")
                 .text(nest_cat[grpIndex].values[catIndex].key);
            
        var elements=nest_cat[grpIndex].values[catIndex].values;
        
        elements.sort(function(a, b){return dollarToNumber(a.value) - dollarToNumber(b.value);});
        
        for(elementIndex=0;elementIndex<elements.length;elementIndex++){
     
          objSVG=getSVGObject(dollarToNumber(elements[elementIndex].value));                          
          objSVG.uid="svg_div"+grpIndex+elementIndex+grpIndex+elementIndex+catIndex+elementIndex;
          
//----------- Title Rendering -----------------------
          
          main_div.append("div")
                  .attr("class","titles")
                  .style("min-height",objSVG.h + "px")
                  .text(nest_cat[grpIndex].values[catIndex].values[elementIndex].title+" : "+nest_cat[grpIndex].values[catIndex].values[elementIndex].value);
    
          main_div.append("div")
                  .attr("id",objSVG.uid)
                  .style("float","left")
                  .style("margin-top",objSVG.mT + "px")                
                  .style("margin-left","110px");
            
//------------- Design Rendering ---------------------
            drawSVG(objSVG);
          }
        }
      }
  }); 
//---------------Dollar to Numeric --------------
function dollarToNumber(value)
{  
    var v = value.replace(/[$,]/g, function(d) {
        return { "$" : "", "," : ""  }[d];
    }); return v;
}
//--------------- SVG Object ----------------
function getSVGObject(dollarValue)
{
  var range= new Array();
  range[range.length]= {'A':'1', 'B':'999','Color':'#5bb65f', 'Str':'#3c6a3e'};
  range[range.length]= {'A':'1000', 'B':'999999','Color':'#ff9e48','Str':'#804f24'};
  range[range.length]= {'A':'1000000', 'B':'999999999','Color':'#bbb','Str':'#5e5e5e'};
  range[range.length]= {'A':'1000000000', 'B':'999999999999','Color':'#cccc00','Str':'#42421c'};
  range[range.length]= {'A':'1000000000000', 'B':'999999999999999','Color':'#85fffe','Str':'#373b3e'};

  for(var i=0; i<range.length; i++){
      if(isInBetween(dollarValue, range[i].A, range[i].B)){      
        objSVG.svgvalue=Math.round(dollarValue/range[i].A); 
        objSVG.svgcolor=range[i].Color; 
        objSVG.stroke=range[i].Str;
      }
  }
//------------------svg range-------------------------
  var baseVal=5.5,baseMod=10;
  var wBase = 0,wTBase1=15,wTBase2=100,wTBase3=180,modul = 0;

  if(objSVG.svgvalue<=range_val1)
  {
    objSVG.h=25; objSVG.mT=-35;
    modul = (objSVG.svgvalue%5)==0 ? 10 : 15;
    wBase = modul + (baseVal*(Math.ceil(objSVG.svgvalue/5)));
    objSVG.sw = (objSVG.svgvalue<=5) ? wTBase1 : wBase ;
  }
  else if(objSVG.svgvalue>range_val1 && objSVG.svgvalue<=range_val2)
  {
    objSVG.h=45; objSVG.mT=-55;
    modul = (objSVG.svgvalue%10)==0 ? 15 : 18;
    wBase = modul + (baseVal*(Math.ceil(objSVG.svgvalue/10)));
    objSVG.sw = (objSVG.svgvalue<=210) ? wTBase2 : wBase ;
  }
  else if(objSVG.svgvalue>range_val2 && objSVG.svgvalue<=range_val3)
  {
    objSVG.h=85; objSVG.mT=-90;
    modul = (objSVG.svgvalue%15)==0 ? 15 : 18;
    wBase = modul + (baseVal*(Math.ceil(objSVG.svgvalue/15)));
    objSVG.sw = (objSVG.svgvalue<=415) ? wTBase3 : wBase ;
  }
  else if(objSVG.svgvalue>range_val3)
  {
    objSVG.h=110; objSVG.mT=-120;
    wBase = 15 + (baseVal*(Math.ceil(objSVG.svgvalue/20)));
    objSVG.sw = (objSVG.svgvalue<=620) ? wTBase3 : wBase ;
  }
  return objSVG;
}    
//---------------check range--------------------
function isInBetween(x, a, b){
  X = parseInt(x); A = parseInt(a); B = parseInt(b);
  if(X >= A && X <=B)
    return true;
   else
    return false;
}
//--------------- Draw SVG ------------------
function drawSVG(objSVG)
{
  var x=0,y=0,nx=0,ny=0,h=0,x1,y1,rectWidth=4,rectHeight=4;
 
  if(objSVG.svgvalue<=range_val1)
  {
//---------------one row svg---------------------
    h=45;    
    x1=function(d,i){if((i%5)==0){x=x+5;if((ny%5)==0){x=x+2;ny=0;if((nx%2)==0){x=x+2;nx=0;}nx=nx+1;} ny=ny+1;} return x;};
    y1=function(d,i){y++;if((y%6)==0){y=1;} return y*5;};
  }
  else if(objSVG.svgvalue>range_val1 && objSVG.svgvalue<=range_val2)
  {
//---------------two row svg---------------------
    h=65;
    x1=function(d,i){if((i%10)==0){x=x+5;if((ny%5)==0){x=x+2;if(ny==10){x=x+2;ny=0;}}ny=ny+1;} return x;};
    y1=function(d,i){if((i%5)==0){y=y+2;if((i%10)==0){y=0;}} y=y+5; return y;};
  }
  else if(objSVG.svgvalue>range_val2 && objSVG.svgvalue<=range_val3)
  {
//---------------three row svg---------------------
    h=90;
    x1=function(d,i){if((i%15)==0){x=x+5;if((ny%5)==0){x=x+2;if(ny==10){x=x+2;ny=0;}}ny=ny+1;}return x;};
		y1=function(d,i){if((i%5)==0){y=y+2;if((nx%2)==0){y=y+2;nx=0;if((i%15)==0){y=0;}}ny=ny+1;} y=y+5;return y;};	
  }
  else if(objSVG.svgvalue>range_val3)
  {
//---------------four row svg---------------------
    h=120;
    x1=function(d,i){if((i%20)==0){x=x+5;if((ny%5)==0){x=x+2;if((ny%2)==0){x=x+2;ny=0;}}ny=ny+1;} return x;};
    y1=function(d,i){if((i%5)==0){y=y+2;if((i%10)==0){y=y+4;if((i%20)==0){y=0;}}} y=y+5; return y;}
  }  
//-----------------svg construction-------------------
  var chart=d3.select("#"+objSVG.uid).append("svg")
        .attr("width", objSVG.sw)
        .attr("height", h);
        
    chart.selectAll("rect")
        .data(d3.range(objSVG.svgvalue))
        .enter().append("rect")
        .attr("fill",objSVG.svgcolor)
        .attr("stroke", objSVG.stroke)
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .attr("x",x1)
        .attr("y",y1);
}