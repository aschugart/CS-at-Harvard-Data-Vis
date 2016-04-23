var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate_ratio = d3.time.format("%Y");

var x_ratio = d3.time.scale()
    .range([0, width]);

var y_ratio = d3.scale.linear()
    .range([height, 0]);

var xAxis_ratio = d3.svg.axis()
    .scale(x_ratio)
    .orient("bottom");

var yAxis_ratio = d3.svg.axis()
    .scale(y_ratio)
    .orient("left");

var line_ratio = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return x_ratio(d.Year); })
    .y(function(d) { return y_ratio(d.Ratio); });

var svg_ratio = d3.select("#chart-area_ratio").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/Ratio.csv", type, function(error, data) {
  if (error) throw error;

  x_ratio.domain(d3.extent(data, function(d) { return d.Year; }));
  y_ratio.domain(d3.extent(data, function(d) { return d.Ratio; }));

  svg_ratio.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis_ratio);

  svg_ratio.append("g")
      .attr("class", "y axis")
      .call(yAxis_ratio)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

  svg_ratio.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line_ratio);
});

function type(d) {
  d.Year = parseDate_ratio.parse(d.Year);
  d.Ratio = +d.Ratio;
  return d;
}