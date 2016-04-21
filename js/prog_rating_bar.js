/**
 * Created by Alex on 09/04/2016.
 */

var margin = {top: 100, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y_prog = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#A6D8DE", "#F9F1B5"]);

var xAxis_prog = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

//var formatPercent = d3.format(".0%");

var yAxis_prog = d3.svg.axis()
    .scale(y_prog)
    .orient("left")
    //.tickFormat(formatPercent);
    .tickFormat(d3.format(".2s"));

var svg_prog_rating = d3.select("#prog_rating_bar").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);

svg_prog_rating.call(tip);

d3.csv("data/stacked_prog_rating_percentage2.csv", function(error, data) {
    if (error) throw error;

    var genderNames = d3.keys(data[0]).filter(function(key) { return key !== "Rating"; });
    console.log(genderNames);

    data.forEach(function(d) {
        d.genders = genderNames.map(function(name) { return {name: name, value: +d[name]}; });
    });

    console.log(data);

    x0.domain(data.map(function(d) { return d["Rating"]; }));
    x1.domain(genderNames).rangeRoundBands([0, x0.rangeBand()]);
    y_prog.domain([0, 100]);

    tip
        .html(function(d) {

            return d.name + " : " +  d.value + "%";
        });

    svg_prog_rating.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis_prog);

    svg_prog_rating.append("g")
        .attr("class", "y axis")
        .call(yAxis_prog)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Percentage of the gender who rated themselves in each category");

    var state = svg_prog_rating.selectAll(".state")
        .data(data)
        .enter().append("g")
        .attr("class", "state")
        .attr("transform", function(d) { return "translate(" + x0(d["Rating"]) + ",0)"; });

    state.selectAll("rect")
        .data(function(d) { return d.genders; })
        .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.name); })
        .attr("y", function(d) { return y_prog(d.value); })
        .attr("height", function(d) { return height - y_prog(d.value); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        // .on('click', showPie)
        .style("fill", function(d) { return color(d.name); });

    var legend_prog_rating = svg_prog_rating.selectAll(".legend")
        .data(genderNames.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend_prog_rating.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend_prog_rating.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

});