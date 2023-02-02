<script>
    import "carbon-components-svelte/css/white.css";
    import {Grid, Row, Column} from "carbon-components-svelte";
    import Map from "./lib/Map.svelte";
</script>


<main>

    <Grid>
        <Row>
            <Column>
                <Map></Map>
            </Column>
            <Column>
                <h1>Earthquakes in Italy<br>from 1990 to 2022</h1>
            </Column>
        </Row>
    </Grid>

</main>

<style>

</style>