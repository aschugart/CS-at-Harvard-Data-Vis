var border = 1;
var bordercolor='black';

var frequency_list = [{"text":"study","size":40},{"text":"motion","size":15},{"text":"forces","size":10}];

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width_wordcloud = 500 - margin.left - margin.right,
    height_wordcloud = 350 - margin.top - margin.bottom;

var svg_wordcloud1 = d3.select("#wordcloud1").append("svg")
    .attr("width", width_wordcloud + margin.left + margin.right)
    .attr("height", height_wordcloud + margin.top + margin.bottom)
    .attr("class", "wordcloud1")
    .attr("style", "outline: thin solid black;")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data;

loadData();

function loadData() {
    d3.json("data/words.json", function(error, json) {
        if (error) return console.warn(error);
        data = json;
        console.log(data);
    });
    UpdateVisualization();
};

// Default values for wordcloud1
var selected1_gender = "all";
var selected1_pcsb = "all";
var selected1_race = "all";

function UpdateVisualization() {
    // Get the filtered array
    selected1_gender = d3.select('input[name="gender1option"]:checked').node().value
    selected1_pcsb = d3.select('input[name="pcsb1option"]:checked').node().value
    selected1_race = d3.select('input[name="race1option"]:checked').node().value
    console.log(selected1_gender);
    console.log(selected1_pcsb);
    console.log(selected1_race);


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
        // d3.select("#wordcloud1")
            // .attr("width", 500)
            // .attr("height", 350)
            // .attr("class", "wordcloud1")
            // .attr("style", "outline: thin solid black;")
            // .append("g")
        svg_wordcloud1
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
}