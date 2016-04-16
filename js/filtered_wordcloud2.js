var border = 1;
var bordercolor='black';

var frequency_list = [{"text":"study","size":40},{"text":"motion","size":15},{"text":"forces","size":10}];


var color2 = d3.scale.linear()
        .domain([0,1,2,3,4,5,6,10,15,20,100])
        .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

d3.layout.cloud().size([800, 300])
    .words(frequency_list)
    .rotate(0)
    .fontSize(function(d) { return d.size; })
    .on("end", draw)
    .start();

function draw(words) {
    d3.select("#wordcloud2").append("svg")
        .attr("width", 500)
        .attr("height", 350)
        .attr("class", "wordcloud2")
        .attr("style", "outline: thin solid black;")
        .append("g")
        // without the transform, words words would get cutoff to the left and top, they would
        // appear outside of the SVG area
        .attr("transform", "translate(110,200)")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("fill", function(d, i) { return color2(i); })
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}