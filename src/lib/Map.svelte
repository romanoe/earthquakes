<script>
    import {onMount} from "svelte";
    import {geoMercator, geoPath} from "d3-geo";
    import {ascending} from "d3-array";
    import {select, selectAll, pointer} from "d3-selection";
    import {draw} from "svelte/transition";
    import {Column, Grid, Row} from "carbon-components-svelte";
    import {zoom, zoomIdentity} from "d3-zoom";
    import {steps} from '../assets/steps.js';

    // Scroll
    import Scroll from "./Scrolly.svelte";

    // Scroll steps
    let currentStep;


    // Earthquakes API url
    const url = "https://emidius.mi.ingv.it/fdsnws/event/1/query?starttime=2000-01-01T00:00:00&endtime=2022-12-31T23:59:59&orderby=time-asc&limit=4000&format=json";

    // Arrays storing data when fetched
    let biggestEarthquakes = [];
    let borders = [];
    let cities = [];
    let temporalEarthquakes = [];


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
        selectAll("text").attr("transform", e.transform);
    }

    // Zoom
    const mapZoom = zoom().scaleExtent([1, 1]).on('zoom', doZoom);


    // Tooltip
    const showTooltip = (event, source_id) => {

        let tooltip = document.getElementById(source_id);
        tooltip.style.display = "block";
        tooltip.style.left = event.layerX + 10 + 'px';
        tooltip.style.top = event.layerY + 10 + 'px';
    }
    const hideTooltip = (event, source_id) => {
        let tooltip = document.getElementById(source_id);
        tooltip.style.display = "none";
    }

    const initZoom = () => {
        select('svg')
            .call(mapZoom)
            .on("wheel.zoom", null);
        ;
    }


    const zoomTo = (coordinates, scale) => {
        select("svg").transition().duration(4000).call(mapZoom.transform, zoomIdentity.translate(w / 2, h / 2).scale(scale).translate(-projection(coordinates)[0], -projection(coordinates)[1]));
    }

    // Fetch data and initialize zoom
    onMount(async () => {

            temporalEarthquakes = await fetch(url).then((response) => response.json()).then(json => json.features)
            const sortedEarthquakes = temporalEarthquakes.slice().sort((a, b) => ascending(a.properties.mag, b.properties.mag))
            cities = await fetch('./data/cities.geojson').then((response) => response.json()).then(json => json.features)
            biggestEarthquakes = sortedEarthquakes.slice(-10);

            borders = await fetch('./data/limits_IT_regions.geojson').then((response) => response.json()).then(json => json.features)

            initZoom();

        }
    )

    $: if (currentStep == 0) {
        zoomTo(steps.map(d => d.coordinates)[0], 5);
    } else if (currentStep == 1) {
        zoomTo(steps.map(d => d.coordinates)[1], 5);
    } else if (currentStep == 2) {
        zoomTo(steps.map(d => d.coordinates)[2], 5);
    } else if (currentStep == 3) {
        zoomTo(steps.map(d => d.coordinates)[3], 5);
    }


</script>

<main>
    <Grid>
        <Row>
            <Column>

                <div id="map">
                    <svg width={w} height={h}>

                        <!--Italy regions shapes -->
                        <g fill="white" stroke="grey" stroke-width="0.1">
                            {#each borders as border, i}
                                <path d={path(border)} in:draw={{ delay: i * 50, duration: 1500 }}/>
                            {/each}
                        </g>


                        <g id="map">

                            {#each temporalEarthquakes as earthquake, i}
                                <circle

                                        r="{Math.pow(1.1,earthquake.properties.mag)}"
                                        cx={projection([earthquake.geometry.coordinates[0], earthquake.geometry.coordinates[1]])[0]}
                                        cy="{projection([earthquake.geometry.coordinates[0], earthquake.geometry.coordinates[1]])[1]}"
                                        fill="#F12526" stroke-width="1" opacity="0.1"
                                        on:mouseover={showTooltip(event, earthquake.properties.source_id)}
                                        on:mouseout={hideTooltip(event, earthquake.properties.source_id)}
                                        on:blur={hideTooltip(event, earthquake.properties.source_id)}
                                        on:focus={showTooltip(event, earthquake.properties.source_id)}>

                                </circle>
                            {/each}


                            {#each biggestEarthquakes as earthquake, i}
                                <circle
                                        r="{Math.pow(1.1,earthquake.properties.mag)}"
                                        cx={projection([earthquake.geometry.coordinates[0], earthquake.geometry.coordinates[1]])[0]}
                                        cy="{projection([earthquake.geometry.coordinates[0], earthquake.geometry.coordinates[1]])[1]}"
                                        fill="#F12526" stroke-width="1"
                                >
                                    <animate attributeName="r" from="0" to="{Math.pow(1.3,earthquake.properties.mag)}"
                                             dur="3s" begin="0s" repeatCount="indefinite"/>
                                    <animate attributeName="opacity" from="1" to="0" dur="3s" begin="0s"
                                             repeatCount="indefinite"/>
                                </circle>

                                <circle id="earthquakes"
                                        r="{Math.pow(1.1,earthquake.properties.mag)}"
                                        cx={projection([earthquake.geometry.coordinates[0], earthquake.geometry.coordinates[1]])[0]}
                                        cy="{projection([earthquake.geometry.coordinates[0], earthquake.geometry.coordinates[1]])[1]}"
                                        fill="#F12526" stroke-width="1"
                                        on:mouseover={showTooltip(event, earthquake.properties.source_id)}
                                        on:mouseout={hideTooltip(event, earthquake.properties.source_id)}
                                        on:blur={hideTooltip(event, earthquake.properties.source_id)}
                                        on:focus={showTooltip(event, earthquake.properties.source_id)}
                                ></circle>

                            {/each}


                        </g>

                        {#each cities as city, i}
                            <circle
                                    r="1"
                                    cx={projection([city.geometry.coordinates[0], city.geometry.coordinates[1]])[0]}
                                    cy={projection([city.geometry.coordinates[0], city.geometry.coordinates[1]])[1]}
                                    fill="grey" stroke-width="1"
                            ></circle>
                            <text
                                    x={projection([city.geometry.coordinates[0], city.geometry.coordinates[1]])[0] - 3}
                                    y={projection([city.geometry.coordinates[0], city.geometry.coordinates[1]])[1] - 3}
                                    font-size="5px"
                            >
                                {city.properties.name}
                            </text>
                        {/each}

                    </svg>


                    {#each temporalEarthquakes as earthquake, i}
                        <div id={earthquake.properties.source_id} display="none"
                             style="position: absolute; display: none;">
                            Magnitudo: <b>{earthquake.properties.mag} </b><br>
                            {new Date(earthquake.properties.time).toLocaleDateString("fr-FR")}
                        </div>
                    {/each}
                </div>

            </Column>

            <Column>

                <section id="scroller">
                    <Scroll bind:value={currentStep}>
                        {#each steps as step, i}

                            <div class="step" class:active={currentStep === i}>
                                <div class="step-content">
                                    <h1>{@html step.name}</h1>
                                    <p class="description">{@html step.description}</p>
                                    <br>
                                    <br>
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
        margin: 30px;
        font-family: "Roboto";
        color: #F12526;
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
        padding: 1rem 1rem;
        margin-bottom: 100px;
        text-align: center;
        transition: background 500ms ease, color 500ms ease;
    }

    .step.active .step-content {
        background: white;
        color: black;
    }

    .description {
        font-size: 1.5em;
    }

    #map {
        position: sticky;
        top: 10%;
        margin: auto;
    }

    #scroller {
        margin-top: 20px;
        padding-top: 10%;
    }
    img {
        object-fit: contain;
        max-width: 100%;
        max-height: 500px;
        width: auto;
        height: auto;
    }

</style>


