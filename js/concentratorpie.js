var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width = 500,
    height = 300,
    radius = Math.min(width, height) / 2;

var numbers = [
    {label: 'Concentrators', value: 174},
    {label: 'Non-Concentrators', value: 732}
];

var svg = d3.select("#chart-area2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + width/2+ "," + height/2 + ")");

console.log(radius);

var colorscale = d3.scale.ordinal()
    .range(["#FF0000", "#FF0000"]);


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
    .outerRadius(radius - 75)
    .innerRadius(radius - 40);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d, index) { return d.value});

var g = svg.selectAll(".arc")
    .data(pie(numbers))

    .enter().append("g")
    .attr("class", "arc");

svg.append("g")
    .attr("class", "labels");

svg.append("g")
    .attr("class", "lines");

g.append("path")
    .attr("d", arc)
    .style("fill", function(d) { return colorscale(d.data.label)})
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

g.append("text")
    .attr("transform", function(d) { return "translate(" + arcText.centroid(d) +")"; })
    .attr("dy", ".35em")
    .text(function(d) {return d.data.label + ": " + d.data.value});
