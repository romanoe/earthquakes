<!--From https://svelte.dev/repl/a6268cfc4685416998c6e64516546acd?version=3.55.1-->
<script>
    import { tweened } from 'svelte/motion';
    import { cubicInOut } from 'svelte/easing';

    const pausePaths = [
        'M212.13203,347.27573L280.82241,347.27573L280.82241,627.08798L212.13203,627.08798Z',
        'M393.9595,347.27573L462.64988,347.27573L462.64988,627.08798L393.9595,627.08798Z',
    ];
    const playPaths = [
        'M246.84631,381.58161L341.39093,434.38173L341.39093,539.98196L246.84631,592.7821Z',
        'M341.39093,434.38173L435.22131,487.18188L435.22131,487.18188L341.39093,539.98195Z',
    ];

    const pauseCoords = pathsToCoords(pausePaths);
    const playCoords = pathsToCoords(playPaths);

    const progress = tweened(pauseCoords, {
        duration: 400,
        easing: cubicInOut,
    });

    let isPlaying = true;
    function onToggle() {
        isPlaying ? progress.set(playCoords) : progress.set(pauseCoords);
        isPlaying = !isPlaying;
    }

    function pathsToCoords(paths) {
        return paths.map((d) =>
            d
                .replace(/[LMZ]/g, ',')
                .split(',')
                .filter(String)
                .map((c) => Number(c))
        );
    }

    function coordsToPath(coords) {
        const joinedInstructions = coords.reduce((acc, cur, i) => (i % 2 !== 0 ? acc + cur + 'L' : acc + cur + ','), ''); // Not my prettiest line of code :)
        return `M${joinedInstructions}Z`;
    }
</script>

<main>
    <div class="button-background" on:click={onToggle}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250.51786 279.81226" width="33">
            <g transform="translate(-212.13203,-347.27573)">
                <path d={coordsToPath($progress[0])} />
                <path d={coordsToPath($progress[1])} />
            </g>
        </svg>
    </div>
</main>

<style>
    :global(body) {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .button-background {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background-color: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    path {
        opacity: 1;
        fill: #4d4d4d;
        fill-opacity: 1;
        stroke: #4d4d4d;
        stroke-width: 7;
    }
</style>