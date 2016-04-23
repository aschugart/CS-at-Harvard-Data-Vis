var margin = {top: 100, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var x_fac = d3.time.scale()
    .range([0, width]);

var y_fac = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    //.range(["#A6D8DE", "#F9F1B5", "#7B9DA6"]);
    .range(["#F9F1B5", "95c2c7", "7B9DA6"]);

var xAxis_fac = d3.svg.axis()
    .scale(x_fac)
    .orient("bottom");

var yAxis_fac = d3.svg.axis()
    .scale(y_fac)
    .orient("left");

var line_fac = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return x_fac(d.date); })
    .y(function(d) { return y_fac(d.number); });

var svg_line_graph_fac = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/faculty.csv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "AcademicYear"; }));

  console.log(color.domain);

  data.forEach(function(d) {
    d["AcademicYear"] = parseDate(d["AcademicYear"]);
  });

  var cities_fac = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d["AcademicYear"], number: +d[name]};
      })
    };
  });

  // console.log("Cities: ");
  // console.log(cities);

  x.domain(d3.extent(data, function(d) { return d["AcademicYear"]; }));

  y.domain([
    d3.min(cities_fac, function(c) { 
      return d3.min(c.values, function(v) { 
        return v.number; 
      }); 
    }),
    d3.max(cities_fac, function(c) { return d3.max(c.values, function(v) { return v.number; }); })
  ]);

  svg_line_graph_fac.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis_fac);

  svg_line_graph_fac.append("g")
      .attr("class", "y axis")
      .call(yAxis_fac)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Numbers");

  // circles
  // cities.forEach(function (d,i) {
  //   var circles = svg.selectAll(".circle-group-"+i)
  //     .data(d.values);

  //   circles.enter().append("circle")

  // })

  // var circlegroups = svg.selectAll(".circle-group")
  //   .data(cities);

  // // Data enter
  // circlegroups.enter().append("g");

  // var circle = circlegroups.selectAll('circle')
  //   .data(function (d) { return d.values; });

  // // data update for circle
  // circle
  //   .transition(3000)
  //   .duration(800)
  //   .attr("cx", function(d) {
  //     return x(d.date);
  //   })
  //   .attr("cy", function(d) {
  //     return y(d.number);
  //   })
  //   .attr("r", 8)
  //   .attr("fill", "steelblue");

  // circle
  //   .on('mouseover', tip.show)
  //   .on('mouseout', tip.hide);

  // // Data exit
  // circle.exit().remove();

  var city_fac = svg_line_graph.selectAll(".city")
      .data(cities_fac)
    .enter().append("g")
      .attr("class", "city");

  city_fac.append("path")
      .attr("class", "line")
      .attr("d", function(d) { 
        console.log(d.values);
        return line(d.values); 
      })
      .style("stroke", function(d) { return color(d.name); });
      
  city_fac.append("text")
       .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
       .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.number) + ")"; })
       .attr("x", 3)
       .attr("dy", ".35em")
       .text(function(d) { return d.name; });

});