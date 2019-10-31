const urlEarthquakes = "https://emidius.mi.ingv.it/fdsnws/event/1/query?starttime=1967-01-01T00:00:00&endtime=2014-12-31T23:59:59&orderby=time-asc&limit=4000&format=text";

const urlItaly = "./data/limits_IT_regions.geojson";

let canvas = d3.select("#map");

// const margin = {top:50, right:50, bottom:0, left:50},
//     w = 500 - margin.left - margin.right,
//     h= 500 - margin.top - margin.bottom;
const canvasWidth = +canvas.attr("width"),
      canvasHeight = +canvas.attr("height");


let ctx = canvas.node().getContext("2d");

// Define map projection
let projection = d3.geoMercator() //utiliser une projection standard pour aplatir les pôles, voir D3 projection plugin
    								 .center([ 12.5 , 42.5 ]) //comment centrer la carte, longitude, latitude
    								 .translate([ canvasWidth/1, canvasWidth/1 ]) // centrer l'image obtenue dans le svg
                     .scale(canvasWidth / 2);


let geoPathGenerator = d3
    .geoPath()
    .projection(projection)
    .context(ctx);


// Load data
d3.json("./data/limits_IT_regions.geojson").then(function(geojson) {

  const topo = topojson.topology({foo: geojson});



      ctx.beginPath();
          ctx.strokeStyle = "black";
          // ctx.lineWidth = 0.5;
          // ctx.lineJoin = "round";
          // ctx.lineCap = "round";
          geoPathGenerator(topojson.mesh(topo));
          ctx.stroke();

});
