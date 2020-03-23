
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

function begin_simulation(M) {
    for (var i=0; i < M; i++) {

    }
}

function select_sample(selection) {
    selection
        .selectAll('rect')
        .attr("fill", "black")

}