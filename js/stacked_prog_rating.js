// Modified from https://bl.ocks.org/mbostock/3886208

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width_stack = 480 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x_stack = d3.scale.ordinal()
    .rangeRoundBands([0, width_stack], .25);

var y_stack = d3.scale.linear()
    .rangeRound([height, 0]);

var color_stack = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var xAxis_stack = d3.svg.axis()
    .scale(x_stack)
    .orient("bottom");

var yAxis_stack = d3.svg.axis()
    .scale(y_stack)
    .orient("left");
    // .tickFormat(d3.format(".2s"));

var svg_stacked_prog = d3.select("#prog_rating_bar").append("svg")
    .attr("width", width_stack + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);

svg_stacked_prog.call(tip);

d3.csv("data/stacked_prog_rating_percentage2.csv", function(error, data) {
  if (error) throw error;

  color_stack.domain(d3.keys(data[0]).filter(function(key) { return key !== "Rating"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.ages = color_stack.domain().map(function(name) { return {gender: d.Rating, name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.ages[d.ages.length - 1].y1;
  });

  x_stack.domain(data.map(function(d) { return d.Rating; }));
  y_stack.domain([0, d3.max(data, function(d) { return d.total; })]);

  console.log("bobcat");

  tip
    .html(function(d) {
        console.log(d.name);
        return "Percentage of " + (d.gender).toLowerCase() + " in category " + d.name + ": " + "<br>" + (d.y1 - d.y0) + "%";
    });

  svg_stacked_prog.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height + 80) + ")")
      .call(xAxis_stack);

  svg_stacked_prog.append("g")
      .attr("class", "y axis")
      .call(yAxis_stack)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Percentage in each programming category");

  var state = svg_stacked_prog.selectAll(".state")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x_stack(d.Rating) + ",0)"; });

  state.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("width",  x_stack.rangeBand())
      .attr("y", function(d) { return y_stack(d.y1); })
      .attr("height", function(d) { return y_stack(d.y0) - y_stack(d.y1); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .on('click', showPie(d., d.))
      .style("fill", function(d) { return color_stack(d.name); });

  svg_stacked_prog.call(tip);

  var legend = svg_stacked_prog.selectAll(".legend")
      .data(color_stack.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width_stack - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color_stack);

  legend.append("text")
      .attr("x", width_stack - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});

function showPie(thing1, thing2) {
  var radius = Math.min(width, height) / 2;

  // Get the filtered array

  var numbers = [
      {label: 'American Indian or Alaskan Native', value: 4},
      {label: 'Asian', value: 322},
      {label: 'Black or African American', value: 39},
      {label: 'Caucasian', value: 372},
      {label: 'Hispanic or Latino', value: 35},
      {label: 'Other', value: 134}
  ];

  var svg = d3.select("#chart-area3").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + width/2+ "," + height/2 + ")");

  var colorscale = d3.scale.ordinal()
      //.domain(["American Indian or Alaskan Native", "Asian", "Black or African American", "Caucasian", "Hispanic or Latino", "Other"])
      .range(["#333", "#DAE2DF", "#33CC35", "#A6D8DE", "#F9F1B5", "#48B0AC"]);

  var tip = d3.tip()
     .attr('class', 'd3-tip')
     .offset([-10, 0]);

  svg.call(tip);

  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

  var arcText = d3.svg.arc()
      .outerRadius(radius - 80)
      .innerRadius(radius - 40);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d, index) { return d.value});

  tip
     .html(function(d) {
         return d.data.label+ " : " +  d.value;
     });

  var g = svg.selectAll(".arc")
      .data(pie(numbers))

      .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return colorscale(d.data.label)})
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  g.append("text")
      .attr("transform", function(d) { return "translate(" + arcText.centroid(d) +")"; })
      .attr("dy", ".35em")
      .text(function(d) {return d.data.label + ": " + d.data.value});

};