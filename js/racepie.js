/**
 * Created by Thomas on 4/12/2016.
 */
var margin = {top: 80, right: 0, bottom: 60, left: 60};

var width = 400,
    height = 300,
    radius = Math.min(width, height) / 2;

var numbers = [
    {label: 'American Indian or Alaskan Native', value: 4},
    {label: 'Asian', value: 322},
    {label: 'Black/African American', value: 39},
    {label: 'Caucasian', value: 372},
    {label: 'Hispanic or Latino', value: 35},
    {label: 'Other', value: 134}
];

var svg = d3.select("#chart-area3").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + width/2+ "," + height/2 + ")");

console.log(radius);

var colorscale = d3.scale.ordinal()
    //.range(["#A8BA95", "#AA6C64", "#EBDFE8", "#560000", "#DEA27A", "#1C5672"]);
    .range(["#c9a19c", "#AA6C64", "#ffcccc", "#560000", "#82acc9", "#1C5672"]);

console.log(colorscale("Male"));
console.log(colorscale("Female"));

var tip = d3.tip()
   .attr('class', 'd3-tip')
   .offset([-10, 0]);

svg.call(tip);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var arcText = d3.svg.arc()
    .outerRadius(radius + 30)
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
    .style("text-anchor", function (d) {
        console.log(d.label);
        if (d.data.label == "Hispanic or Latino" || d.data.label == "Other" || d.data.label == "Caucasian") {
            return "end";
        } else {
            return "start";
        }
    })
    .text(function(d) {return d.data.label + ": " + d.data.value});
