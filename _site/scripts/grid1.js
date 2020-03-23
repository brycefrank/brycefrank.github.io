var grid_height = 6;
var grid_width = 6;
var cell_size = 20;
var grid_buffer = 0;
var between = 3;

var gb1 = d3.select("#gridBody1")
    .append("svg")
    .attr("width", cell_size * grid_width + grid_buffer + "px")
    .attr("height", cell_size * grid_height + grid_buffer + "px");

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "white")
    .style("stroke", "black")
    .style("opacity", 0);

var color_scale = d3.scaleSequential().domain([1, 7]).interpolator(d3.interpolateViridis);
var cells = d3.csv("/assets/cells.csv");

cells.then(function(d) {
    gb1.selectAll("rect")
    .data(d)
    .enter()
    .append("rect")
    .attr("y", function(d) {return (d.j % grid_width) * cell_size + grid_buffer; })
    .attr("x", function(d) { return (d.i % grid_height) * cell_size + grid_buffer; })
    .attr("fill", function(d) { return color_scale(d.y)})
    .attr('width', cell_size - between)
    .attr('height', cell_size - between)
       .on("mouseover", function (d) {
        d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", 2)

        div.transition()
            .duration(30)
            .style("opacity", 0.9);
        div .html(d.y)
            .style("left", (d3.event.pageX - 10) + "px")
            .style("top", (d3.event.pageY - 35) + "px")
    })
    .on("mouseout", function(d){
        d3.select(this)
            .style("stroke", "none")

        div.transition()
            .duration(30)
            .style("opacity", 0)
    });
})