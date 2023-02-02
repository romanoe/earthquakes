<script>
    import {onMount} from "svelte";
    import {geoMercator, geoPath} from "d3-geo"
    import {draw} from "svelte/transition";


    // Earthquakes API url
    const url = "https://emidius.mi.ingv.it/fdsnws/event/1/query?starttime=1990-01-01T00:00:00&endtime=2022-12-31T23:59:59&orderby=time-asc&limit=4000&format=json";

    // Arrays storing data when fetched
    let earthquakes = [];
    let italyBorders = [];


    // SVG properties
    const margin = {top: 50, right: 50, bottom: 0, left: 50},
        w = 600 - margin.left - margin.right,
        h = 800 - margin.top - margin.bottom;


    //Define map projection and path
    const projection = geoMercator()
        .translate([w / 2 - 400, h + 1200 ])
        .scale([w / 0.25]);

    const path = geoPath().projection(projection)

    // Fetch data
    onMount(async() => {
        earthquakes = await fetch(url).then((response) => response.json()).then((json) => json.features)
        italyBorders = await fetch('./data/limits_IT_regions.geojson').then((response) => response.json()).then((json => json.features))

    })





</script>

<main>
    <svg width={w} height={h}>
    <!--Italy regions shapes -->
        <g fill="white" stroke="black">
            {#each italyBorders as feature, i}
                <path d={path(feature)} in:draw={{ delay: i * 50, duration: 1500 }} />
            {/each}
        </g>


        <g>
            {#each earthquakes as feature, i}
                <circle cx={projection(x)} in:draw={{ delay: i * 50, duration: 1500 }} />
            {/each}
        </g>
    </svg>




</main>
