
const url = "https://emidius.mi.ingv.it/fdsnws/event/1/query?starttime=1950-01-01T00:00:00&endtime=2014-12-31T23:59:59&orderby=time-asc&limit=4000&format=text";
const width = 900;
const height = 600;

let projection = d3.geoMercator();

let svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

let path = d3.geoPath()
    .projection(projection);

let g = svg.append("g");

d3.json("world-110m2.json", function(error, topology) {
    g.selectAll("path")
      .data(topojson.object(topology, topology.objects.countries).geometries)
    .enter()
      .append("path")
      .attr("d", path)
        });


// Create a timer
// setInterval(function() {
//   redraw();  // call the function you created to update the chart
// }, 1500);



// Load data




// function redraw() {
//   // Update…
//
// }
