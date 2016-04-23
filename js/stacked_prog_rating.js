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

  tip
    .html(function(d) {
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
      .on('click', function(d) {
        return changePie(d.name, d.gender);
      })
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

// DEFAULT PIE CHART

var default_dataset = {
  apples: [53245, 28479, 19697, 24037, 40245],
  oranges: [200, 200, 200, 200] // previously 5 values, now only 4
};

var radius = Math.min(width, height) / 2;

var enterAntiClockwise = {
  startAngle: Math.PI * 2,
  endAngle: Math.PI * 2
};

var colorscale = d3.scale.category20();

var pie = d3.layout.pie()
  .sort(null);

var arc = d3.svg.arc()
  .outerRadius(radius - 10)
  .innerRadius(0);

var svg_prog_pie = d3.select("#prog_pie").append("svg")
  .attr("width", width_stack)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width_stack / 2 + "," + height / 2 + ")");

var path = svg_prog_pie.selectAll("path")
  .data(pie(default_dataset.apples))
  .enter().append("path")
  .attr("fill", function(d, i) { return colorscale(i); })
  .attr("d", arc)
  .each(function(d) { this._current = d; }); // store the initial values

// d3.selectAll("input").on("change", change);

var timeout = setTimeout(function() {
  d3.select("input[value=\"oranges\"]").property("checked", true).each(changePie);
}, 2000);


function changePie(category, gender) {
  // var radius = Math.min(width, height) / 2;

  var data;
  loadData();

  function loadData() {
      d3.csv("data/linked_prog_pie.csv", function(error, csv) {
          if (error) return console.warn(error);
          data = csv;
          
          // Get the filtered csv
          filteredData = data.filter(function (d) {
            return (d["gender"] == gender) && (d["rating"] == category);
          });

          // get the count for each "years" of programming
          // var years0, years1, years2, years3, years4, years5, years6,
          // years7, years8, years9, years10, years11;

          var years0, years1, years2, years35, years68, years9;

          years0 = years1 = years2 = years35 = years68 = years9 = 0;

          filteredData.forEach(function (d) {
            if (d.years == "0") {
              years0++;
            } else if (d.years == "1") {
              years1++;
            } else if (d.years == "2") {
              years2++;
            } else if (d.years == "3") {
              years35++;
            } else if (d.years == "4") {
              years35++;
            } else if (d.years == "5") {
              years35++;
            } else if (d.years == "6") {
              years68++;
            } else if (d.years == "7") {
              years68++;
            } else if (d.years == "8") {
              years68++;
            } else if (d.years == "9") {
              years9++;
            } else if (d.years == "10") {
              years9++;
            } else {
              years9++;
            }
          });

          var numbers = [
              {label: 'Less than a year', value: years0},
              {label: '1 year', value: years1},
              {label: '2 years', value: years2},
              {label: '3 to 5 years', value: years35},
              {label: '6 to 8 years', value: years68},
              {label: '9+ years', value: years9}
          ];

          // var svg_prog_pie = d3.select("#prog_pie").append("svg")
          //     .attr("width", width + margin.left + margin.right)
          //     .attr("height", height + margin.top + margin.bottom)
          //     .append("g")
          //     .attr("transform", "translate(" + width/2+ "," + height/2 + ")");

          var key = function(d){ return d.data.label; };

          clearTimeout(timeout);
          path = path.data(pie(numbers)); // update the data
          // set the start and end angles to Math.PI * 2 so we can transition
          // anticlockwise to the actual values later
          path.enter().append("path")
              .attr("fill", function (d, i) {
                return color(i);
              })
              .attr("d", arc(enterAntiClockwise))
              .each(function (d) {
                this._current = {
                  data: d.data,
                  value: d.value,
                  startAngle: enterAntiClockwise.startAngle,
                  endAngle: enterAntiClockwise.endAngle
                };
              }); // store the initial values

          path.exit()
              .transition()
              .duration(750)
              .attrTween('d', arcTweenOut)
              .remove() // now remove the exiting arcs

          path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
        

        // Store the displayed angles in _current.
        // Then, interpolate from _current to the new angles.
        // During the transition, _current is updated in-place by d3.interpolate.
        function arcTween(a) {
          var i = d3.interpolate(this._current, a);
          this._current = i(0);
          return function(t) {
          return arc(i(t));
          };
        }
        // Interpolate exiting arcs start and end angles to Math.PI * 2
        // so that they 'exit' at the end of the data
        function arcTweenOut(a) {
          var i = d3.interpolate(this._current, {startAngle: Math.PI * 2, endAngle: Math.PI * 2, value: 0});
          this._current = i(0);
          return function (t) {
            return arc(i(t));
          };
        }

          // svg_prog_pie.append("g")
          //     .attr("class", "slices");
          // svg_prog_pie.append("g")
          //     .attr("class", "labels");
          // svg_prog_pie.append("g")
          //     .attr("class", "lines");

          // var colorscale = d3.scale.ordinal()
          //     .range(["#333", "#DAE2DF", "#33CC35", "#A6D8DE", "#F9F1B5", "#48B0AC"]);

          // var tip = d3.tip()
          //    .attr('class', 'd3-tip')
          //    .offset([-10, 0]);

          // svg_prog_pie.call(tip);

          // var arc = d3.svg.arc()
          //     .outerRadius(radius - 10)
          //     .innerRadius(0);

          // var arcText = d3.svg.arc()
          //     .outerRadius(radius - 80)
          //     .innerRadius(radius - 40);

          // var pie = d3.layout.pie()
          //     .sort(null)
          //     .value(function(d, index) { return d.value});

          // tip
          //    .html(function(d) {
          //        return d.data.label+ " : " +  d.value;
          //    });

          // /* ------- PIE SLICES -------*/
          // var slice = svg_prog_pie.select(".slices").selectAll("path.slice")
          //     .data(pie(numbers), key);

          // console.log("hey there");
          // console.log(slice);

          // slice.enter()
          //     .insert("path")
          //     .style("fill", function(d) { return colorscale(d.data.label); })
          //     .attr("class", "slice");

          // slice       
          //     .transition().duration(1000)
          //     .attrTween("d", function(d) {
          //         this._current = this._current || d;
          //         var interpolate = d3.interpolate(this._current, d);
          //         this._current = interpolate(0);
          //         return function(t) {
          //             return arc(interpolate(t));
          //         };
          //     })

          // slice.exit()
          //     .remove();

          // console.log(slice);

          /* ------- TEXT LABELS -------*/

          // var text_prog_pie = svg_prog_pie.select(".labels").selectAll("text")
          //     .data(pie(numbers), key);

          // text_prog_pie.enter()
          //     .append("text")
          //     .attr("dy", ".35em")
          //     .text(function(d) {
          //         return d.data.label;
          //     });
          
          // function midAngle(d){
          //     return d.startAngle + (d.endAngle - d.startAngle)/2;
          // }

          // text_prog_pie.transition().duration(1000)
          //     .attrTween("transform", function(d) {
          //         this._current = this._current || d;
          //         var interpolate = d3.interpolate(this._current, d);
          //         this._current = interpolate(0);
          //         return function(t) {
          //             var d2 = interpolate(t);
          //             var pos = outerArc.centroid(d2);
          //             pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
          //             return "translate("+ pos +")";
          //         };
          //     })
          //     .styleTween("text-anchor", function(d){
          //         this._current = this._current || d;
          //         var interpolate = d3.interpolate(this._current, d);
          //         this._current = interpolate(0);
          //         return function(t) {
          //             var d2 = interpolate(t);
          //             return midAngle(d2) < Math.PI ? "start":"end";
          //         };
          //     });

          // text_prog_pie.exit()
          //     .remove();

          /* ------- SLICE TO TEXT POLYLINES -------*/

          // var polyline = svg.select(".lines").selectAll("polyline")
          //     .data(pie(data));
          
          // polyline.enter()
          //     .append("polyline");

          // polyline.transition().duration(1000)
          //     .attrTween("points", function(d){
          //         this._current = this._current || d;
          //         var interpolate = d3.interpolate(this._current, d);
          //         this._current = interpolate(0);
          //         return function(t) {
          //             var d2 = interpolate(t);
          //             var pos = outerArc.centroid(d2);
          //             pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          //             return [arc.centroid(d2), outerArc.centroid(d2), pos];
          //         };          
          //     });
          
          // polyline.exit()
          //     .remove();

          // var g = svg_prog_pie.selectAll(".arc")
          //     .data(pie(numbers))
          //     .enter().append("g")
          //     .attr("class", "arc");

          // g.append("path")
          //     .attr("d", arc)
          //     .style("fill", function(d) { return colorscale(d.data.label)})
          //     .on('mouseover', tip.show)
          //     .on('mouseout', tip.hide);

          // g.append("text")
          //     .attr("transform", function(d) { return "translate(" + arcText.centroid(d) +")"; })
          //     .attr("dy", ".35em")
          //     .text(function(d) {
          //       console.log(d);
          //       if (d.data.value > 0) {
          //         return d.data.label + ": " + d.data.value;
          //       }
          //     });

      });
  };

};