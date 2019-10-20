
const url = "https://emidius.mi.ingv.it/fdsnws/event/1/query?starttime=1967-01-01T00:00:00&endtime=2014-12-31T23:59:59&orderby=time-asc&limit=4000&format=text";





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



// "May and September 1976, Friuli earthquake, death toll: 978 ",
// "November 1980, Irpinia earthquake, death toll:  2,483",
// "December 1990, Carlentini earthquake, death toll: 8",
// "September 1997, Umbria and Marche earthquake, death toll: 11",
// "October 2002, Molise earthquake, death toll: 30",
// "April 2009, L'Aquila earthquake, death toll: 309",
// "May 2012, Emilia earthquake, death toll: 20"
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




//Width and height of visualization
const w = 500;
const h = 500;



//Define map projection
let projection = d3.geoMercator() //utiliser une projection standard pour aplatir les pôles, voir D3 projection plugin
								   .center([ 12.5 , 42.5 ]) //comment centrer la carte, longitude, latitude
								   .translate([ w/2, h/2 ]) // centrer l'image obtenue dans le svg
								   .scale([ w/0.3 ]); // zoom, plus la valeur est petit plus le zoom est gros

console.log(projection([37.763, 13.049]));

                   // Load data
                   const annotations = [
                     {
                       type: d3.annotationCalloutCircle,
                       label:"February 1968, Belice Earthquake,  death toll: 231 ",
                       title: "Belice",
                       wrap: 190,

                   }, { //settings for the subject, in this case the circle radius
                     subject: {
                       radius: 50
                     },
                     x: projection([37.763, 13.049])[0],
                     y: projection([37.763, 13.049])[1],
                     dy: projection([37.763, 13.049])[1],
                     dx:  projection([37.763, 13.049])[0]
                   }].map(function(d){ d.color = "#E8336D"; return d})
                   ;








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


//Load in GeoJSON data
d3.json("./data/limits_IT_regions.geojson").then(function(geojson) {
    d3.dsv("|",url).then(function(earthquakes) {
  // console.log("topojson",topology);
  // let geojson = topojson.feature(topology, topology.objects.ITA_adm1);


  // console.log("geojson", geojson)

  svg.selectAll("path")
      .data(geojson.features)
      .enter().append("path")
      .attr("d", path)
      .style("fill-opacity",0.2)
      .style("stroke","white");





        let parseTime = d3.timeParse("%Y-%m-%d");
        // console.log(parseTime(data[0].Time.substring(0,10)));

        let i =0;
        // If use d3.timer, get a slightly different animation
        let t = d3.interval(function(elapsed) {
          // console.log(earthquakes[i].Time);
        let text = earthquakes[i].Time.substring(0,10);

        text = parseTime(text);

        let monthEarthquake = month[text.getMonth()];
        let year = text.getFullYear();

        svg.selectAll("mycircles")
           .data(earthquakes)
           .enter()
           .append("circle")
             .attr("cx", projection([+earthquakes[i].Longitude, +earthquakes[i].Latitude])[0])
             .attr("cy",projection([+earthquakes[i].Longitude, +earthquakes[i].Latitude])[1])
             .attr("r",0)
             .attr("fill","#9D5669")
             .style("fill-opacity", 1)
             .transition()
             .ease(d3.easeLinear)
             .duration(3000)
             .attr("r", 2*earthquakes[i].Magnitude)
             .style("fill-opacity", 0.2)
             .remove();

      d3.select("#time").selectAll("h1").remove();

      d3.select("#time")
                   .append("h1")
                   .text(monthEarthquake + " " + year);



        if (year == "1968" && is1968==false) {

          is1968=true;
          const makeAnnotations = d3.annotation()
                    .type(d3.annotationLabel)
                    .annotations(annotations)
          svg.append("g")
          .attr("class", "annotation-group")
          .call(makeAnnotations);


        } else if (year == "1976" && is1976==false) {
          d3.select("#details").selectAll("p").remove();
          is1976=true;
          d3.select("#details")
            .append("p")
            .text(details[1]);



        } else if (year == "1980" && is1980==false) {
          d3.select("#details").selectAll("p").remove();
          is1980=true;
          d3.select("#details")
            .append("p")
            .text(details[2])
        } else if (year == "1990" && is1990==false) {
          d3.select("#details").selectAll("p").remove();
          is1990=true;
          d3.select("#details")
            .append("p")
            .text(details[2])
        } else if (year == "1997" && is1997==false) {
          d3.select("#details").selectAll("p").remove();
          is1997=true;
          d3.select("#details")
            .append("p")
            .text(details[3])
        } else if (year == "2002" && is2002==false) {
          d3.select("#details").selectAll("p").remove();
          is2002=true;
          d3.select("#details")
            .append("p")
            .text(details[4])
        } else if (year == "2009" && is2009==false) {
          d3.select("#details").selectAll("p").remove();
          is2009=true;
          d3.select("#details")
            .append("p")
            .text(details[5])
        } else if (year == "2012" && is2012==false) {
          d3.select("#details").selectAll("p").remove();
          is2012=true;
          d3.select("#details")
            .append("p")
            .text(details[6])
        }


          i = i+1

        }, 500);



      });


});





// Create a timer
// setInterval(function() {
//   redraw();  // call the function you created to update the chart
// }, 1500);


// function redraw() {
//   // Update…
//
// }
