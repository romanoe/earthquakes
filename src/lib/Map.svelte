<script>
    import {onMount} from "svelte";
    import {geoMercator, geoPath} from "d3-geo";
    import {ascending} from "d3-array";
    import {select, selectAll, pointer} from "d3-selection";
    import {draw} from "svelte/transition";
    import {Column, Grid, Row} from "carbon-components-svelte";
    import {zoom, zoomIdentity} from "d3-zoom";

    // Scroll
    import Scroll from "./Scrolly.svelte";

    // Scroll steps
    let currentStep;
    const steps = [{
            deathToll: 7,
            name: "Terremoti dell'Emilia",
            coordinates: [10.801449,44.718074],
            img: "./img/emilia.jpg",
            caption: "La chiesa di San Martino di Tours a Buonacompra di Cento, crollata dopo le scosse del 20 maggio, Wikipedia"
        }, {
            deathToll: 30,
            name: "Terremoti dell'Appennino",
            coordinates: [13.3995,42.3498],
            img: "./img/aquila.jpg",
            caption: "Un ufficio del governo distrutto dal terremoto del 2009 a L'Aquila | <b>Wikipedia</b>"

    },
        {
            deathToll: 11,
            name: "Terremoti Sicilia",
            coordinates: [14.859256,38.691885],
            img: "./img/emilia.jpg",
            caption: "L'Aquila, Abruzzo, Italy. Un ufficio del governo distrutto dal terremoto del 2009, Wikipedia"
        }
    ];


    // Earthquakes API url
    const url = "https://emidius.mi.ingv.it/fdsnws/event/1/query?starttime=1990-01-01T00:00:00&endtime=2022-12-31T23:59:59&orderby=time-asc&limit=4000&format=json";

    // Arrays storing data when fetched
    let earthquakes = [];
    let biggestEarthquakes = [];
    let borders = [];

    // SVG properties
    const margin = {top: 50, right: 50, bottom: 0, left: 50},
        w = window.innerWidth / 2 - margin.left - margin.right,
        h = window.innerHeight - margin.top - margin.bottom;


    //Define map projection and path
    const projection = geoMercator()
        .translate([w / 2 - 500, 2400])
        .scale([2500]);

    const path = geoPath().projection(projection)




    const doZoom = (e) => {

        selectAll("path").attr("transform", e.transform);
        selectAll("circle").attr("transform", e.transform);

    }

    // Zoom
    const mapZoom = zoom().scaleExtent([1, 5]).on('zoom', doZoom);


    const initZoom = () => {
        select('svg')
            .call(mapZoom);
    }


    const zoomTo = (coordinates) => {
        select("svg").transition().duration(4000).call(mapZoom.transform, zoomIdentity.translate(w / 2, h / 2).scale(5).translate(-projection(coordinates)[0], -projection(coordinates)[1]));
    }




    // Tooltip
    const showTooltip = (event, source_id) => {
        let tooltip = document.getElementById(source_id);
        tooltip.style.display = "block";
        tooltip.style.left = pointer(event)[0] +  'px';
        tooltip.style.top = pointer(event)[1]  + 'px';
    }

    const hideTooltip = (event, source_id) => {
        let tooltip = document.getElementById(source_id);
        tooltip.style.display = "none";
    }


    // Fetch data and initialize zoom
    onMount(async () => {
            const temporalEarthquakes = await fetch(url).then((response) => response.json()).then(json => json.features)
            const sortedEarthquakes = temporalEarthquakes.slice().sort((a, b) => ascending(a.properties.mag, b.properties.mag))
            biggestEarthquakes = sortedEarthquakes.slice(-10);

            borders = await fetch('./data/limits_IT_regions.geojson').then((response) => response.json()).then(json => json.features)

            initZoom();


        }
    )

    $: if (currentStep == 0) {
        zoomTo(steps.map(d=>d.coordinates)[0]);
    } else if (currentStep == 1) {
        zoomTo(steps.map(d=>d.coordinates)[1]);
    } else if (currentStep == 2) {
        zoomTo(steps.map(d=>d.coordinates)[2]);
    }


</script>

<main>
    <Grid>
        <Row>
            <Column>

                <div id="map">
                <svg width={w} height={h}>

                    <!--Italy regions shapes -->
                    <g fill="white" stroke="grey" stroke-width="0.3">
                        {#each borders as border, i}
                            <path d={path(border)} in:draw={{ delay: i * 50, duration: 1500 }}/>
                        {/each}
                    </g>


                    <g id="map">
                        {#each biggestEarthquakes as earthquake, i}

                            <circle
                                    r="{Math.pow(1.3,earthquake.properties.mag)}"
                                    cx={projection([earthquake.geometry.coordinates[0], earthquake.geometry.coordinates[1]])[0]}
                                    cy="{projection([earthquake.geometry.coordinates[0], earthquake.geometry.coordinates[1]])[1]}"
                                    fill="red" stroke-width="1"
                            >
                                <animate attributeName="r" from="0" to="{Math.pow(1.6,earthquake.properties.mag)}"
                                         dur="3s" begin="0s" repeatCount="indefinite"/>
                                <animate attributeName="opacity" from="1" to="0" dur="3s" begin="0s"
                                         repeatCount="indefinite"/>
                            </circle>

                            <circle
                                    r="{Math.pow(1.3,earthquake.properties.mag)}"
                                    cx={projection([earthquake.geometry.coordinates[0], earthquake.geometry.coordinates[1]])[0]}
                                    cy="{projection([earthquake.geometry.coordinates[0], earthquake.geometry.coordinates[1]])[1]}"
                                    fill="red" stroke-width="1"
                                    on:mouseover={showTooltip(event, earthquake.properties.source_id)}
                                    on:mouseout={hideTooltip(event, earthquake.properties.source_id)}
                            ></circle>
                        {/each}


                    </g>

                </svg>

         {#each biggestEarthquakes as earthquake, i}
             <div id={earthquake.properties.source_id} display="none" style="position: absolute; display: none;">
                 {earthquake.properties.region} <br>
                 {new Date(earthquake.properties.time).toLocaleDateString("fr-FR")}
             </div>
         {/each}
                </div>

            </Column>

            <Column>

                <section>
                    <Scroll bind:value={currentStep}>
                        {#each steps as step, i}
                            <div class="step" class:active={currentStep === i}>
                                <div class="step-content">
                                    <h1>{step.name}</h1>
                                    <figure>
                                        <img src="{step.img}" alt="{step.name}" width="400px" height="550px"/>
                                        <figcaption style="padding: 20px">{step.caption}</figcaption>
                                    </figure>
                                </div>
                            </div>
                        {/each}
                    </Scroll>
                </section>



            </Column>
        </Row>
    </Grid>

    <footer><small><code>Dati: Istituto Nazionale Geofisica et Vulcanologia</code></small></footer>
</main>

<style>

    h1 {
        margin: 50px
    }
    footer {
        text-align: right;
        right: 0;
        bottom: 0;
        margin: 20px;
        position: fixed;
    }

    .step {
        height: 90vh;
        display: flex;
        place-items: center;
        justify-content: center;
    }

    .step-content {
        color: #ccc;
        padding: .5rem 1rem;
        text-align: center;
        transition: background 500ms ease, color 500ms ease;
    }

    .step.active .step-content {
        background: white;
        color: black;
    }

    #map {
        position: sticky;
        top: 10%;
        margin: auto;
    }

    img {
        object-fit: contain;
        max-width: 100%;
        max-height: 500px;
        width: auto;
        height: auto;
    }
</style>


