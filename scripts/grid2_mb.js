var gb2 = d3.select("#gridBody2")
    .append("svg")
    .attr("width", cell_size * grid_width + grid_buffer + "px")
    .attr("height", cell_size * grid_height + grid_buffer + "px")

var pop_vals = [2,4,1,5,6,7,3,2,4,1,5,1,6,
                1, 6,8,1,5,1,4,6,5,3,1,2,2,6,
                7,3,2,4,2,3,8,4,4];
var M = 300;
var tau = 135;
var mu = tau/36;

var fixed_samp = [4, 34, 8, 17];
var color_scale = d3.scaleSequential().domain([1, 7]).interpolator(d3.interpolateViridis);

function in_array(array, x) {
    for (var i=0; i < array.length; i++)  {
        if(array[i] == x) {
            return true;
        }
    }
    return false;
}

var spareRandom = null;

function normalRandom()
{
	var val, u, v, s, mul;

	if(spareRandom !== null)
	{
		val = spareRandom;
		spareRandom = null;
	}
	else
	{
		do
		{
			u = Math.random()*2-1;
			v = Math.random()*2-1;

			s = u*u+v*v;
		} while(s === 0 || s >= 1);

		mul = Math.sqrt(-2 * Math.log(s) / s);

		val = u * mul;
		spareRandom = v * mul;
	}
	
	return val;
}

function normalRandomScaled(mean, stddev) {
    var r = normalRandom();
	r = r * stddev + mean;
	return r;
}

function normalSkew(zeta, omega, alpha=0) {
    var u0 = normalRandom(),
    v = normalRandom();

    if(alpha === 0) {
        return(zeta + omega + u0);
    }

    const delta = alpha / Math.sqrt(1 + alpha * alpha);
    const u1 = delta * u0 + Math.sqrt(1 - delta * delta) * v;
    const z = u0 >= 0? u1: -u1;
    return(zeta + omega * z)
}


function generate_pop(selection) {
    var tau_hat = 0;
    var tau_pop = 0;
    var new_pop = [];
    var sample_mean = 0;

    for(var i=0; i<36; i++) {
        var y_i = normalRandomScaled(mu, 2)
        new_pop[i] = y_i
        tau_pop += y_i
    }

    for(var i =0; i<4; i++) {
        sample_mean += (1/4) * new_pop[fixed_samp[i]]
    }

    for(var i=0; i<36; i++) {
        if(fixed_samp.includes(i)) {
            tau_hat += new_pop[i]
        } else {
            tau_hat += sample_mean
        }
    }

    selection
        .selectAll('rect')
        .attr("fill", function(d, i) { return color_scale(new_pop[i])})

    return([tau_pop, tau_hat])
}

function begin_simulation(selection, M) {
    var i = 0;
    while(i < M) {
        (function (i) {
            setTimeout(function () {
                generate_pop(selection)
            }, 100*i);
        })(i);
        i = i + 1;
    }
}

var running = false;


var margin = {top: 15, right: 15, bottom: 30, left: 45}
, width =  250 - margin.left - margin.right // Use the window's width 
, height = 250 - margin.top - margin.bottom; // Use the window's height

var est_svg = d3.select('#estBody')
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
    .style('stroke', 'none')
    .filter(function (d, i) {
        if (fixed_samp.includes(i)){
            return fixed_samp.includes(i)
        }
    })
    .style('stroke', 'red')
    .style('stroke-width', 2);

    var xScale = d3.scaleLinear()
        .domain([0, 300])
        .range([0, width])

    var yScale = d3.scaleLinear()
        .domain([100, 180])
        .range([height, 0]);

    var legend = est_svg.append("g")
        .attr("class","legend")
        .attr("transform","translate(" + (width-80) + "," + 0 + ")")

    est_svg.append("g")
        .attr('class', 'lab')
        .attr("transform", "translate(" + 140 + "," + -10 + ")")
        .append('text')
        .text("$\\small{E_{M}[\\hat{\\tilde{\\tau}}]}$")
        .attr('font-size', '2')

    est_svg.append("g")
        .attr('class', 'lab')
        .attr("transform", "translate(" + 140 + "," + 15 + ")")
        .append('text')
        .text("$\\small{\\tau}$")
        .attr('font-size', '2')

    est_svg.append("g")
        .attr('class', 'lab')
        .attr("transform", "translate(" + 140 + "," + 30 + ")")
        .append('text')
        .text("$\\small{\\tilde{\\tau}}$")
        .attr('font-size', '2')

    legend
        .append("line")
            .attr("x1", 0)
            .attr("x2", 20)
            .attr("y1", 0)
            .attr("y2", 0)
            .attr('stroke', 'black')
            .text('this')

    legend
        .append("line")
            .attr("x1", 0)
            .attr("x2", 20)
            .attr("y1", 20)
            .attr("y2", 20)
            .attr('stroke', 'black')
            .attr('stroke-dasharray', '4')

    legend
        .append("line")
            .attr("x1", 0)
            .attr("x2", 20)
            .attr("y1", 40)
            .attr("y2", 40)
            .attr('stroke', 'red')
            .attr('opacity', '0.3')

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
        return(generate_pop(gb2))
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

    

    setTimeout(() => {

    MathJax.Hub.Config({
        tex2jax: {
            inlineMath: [ ['$','$'], ["\\(","\\)"] ],
            processEscapes: true
        }
    });
    
    MathJax.Hub.Register.StartupHook("End", function() {
        setTimeout(() => {
              est_svg.selectAll('.lab').each(function(){
              var self = d3.select(this),
                  g = self.select('text>span>svg');

              g.remove();
              self.append(function(){
                return g.node();
              });
            });
        }, 1);
        });
    
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, est_svg.node()]);
    }, 1);
})


function update_taus(taus, tau_hats, est_plot, line) {
    est_plot
        .select('#tau_path')
        .remove()
    
    est_plot
        .select('#tau_hat_path')
        .remove()

    est_plot
        .append('g')
        .attr('id', 'tau_path')
        .append('path')
        .attr('d', function(d) { return(line(taus));})
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('opacity', '0.3');

    est_plot
        .append('g')
        .attr('id', 'tau_hat_path')
        .append('path')
        .attr('d', function(d) { return(line(tau_hats));})
        .attr('fill', 'none')
        .attr('stroke', 'black');
}

function Simulator(render, est_plot, line) {
    var timeout;

    this.start = start;
    this.stop = stop;
    this.est_plot = est_plot;
    this.line = line;

    var tau_hats = [];
    var taus = [];
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

        var render_out = render();

        taus.push(render_out[0])
        tau_hats.push(render_out[1])
        get_tau_mean(tau_hats)
        update_taus(taus, tau_means, est_plot, line)
    }

}
