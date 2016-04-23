
// SVG drawing area
var margin_line = {top: 20, right: 20, bottom: 40, left: 60};
var width_line = 700 - margin_line.left - margin_line.right,
        height_line = 450 - margin_line.top - margin_line.bottom;
var svg = d3.select("#chart-area_line").append("svg")
        .attr("width", width_line + margin_line.left + margin_line.right)
        .attr("height", height_line + margin_line.top + margin_line.bottom)
    .append("g")
        .attr("transform", "translate(" + margin_line.left + "," + margin_line.top + ")");


// svg.append("defs").attr("id", "mdef")
//     .append("pattern").attr("id", "image").attr("x", 0).attr("y", 0).attr("height", 20).attr("width", 20)
//     .append("image").attr("x", 0).attr("y", 0).attr("height", 20).attr("width", 20).attr("xlink:href", "http://images.clipartpanda.com/soccer-ball-clipart-soccer-ball-clip-art-4.png");



// Initialize data
loadData();

// FIFA world cup
var data_line;



// Scales
var xScale_line = d3.time.scale()
    .range([0, width_line]);
var yScale_line = d3.scale.linear()
    .range([height_line, 0]);

// Axes
var xAxis_line = d3.svg.axis()
    .scale(xScale_line)
    .orient("bottom")
    .ticks(5);
var x_group = svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0,"+(height_line)+")");

var yAxis_line = d3.svg.axis()
    .scale(yScale_line)
    .orient("left")
    .ticks(8);
var y_group = svg.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", "translate(0,0)");
//.call(yAxis);

var y_title = y_group.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 0)
    .attr("dy", "1.5em")
    .style("text-anchor", "end");

// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

// Load CSV file
function loadData() {
    d3.csv("data/RatioNewData.csv", function(error, csv) {

        csv.forEach(function(d){
            // Convert string to 'date object'
            d.Year = formatDate.parse(d.Year);
            
            // Convert numeric values to 'numbers'
            d.Students = +d.Students;
            d.Faculty = +d.Faculty;
            d.Ratio = +d.Ratio;
        });

        // Store csv data in global variable
        data_line = csv;

        // Draw the visualization for the first time
        updateVisualization();
    });
}

var chartValue;
// var timeMin;
// var timeMax;
d3.select("#data-choice").on("change", function(){
    console.log("New selection.");
    updateVisualization();});

var transitionDuration = 800;



//-----------------------------------------------------------------------------
// Initializing Line chart
//-----------------------------------------------------------------------------

// Initialize data
chartValue = d3.select("#data-choice").property("value");
var line_line = d3.svg.line().interpolate("monotone")
    .x(function (d) {return xScale_line(d.Year);})
    .y(function (d) {return yScale_line(d[chartValue]);});

// Draw initial line
svg.selectAll('.line-path').data([data_line]).enter().append('path').attr("class", "line path");



//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// UPDATE FUNCTION
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------

// Render visualization
function updateVisualization() {
    
    console.log(data_line);
    //-----------------------------------------------------------------------------
    // Initialize
    //-----------------------------------------------------------------------------

    var formatDate = d3.time.format("%Y");

    // Domains
    chartValue = d3.select("#data-choice").property("value");
    //console.log(d3.select("#data-choice").property("text"));
    //xScale.domain(d3.extent(data, function(d){return d.YEAR}));
    xScale_line.domain(d3.extent(data_line, function(d){return d.Year;}));
    yScale_line.domain([0, d3.max(data_line, function(d){return d[chartValue]})]);

    //-----------------------------------------------------------------------------
    // Line chart
    //-----------------------------------------------------------------------------

    // Initialize data
    var line_line = d3.svg.line()
        .x(function (d) {return xScale_line(d.Year);})
        .y(function (d) {return yScale_line(d[chartValue]);});

    // Initialize
    //path = svg.selectAll('path');

    // Update
    //path.transition().duration(transitionDuration).attr("class", "line path").attr('d', line(data));
    svg.selectAll('path').transition().style("stroke-width", "0px").transition().duration(200).delay(500).attr("class", "line path").style("stroke-width", "2.5px").attr('d', line_line(data_line));


    //-----------------------------------------------------------------------------
    // Circles
    //-----------------------------------------------------------------------------

    var sel = document.getElementById('data-choice');
    y_text = sel.options[sel.selectedIndex].text;
    var formatDate

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-15, 0])
        .html(function(f) {
            return "<emph>"
            +y_text+":</emph> <span style='color:white'>" + 
            d3.format(",")(f[chartValue]) + "</span>";
        });


    // Key function / data-join
    var circles = svg.selectAll("circle")
        .data(data_line, function(d, index){return d.Year});

    circles.enter()
        .append("circle")
        .attr("class", "circle")
        .attr("fill", "#707086")
        .attr("cx", function(d) { return xScale_line(d.Year); })
        .attr("r", 10)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    // Update
    circles
        .on("click", showEdition)
        .style("opacity", 0.9)
        .transition()
        .duration(transitionDuration)
        .attr("cx", function(d) { return xScale_line(d.Year); })
        .attr("cy", function(d) {return yScale_line(d[chartValue])})
        .style("opacity", 0.9)
        .transition()
        .duration(transitionDuration)
        .call(tip);

    // Enter



    // Exit
    circles.exit().remove();


    //-----------------------------------------------------------------------------
    // Axis update
    //-----------------------------------------------------------------------------

    // Axis
    x_group
        .transition()
        .duration(transitionDuration)
        .call(xAxis_line)
        .selectAll("text")
        .style("text-anchor", "middle")
        .attr("dx", 0);
    y_group
        .transition()
        .duration(transitionDuration)
        .call(yAxis_line);

    // Text for y_title
    y_title
        .transition()
        .duration(transitionDuration)
        .text(y_text);



}


//Show details for a specific FIFA World Cup
var showEdition = function(d){
 console.log(d);
 $("#totalfaculty").text(d.Faculty);
 $("#totalstudents").text(d.Students);
 $("#mfaculty").text(d.FMinority);
 $("#mstudents").text(d.SMinority);
 $("#ffaculty").text(d.FWomen);
 $("#fstudents").text(d.SWomen);
 d3.select(".selected").classed("selected", false);
 d3.select(this).classed("selected", true);
};



// // SVG drawing area
// var margin = {top: 40, right: 40, bottom: 40, left: 60};
// var width = $("#chart-area").width() - margin.left - margin.right,
//         height = 450 - margin.top - margin.bottom;
// var svgg = d3.select("#chart-area").append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// svgg.append("defs").attr("id", "mdef")
//     .append("pattern").attr("id", "image").attr("x", 0).attr("y", 0).attr("height", 20).attr("width", 20)
//     .append("image").attr("x", 0).attr("y", 0).attr("height", 20).attr("width", 20).attr("xlink:href", "http://images.clipartpanda.com/soccer-ball-clipart-soccer-ball-clip-art-4.png");



// // Initialize data
// loadData();

// // FIFA world cup
// var data;



// // Scales
// var xScalee = d3.time.scale()
//     .range([0, width]);
// var yScalee = d3.scale.linear()
//     .range([height, 0]);

// // Axes
// var xAxiss = d3.svg.axis()
//     .scale(xScalee)
//     .orient("bottom")
//     .ticks(5);
// var x_group = svg.append("g")
//     .attr("class", "axis x-axis")
//     .attr("transform", "translate(0,"+(height)+")");

// var yAxiss = d3.svg.axis()
//     .scale(yScalee)
//     .orient("left")
//     .ticks(8);
// var y_group = svg.append("g")
//     .attr("class", "axis y-axis")
//     .attr("transform", "translate(0,0)");
// //.call(yAxis);

// var y_title = y_group.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0)
//     .attr("x", 0)
//     .attr("dy", "1.5em")
//     .style("text-anchor", "end");

// // Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
// var formatDate = d3.time.format("%Y");

// // Load CSV file
// function loadData() {
//     d3.csv("data/ratioall.csv", function(error, csv) {

//         csv.forEach(function(d){
//             // Convert string to 'date object'
//             //d.Year = formatDate.parse(d.Year);
            
//             // Convert numeric values to 'numbers'
//             d.Faculty = +d.Faculty;
//             d.Students = +d.Students;
//             d.Ratio = +d.Ratio;
//         });

//         // Store csv data in global variable
//         data = csv;

//         // Draw the visualization for the first time
//         updateVisualization();
//     });
// }

// var chartValue;
// var timeMin;
// var timeMax;
// d3.select("#data-choice").on("change", function(){
//     console.log("New selection.");
//     updateVisualization();});
// d3.select('#submit').on("click", function(){updateVisualization(); console.log("clicked");});

// var transitionDuration = 800;



// //-----------------------------------------------------------------------------
// // Initializing Line chart
// //-----------------------------------------------------------------------------

// // Initialize data
// chartValue = d3.select("#data-choice").property("value");
// var linee = d3.svg.line().interpolate("monotone")
//     .x(function (d) {return xScale(d.Year);})
//     .y(function (d) {return yScale(d[chartValue]);});

// // Draw initial line
// svg.selectAll('path').data([data]).enter().append('path').attr("class", "line path");



// //-----------------------------------------------------------------------------
// //-----------------------------------------------------------------------------
// // UPDATE FUNCTION
// //-----------------------------------------------------------------------------
// //-----------------------------------------------------------------------------

// // Render visualization
// function updateVisualization() {
    
//     console.log(data);
//     //-----------------------------------------------------------------------------
//     // Initialize
//     //-----------------------------------------------------------------------------

//     var formatDate = d3.time.format("%Y");
//     timeMin = d3.select("#beginyear").property("value");
//     timeMax = d3.select("#endyear").property("value");
//     console.log("Data before:" + timeMin + " and " + timeMax);
//     if (!timeMin){timeMin = "1930";} else {}
//     if (!timeMax){timeMax = "2014";} else {}
//     console.log("Data after:" +timeMin + " and " + timeMax);
//     if (+timeMin<1000){
//         alert("Error: Please make sure your start year is before your end year.");
//         return;}
//     if (+timeMin>=+timeMax){
//         alert("Error: Please make sure your start year is before your end year.");
//         return;}


//     console.log(data.length);
//     data.sort(function(a, b) { return b.Year - a.Year; });
//     var filteredd = data.filter(function(d, index){return (d.Year>=formatDate.parse(timeMin) &&d.Year<=formatDate.parse(timeMax));});
//     console.log(filteredd.length);

//     // Domains
//     chartValue = d3.select("#data-choice").property("value");
//     //console.log(d3.select("#data-choice").property("text"));
//     //xScale.domain(d3.extent(data, function(d){return d.YEAR}));
//     xScalee.domain(d3.extent(filteredd, function(d){return d.Year;}));
//     yScalee.domain([0, d3.max(filteredd, function(d){return d[chartValue]})]);

//     //-----------------------------------------------------------------------------
//     // Line chart
//     //-----------------------------------------------------------------------------

//     // Initialize data
//     var linee = d3.svg.line().interpolate("monotone")
//         .x(function (d) {return xScalee(d.Year);})
//         .y(function (d) {return yScalee(d[chartValue]);});

//     // Initialize
//     //path = svg.selectAll('path');

//     // Update
//     //path.transition().duration(transitionDuration).attr("class", "line path").attr('d', line(data));
//     svg.selectAll('path').transition().style("stroke-width", "0px").transition().duration(200).delay(500).attr("class", "line path").style("stroke-width", "2.5px").attr('d', line(filteredd));


//     //-----------------------------------------------------------------------------
//     // Circles
//     //-----------------------------------------------------------------------------

//     var sel = document.getElementById('data-choice');
//     y_text = sel.options[sel.selectedIndex].text;

//     var tip = d3.tip()
//         .attr('class', 'd3-tip')
//         .offset([-15, 0])
//         .html(function(f) {
//             return "<emph>"+ f.EDITION+"</emph></br>" +
//                 "<emph>"+y_text+":</emph> <span style='color:white'>" + d3.format(",")(f[chartValue]) + "</span>";
//         });


//     // Key function / data-join
//     var circles = svg.selectAll("circle")
//         .data(filteredd, function(d, index){return d.Year});

//     circles.enter()
//         .append("circle")
//         .attr("class", "circle")
//         .attr("fill", "#707086")
//         .attr("cx", function(d) { return xScalee(d.Year); })
//         .attr("r", 10)
//         .on('mouseover', tip.show)
//         .on('mouseout', tip.hide);

//     // Update
//     // circles
//     //     .on("click", showEdition)
//     //     .style("opacity", 0.5)
//     //     .transition()
//     //     .duration(transitionDuration)
//     //     .attr("cx", function(d) { return xScale(d.Year); })
//     //     .attr("cy", function(d) {return yScale(d[chartValue])})
//     //     .style("opacity", 0.8)
//     //     .transition()
//     //     .duration(transitionDuration)
//     //     .call(tip);

//     // Enter



//     // Exit
//     circles.exit().remove();


//     //-----------------------------------------------------------------------------
//     // Axis update
//     //-----------------------------------------------------------------------------

//     // Axis
//     x_group
//         .transition()
//         .duration(transitionDuration)
//         .call(xAxiss)
//         .selectAll("text")
//         .style("text-anchor", "middle")
//         .attr("dx", 0);
//     y_group
//         .transition()
//         .duration(transitionDuration)
//         .call(yAxiss);

//     // Text for y_title
//     y_title
//         .transition()
//         .duration(transitionDuration)
//         .text(y_text);



// }


// // // Show details for a specific FIFA World Cup
// // var showEdition = function(d){
// //     console.log(d);
// //     $("#edition").text(d.EDITION);
// //     $("#winner").text(d.WINNER);
// //     $("#goals").text(d.GOALS);
// //     $("#averagegoals").text(d.AVERAGE_GOALS);
// //     $("#matches").text(d.MATCHES);
// //     $("#teams").text(d.TEAMS);
// //     $("#averageattendance").text(d3.format(",")(d.AVERAGE_ATTENDANCE));
// //     d3.select(".selected").classed("selected", false);
// //     d3.select(this).classed("selected", true);
// // };
