<script>
    // Earthquakes API url
    import {onMount} from "svelte";

    export let url;

    let data = [];

    // Fetch data
    onMount(async () => {
           data = await fetch(url).then((response) => response.json()).then(json => json.features);
        console.log(data);

        }


    )


</script>