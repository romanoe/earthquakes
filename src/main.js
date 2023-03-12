import {select, selectAll} from "d3-selection";
import {geoMercator, geoPath} from "d3-geo";
import {interval, now} from "d3-timer";
import {json, dsv} from "d3-fetch";
import {timeParse} from "d3-time-format";
import {easeElastic, easeQuad} from "d3-ease";
import {transition} from "d3-transition";


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


const margin = {top:50, right:50, bottom:0, left:50},
    w = 600 - margin.left - margin.right,
    h= 500 - margin.top - margin.bottom;

//Define map projection
let projection = geoMercator() //utiliser une projection standard pour aplatir les pôles, voir D3 projection plugin
    .center([ 12.5 , 42.5 ]) //comment centrer la carte, longitude, latitude
    .translate([ w/2, h/2 ]) // centrer l'image obtenue dans le svg
    .scale([ w/0.3 ]); // zoom, plus la valeur est petit plus le zoom est gros



let playbutton = select("#button-play");




//Define path generator
let path = geoPath()
    .projection(projection);


//Create SVG
let svg = select("#map")
    .append("svg")
    .attr("width", w)
    .attr("height", h);


//Create month year text
let yearText = select("#time")
    .append("text")
    .attr("width", w/2)
    .attr("height", h/2);

//Typewriter
let info = select(".typewriter");


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
let startTime = now() - totalElapsedTime;


let i =0;



//Load in GeoJSON data
json("./data/limits_IT_regions.geojson").then(function(geojson) {
    dsv("|",url).then(function(earthquakes) {

        svg.selectAll("path")
            .data(geojson.features)
            .enter().append("path")
            .attr("d", path)
            .style("fill-opacity",0)
            .style("stroke","lightgrey");



        let drawEarthquakes = (elapsed) =>  {

            let parseTime = timeParse("%Y-%m-%d");
            let date = earthquakes[i].Time.substring(0,10);

            date = parseTime(date);

            let monthEarthquake = month[date.getMonth()];
            let year = date.getFullYear();


            select("#details").selectAll("p").remove();

            select("#details")
                .append("p")
                .text(monthEarthquake+ " "+year);


            svg.selectAll("mycircles")
                .data(earthquakes)
                .enter()
                .append("circle")
                .attr("cx", projection([+earthquakes[i].Longitude, +earthquakes[i].Latitude])[0])
                .attr("cy",projection([+earthquakes[i].Longitude, +earthquakes[i].Latitude])[1])
                .attr("r", 0)
                .style("fill-opacity", 0.1)
                .transition()
                .ease(easeQuad)
                .duration(700)
                .style("fill", "url(#radial-gradient)")
                .style("fill-opacity", 0.1)
                .attr("r", +3*earthquakes[i].Magnitude)
                .transition()
                .ease(easeElastic)
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
                totalElapsedTime = now() - startTime;
                t.stop();
            } else {
                playbutton.classed('paused', false);
                playing = true;
                startTime = now() - totalElapsedTime;
                t.restart(drawEarthquakes);
            }
        }


        let t = interval(drawEarthquakes,1000);


        playbutton.on("click",togglePlay);


    });



});
