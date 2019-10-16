



const url = "https://emidius.mi.ingv.it/fdsnws/event/1/query?starttime=1950-01-01T00:00:00&endtime=2014-12-31T23:59:59&orderby=time-asc&limit=4000&format=text";



// Create a timer
// setInterval(function() {
//   redraw();  // call the function you created to update the chart
// }, 1500);

  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");


  var path = d3.geoPath();
  var projection = d3.geoMercator()
                     .scale(70)
                     .center([0,20])
                     .translate([width / 2, height / 2]);


  var data = d3.map();
  var colorScale = d3.scaleThreshold()
                     .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
                     .range(d3.schemeBlues[7]);


// Load data




// function redraw() {
//   // Update…
//
// }
