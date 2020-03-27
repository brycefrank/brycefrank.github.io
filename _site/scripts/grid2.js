var gb2 = d3.select("#gridBody2")
    .append("svg")
    .attr("width", cell_size * grid_width + grid_buffer + "px")
    .attr("height", cell_size * grid_height + grid_buffer + "px")

var pop_vals = [2,4,1,5,6,7,3,2,4,1,5,1,6,
                1, 6,8,1,5,1,4,6,5,3,1,2,2,6,
                7,3,2,4,2,3,8,4,4];
var M = 300;
var tau = 135;
var color_scale = d3.scaleSequential().domain([1, 7]).interpolator(d3.interpolateViridis);

function in_array(array, x) {
    for (var i=0; i < array.length; i++)  {
        if(array[i] == x) {
            return true;
        }
    }
    return false;
}

function srswor(n, N) {
    var ixs = [];

    while(ixs.length < n) {
        var rand  = Math.floor(Math.random() * N);
        if (in_array(ixs, rand) == false) {
            ixs.push(rand)
        }
    }
    return(ixs)
}

function select_sample(selection) {
    var indices = srswor(4, 36);
    var pi_i = 4 / 36;
    var tau_hat = 0;

    // Highlight selected cells in red
    selection
        .selectAll('rect')
        .style('stroke', 'none')
        .filter(function (d, i) {
            if (indices.includes(i)){
                tau_hat += pop_vals[i] / pi_i
                return indices.includes(i)
            }
        })
        .style('stroke', 'red')
        .style('stroke-width', 2);

    
    return(tau_hat)
}

function begin_simulation(selection, M) {
    var i = 0;
    while(i < M) {
        (function (i) {
            setTimeout(function () {
                select_sample(selection)
            }, 100*i);
        })(i);
        i = i + 1;
    }
}

var running = false;


//TODO this is really just grid1 again. is there a way to generalize?
cells.then(function(d) {
    gb2.selectAll("rect")
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

    var margin = {top: 15, right: 15, bottom: 30, left: 45}
    , width =  250 - margin.left - margin.right // Use the window's width 
    , height = 250 - margin.top - margin.bottom; // Use the window's height


    var xScale = d3.scaleLinear()
        .domain([0, 300])
        .range([0, width])

    var yScale = d3.scaleLinear()
        .domain([100, 180])
        .range([height, 0]);


    var est_svg = d3.select('#estBody')
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    est_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).ticks(5)); // Create an axis component with d3.axisBottom

    est_svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    est_svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 15) + ")")
      .style("text-anchor", "middle")
      .text("M");

    est_svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Expected Value"); 

    est_svg
        .append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y2", yScale(tau))
        .attr("y1", yScale(tau))
        .attr('stroke', 'black')
        .attr('stroke-dasharray', '4');

    var line = d3.line()
        .x(function(d, i) {return xScale(i);})
        .y(function(d, i) {return yScale(d);});
    

    var timer = new Simulator(function() {
        return(select_sample(gb2))
    }, est_svg, line);


    d3.select("#startButton")
        .on("click", function() {
            if (running) {
                timer.stop();
                d3.select(this)
                    .text('Start')
                running = false;
            } else {
                timer.start();
                d3.select(this)
                    .text('Stop')
                running = true;
            }
        })



})


function update_ests(tau_hats, est_plot, line) {
    est_plot
        .append('path')
        .attr('d', function(d) { return(line(tau_hats));})
        .attr('fill', 'none')
        .attr('stroke', 'black');
}

function Simulator(render, est_plot, line) {
    var timeout;

    this.start = start;
    this.stop = stop;
    var tau_hats = [];
    this.est_plot = est_plot;
    this.line = line;

    var tau_means = [];

    function get_tau_mean(tau_hats) {
        var sum = tau_hats.reduce((previous, current) => current += previous);
        var avg = sum / tau_hats.length
        tau_means.push(avg);
    }

    function start() {
        timeout = setTimeout(loop, 0);
    }

    function stop() {
        clearTimeout(timeout);
    }

    function loop() {
        timeout = setTimeout(loop, 120);
        console.log(tau_hats)
        tau_hats.push(render())
        get_tau_mean(tau_hats)
        update_ests(tau_means, est_plot, line)
    }

}