
const url = "https://emidius.mi.ingv.it/fdsnws/event/1/query?starttime=1990-01-01T00:00:00&endtime=2014-12-31T23:59:59&orderby=time-asc&limit=4000&format=text";
let playing = true;




let is1968=false;
let is1976=false;
let is1980=false;
let is1990=false;
let is1997=false;
let is2002=false;
let is2009=false;
let is2012=false;

var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";


const details = [
// "February 1968, Belice Earthquake,  death toll: 231",
// "May and September 1976, Friuli earthquake, death toll: 978 ",
// "November 1980, Irpinia earthquake, death toll:  2,483",
"December 1990, Carlentini earthquake, death toll: 8",
"September 1997, Umbria and Marche earthquake, death toll: 11",
"October 2002, Molise earthquake, death toll: 30",
"April 2009, L'Aquila earthquake, death toll: 309",
"May 2012, Emilia earthquake, death toll: 20"
]

// ,{
//           //below in makeAnnotations has type set to d3.annotationLabel
//           //you can add this type value below to override that default
//           type: d3.annotationCalloutCircle,
//           note: {
//             label: "A different annotation type",
//             title: "d3.annotationCalloutCircle",
//             wrap: 190
//           },
//           //settings for the subject, in this case the circle radius
//           subject: {
//             radius: 50
//           },
//           x: 620,
//           y: 150,
//           dy: 137,
//           dx: 102
//         }
let parseTime = d3.timeParse("%Y-%d-%m");

  // parseTime("June 30, 2015"); // Tue Jun 30 2015 00:00:00 GMT-0700 (PDT)



const margin = {top:50, right:50, bottom:0, left:50},
    w = 600 - margin.left - margin.right,
    h= 700 - margin.top - margin.bottom;

//Define map projection
let projection = d3.geoMercator() //utiliser une projection standard pour aplatir les pôles, voir D3 projection plugin
								   .center([ 12.5 , 42.5 ]) //comment centrer la carte, longitude, latitude
								   .translate([ w/2, h/2 ]) // centrer l'image obtenue dans le svg
								   .scale([ w/0.3 ]); // zoom, plus la valeur est petit plus le zoom est gros


// const labels = [{
//   data: {year: 1968, deaths: 231},
//   dx: projection([37.763, 13.049])[0],
// 	dy: projection([37.763, 13.049])[1],
// 	note: {align:middle}
// }
// ]



                   // // Load data
                   // const annotations = [
                   //   {
                   //     type: d3.annotationCalloutCircle,
                   //     label:"February 1968, Belice Earthquake,  death toll: 231 ",
                   //     title: "Belice",
                   //     wrap: 190,
									 //
                   // }, { //settings for the subject, in this case the circle radius
                   //   subject: {
                   //     radius: 10
                   //   },
                   //   x: projection([37.763, 13.049])[0],
                   //   y: projection([37.763, 13.049])[1],
                   //   // dy: projection([37.763, 13.049])[0],
                   //   // dx:  projection([37.763, 13.049])[1]
                   // }].map(function(d){ d.color = "#E8336D"; return d})
                   // ;



let playbutton = d3.select("#button-play");




//Define path generator
let path = d3.geoPath()
							.projection(projection);


//Create SVG
let svg = d3.select("#map")
						.append("svg")
						.attr("width", w)
						.attr("height", h);




//Create month year text
let yearText = d3.select("#time")
              .append("text")
              .attr("width", w/2)
  						.attr("height", h/2);

//Typewriter
let info = d3.select(".typewriter");


// Radial gradient
let radialGradient = svg.append("defs")
  .append("radialGradient")
    .attr("id", "radial-gradient");

radialGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#8C4861");

radialGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#fff");



let totalElapsedTime = 0;
let startTime = d3.now() - totalElapsedTime;


let i =0;



//Load in GeoJSON data
d3.json("./data/limits_IT_regions.geojson").then(function(geojson) {
  d3.dsv("|",url).then(function(earthquakes) {
//  let locations = earthquakes.map(d=>[d.Latitude,d.Longitude,d.EventLocationName]);
//  let uniqueCities = locations.filter((v, i, a) => a.indexOf(v) === i);
// console.log(uniqueCities);

  svg.selectAll("path")
      .data(geojson.features)
      .enter().append("path")
      .attr("d", path)
      .style("fill-opacity",0)
      .style("stroke","lightgrey");


// svg.selectAll("text")
//     .data(uniqueCities)
//     .enter()
//     .append("text")
//     .






    let drawEarthquakes = (elapsed) =>  {

    let elapsedTime = d3.now() - startTime;
    let parseTime = d3.timeParse("%Y-%m-%d");
    let date = earthquakes[i].Time.substring(0,10);
    // let location = earthquakes[i].EventLocationName;

    date = parseTime(date);

    let monthEarthquake = month[date.getMonth()];
    let year = date.getFullYear();


    d3.select("#details").selectAll("p").remove();

    d3.select("#details")
               .append("p")
               .text(monthEarthquake+ " "+year);


                     // .remove();


    svg.selectAll("mycircles")
       .data(earthquakes)
       .enter()
       .append("circle")
         .attr("cx", projection([+earthquakes[i].Longitude, +earthquakes[i].Latitude])[0])
         .attr("cy",projection([+earthquakes[i].Longitude, +earthquakes[i].Latitude])[1])
         .attr("r", 0)
         .style("fill-opacity", 0.1)


         // .style("stroke", "#69b3a2")

         .transition()
         .ease(d3.easeQuad)
         .duration(700)
         .style("fill", "url(#radial-gradient)")
         .style("fill-opacity", 0.1)

         .attr("r", +3*earthquakes[i].Magnitude)


         .transition()
         .ease(d3.easeElastic)
         .duration(300)
         .style("fill","url(#radial-gradient)")
         .attr("fill-opacity", 0.1)
         .attr("r", 2^earthquakes[i].Magnitude)
         .remove()





         if (!is1990 && year == 1990 && monthEarthquake == "December") {

           is1990 = true;
           info.append("p")
                  .text(details[0]);

         } else if (!is1997 && year == 1997 && monthEarthquake == "September") {
           info.selectAll("p").remove();
           is1997 = true;
           info.append("p")
                  .text(details[1]);
         }





      i = i+1;

  }
    let togglePlay = () => {

            if (playing) {
              playbutton.classed('paused', true);
              playing = false;
              totalElapsedTime = d3.now() - startTime;
              t.stop();
            } else {
              playbutton.classed('paused', false);
              playing = true;
              startTime = d3.now() - totalElapsedTime;
              t.restart(drawEarthquakes);

            }
          }






    let t = d3.interval(drawEarthquakes,1000);


    playbutton.on("click",togglePlay);


      });



});
