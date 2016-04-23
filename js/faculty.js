var marginf = {top: 100, right: 80, bottom: 30, left: 50},
    widthf = 600 - marginf.left - marginf.right,
    heightf = 500 - marginf.top - marginf.bottom;

var parseDatef = d3.time.format("%Y").parse;

var xf = d3.time.scale()
    .range([0, widthf]);

var yf = d3.scale.linear()
    .range([heightf, 0]);

var colorf = d3.scale.ordinal()
    //.range(["#A6D8DE", "#F9F1B5", "#7B9DA6"]);
    .range(["#F9F1B5", "95c2c7", "7B9DA6"]);

var xAxisf = d3.svg.axis()
    .scale(xf)
    .orient("bottom");

var yAxisf = d3.svg.axis()
    .scale(yf)
    .orient("left");

var linef = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return xf(d.datef); })
    .y(function(d) { return yf(d.numberf); });

var svg_fac = d3.select("#line2").append("svg")
    .attr("width", widthf + marginf.left + marginf.right)
    .attr("height", heightf + marginf.top + marginf.bottom)
  .append("g")
    .attr("transform", "translate(" + marginf.left + "," + marginf.top + ")");

d3.csv("data/wrangledundergrads.csv", function(error, dataf) {
  if (error) throw error;

  colorf.domain(d3.keys(dataf[0]).filter(function(key) { return key !== "AcademicYear"; }));

  console.log(color.domain);

  dataf.forEach(function(d) {
    d["AcademicYear"] = parseDate(d["AcademicYear"]);
  });

  var citiesf = colorf.domain().map(function(name) {
    return {
      namef: name,
      valuesf: dataf.map(function(d) {
        return {date: d["AcademicYear"], numberf: +d[name]};
      })
    };
  });

  // console.log("Cities: ");
  // console.log(cities);

  xf.domain(d3.extent(dataf, function(d) { return d["AcademicYear"]; }));

  yf.domain([
    d3.min(citiesf, function(c) { 
      return d3.min(c.valuesf, function(v) { 
        return v.numberf; 
      }); 
    }),
    d3.max(citiesf, function(c) { return d3.max(c.valuesf, function(v) { return v.numberf; }); })
  ]);

  svg_fac.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxisf);

  svg_fac.append("g")
      .attr("class", "y axis")
      .call(yAxisf)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Numbers");

  var cityf = svg_line_graph.selectAll(".city")
      .data(citiesf)
    .enter().append("g")
      .attr("class", "cityf");

  cityf.append("path")
      .attr("class", "linef")
      .attr("d", function(d) { 
        console.log(d.valuesf);
        return linef(d.valuesf); 
      })
      .style("stroke", function(d) { return color(d.namef); });
      
  cityf.append("textf")
       .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
       .attr("transform", function(d) { return "translate(" + xf(d.value.date) + "," + yf(d.value.number) + ")"; })
       .attr("x", 3)
       .attr("dy", ".35em")
       .text(function(d) { return d.name; });

 });