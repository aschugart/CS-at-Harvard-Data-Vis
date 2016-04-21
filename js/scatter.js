

var margin5 = {top: 20, right: 20, bottom: 30, left: 40},
    width5 = 960 - margin5.left - margin5.right,
    height5 = 100 - margin5.top - margin5.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis


 */ 



// setup x 
var xValue5 = function(d) { return d.Professors;}, // data -> value
    xScale5 = d3.scale.linear().range([0, width5]), // value -> display
    xMap5 = function(d) { return xScale5(xValue5(d));}, // data -> display
    xAxis5 = d3.svg.axis().scale(xScale5).orient("bottom");

// setup y
var yValue5 = function(d) { return d.Gender;}, // data -> value
    yScale5 = d3.scale.ordinal().rangeRoundBands([height5, 0]), // value -> display
    yMap5 = function(d) { return yScale5(yValue5(d));}, // data -> display
    yAxis5 = d3.svg.axis().scale(yScale5).orient("left");

//setup fill color
var cValue = function(d) { return d.Gender;},
    color2 = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg = d3.select("#scatter").append("svg")
    .attr("width", width5 + margin5.left + margin5.right)
    .attr("height", height5 + margin5.top + margin5.bottom)
  .append("g")
    .attr("transform", "translate(" + margin5.left + "," + margin5.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("#scatter").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("data/scatter.csv", function(error, data) {

  data.forEach(function(d) {
    d.Professors = +d.Professors;
    d.Gender = d.Gender;
//    console.log(d);
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale5.domain([d3.min(data, xValue5)-1, d3.max(data, xValue5)+1]);
  yScale5.domain([d3.min(data, yValue5)-1, d3.max(data, yValue5)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height5 + ")")
      .call(xAxis5)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Calories");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis5)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Protein (g)");

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap5)
      .attr("cy", yMap5)
      .style("fill", function(d) { return color2(cValue(d));}) 
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["Cereal Name"] + "<br/> (" + xValue5(d) 
	        + ", " + yValue5(d) + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  // draw legend
  var legend5 = svg.selectAll(".legend")
      .data(color2.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend5.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color2);

  // draw legend text
  legend5.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
});
