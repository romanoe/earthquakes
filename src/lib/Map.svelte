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
        name: "Terremoti dell'Emilia",
        coordinates: [10.801449, 44.718074],
        img: "./img/emilia.jpg",
        caption: "La chiesa di San Martino di Tours a Buonacompra di Cento, crollata dopo le scosse del 20 maggio | Wikipedia",
        description: "I terremoti dell'Emilia nel 2012 sono stati frutto dello scontro della placca africana contro quella europea, creando una taglia lunga una quarantina di chilometri tra Ferrara et Modena. Si contano a oggi una ventina di morti e 300 feriti."
    }, {
        name: "Terremoti dell'Appennino",
        coordinates: [13.3995, 42.3498],
        img: "./img/aquila.jpg",
        caption: "Un ufficio del governo distrutto dal terremoto del 2009 a L'Aquila | Wikipedia",
        description: "L'Appennino centrale colleziona una serie di consistenti terremoti causata dallo stesso fenomeno dei terremoti dell'Emilia. Amatrice et l'Aquila sono state le città più colpite contando entrambe una centinaia di morti e migliaia di sfollati."

    },
        {
            name: "Terremoto del Molise",
            coordinates: [14.963460381772917, 41.68703764959287],
            img: "./img/villaggio-provvisorio.jpg",
            caption: "Villaggio provvisorio a San Giuliano di Puglia | Primonumero",
            description: "Nel 2002, una forte scossa colpì varie città del basso Molise, tra cui San Giuliano di Puglia, dove morirono 27 bambini, 1 maestra et 2 bidelli sotto le macerie della scuola Jovine. Dopo varie indagini giudiziarie, furono accusati i progettisti, i costruttori e il sindaco dell'epoca per mancato rispetto delle norme. Furono costruiti villaggi provvisori per accogliere le migliaia di sfollati."

        },
        {
            name: "Terremoti del Basso Tirreno",
            coordinates: [14.859256, 38.691885],
            img: "./img/messina.avif",
            caption: "Le macerie a Messina dopo la grande scossa e lo tsunami, 1908 | Focus",
            description: "La zona del Basso Tirreno è conosciuta per i terremoti con ipocentro profondo, meno pericolosi di quelli superficiali. In questa zona ci troviamo in effetti in un piano di Benioff (crosta oceanica sprofonda sotto la crosta continentale) e si possono verificare terremoti fino a 500km di profondità. I terremoti constatati negli ultimi 20 anni non hanno causato danni comme nelle altre zone d'Italia ma sono stati risentiti fino in Calabria e in Sicilia. Una grande frequenza di terremoti profondi non esclude la possibilità di terremoti più volenti : nel 1908, Messina fu colpita da un terremoto che raggiunse una magnitudo 7.3 della scala Richter e che è considerato l'evento pìu violento in Europa dall'introduzione degli strumenti di misurazione."

        }
    ];


    // Earthquakes API url
    const url = "https://emidius.mi.ingv.it/fdsnws/event/1/query?starttime=2000-01-01T00:00:00&endtime=2022-12-31T23:59:59&orderby=time-asc&limit=4000&format=json";

    // Arrays storing data when fetched
    let biggestEarthquakes = [];
    let borders = [];
    let cities = [];

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
        tooltip.style.left = event.layerX + 10 +'px';
        tooltip.style.top = event.layerY + 10 + 'px';
    }
    const hideTooltip = (event, source_id) => {
        let tooltip = document.getElementById(source_id);
        tooltip.style.display = "none";
    }

    const initZoom = () => {
        select('svg')
            .call(mapZoom)
    .on("wheel.zoom", null);;
    }


    const zoomTo = (coordinates) => {
        select("svg").transition().duration(4000).call(mapZoom.transform, zoomIdentity.translate(w / 2, h / 2).scale(5).translate(-projection(coordinates)[0], -projection(coordinates)[1]));
    }


    // Fetch data and initialize zoom
    onMount(async () => {
            const temporalEarthquakes = await fetch(url).then((response) => response.json()).then(json => json.features)
            const sortedEarthquakes = temporalEarthquakes.slice().sort((a, b) => ascending(a.properties.mag, b.properties.mag))
            cities = await fetch('./data/cities.geojson').then((response) => response.json()).then(json => json.features)
            biggestEarthquakes = sortedEarthquakes.slice(-10);

            console.log(biggestEarthquakes.filter(d=> d.properties.region == "Tirreno meridionale"))

            borders = await fetch('./data/limits_IT_regions.geojson').then((response) => response.json()).then(json => json.features)

            initZoom();


        }
    )

    $: if (currentStep == 0) {
        zoomTo(steps.map(d => d.coordinates)[0]);
    } else if (currentStep == 1) {
        zoomTo(steps.map(d => d.coordinates)[1]);
    } else if (currentStep == 2) {
        zoomTo(steps.map(d => d.coordinates)[2]);
    } else if (currentStep == 3) {
        zoomTo(steps.map(d => d.coordinates)[3]);
    }


</script>

<main>
    <Grid>
        <Row>
            <Column>

                <div id="map">
                    <svg width={w} height={h}>

                        <!--Italy regions shapes -->
                        <g fill="white" stroke="grey" stroke-width="0.1" class="no-interaction">
                            {#each borders as border, i}
                                <path d={path(border)} in:draw={{ delay: i * 50, duration: 1500 }}/>
                            {/each}
                        </g>


                        <g id="map">
                            {#each biggestEarthquakes as earthquake, i}

                                <circle class="no-interaction"
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
                                    x={projection([city.geometry.coordinates[0], city.geometry.coordinates[1]])[0] + 3}
                                    y={projection([city.geometry.coordinates[0], city.geometry.coordinates[1]])[1] + 3}
                                    font-size="5px"
                            >
                                {city.properties.name}
                            </text>
                        {/each}

                    </svg>


                    {#each biggestEarthquakes as earthquake, i}
                        <div id={earthquake.properties.source_id} display="none"
                             style="position: absolute; display: none;">
                            Magnitudo: <b>{earthquake.properties.mag} </b><br>
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
                                    <p>{step.description}</p>
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

    .no-interaction {
        pointer-events: none;
    }

    h1 {
        margin: 30px;
        font-family: Courier;
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
        padding: .5rem 1rem;
        margin-bottom: 100px;
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


