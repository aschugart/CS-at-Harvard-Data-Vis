/**
 * Created by Thomas on 4/12/2016.
 */
var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width = 500,
    height = 300,
    radius = Math.min(width, height) / 2;

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

console.log(radius);

var colorscale = d3.scale.ordinal()
    //.domain(["American Indian or Alaskan Native", "Asian", "Black or African American", "Caucasian", "Hispanic or Latino", "Other"])
    .range(["#333", "#DAE2DF", "#33CC35", "#00526B", "#8B3547", "#48B0AC"]);

var tip = d3.tip()
   .attr('class', 'd3-tip')
   .offset([-10, 0]);

svg.call(tip);

tip
   .html(function(d) {
       return d.data.label+ " : " +  d.value;
   });

console.log(colorscale("Male"));
console.log(colorscale("Female"));

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var arcText = d3.svg.arc()
    .outerRadius(radius - 80)
    .innerRadius(radius - 40);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d, index) { return d.value});

var g = svg.selectAll(".arc")
    .data(pie(numbers))

    .enter().append("g")
    .attr("class", "arc");

g.append("path")
    .attr("d", arc)
    .style("fill", function(d) { return colorscale(d.data.label)})
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);
;

g.append("text")
    .attr("transform", function(d) { return "translate(" + arcText.centroid(d) +")"; })
    .attr("dy", ".35em")
    .text(function(d) {return d.data.label + ": " + d.data.value});
