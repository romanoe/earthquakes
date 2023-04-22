<script>

   let mobile =  screen.width <= 760 ?  true :  false;

</script>


<style>

    #description {
        padding: 50px;
    }
    .intro {
        height: 100vh;
        padding: 8%;
        text-align: center;
    }

    .subtitle {
        font-family: Poppins;
        font-weight: 100;
        font-size: 2rem;
        color:  #F12526;

    }

    p {
        font-weight: 100;
        font-size: 1.3rem;
    }

    .title {
        display: grid;
        place-content: center;
        background-color: var(--background-color);
        min-height: 3vh;
        font-size: clamp(1.5rem, 1rem + 18vw, 15rem);
        font-weight: 500;
        font-size: 4rem;
        text-transform: uppercase;
        color: var(--text-color);
    }

    .title > div {
        grid-area: 1/1/-1/-1;
    }
    .top {
        clip-path: polygon(0% 0%, 100% 0%, 100% 48%, 0% 58%);
        font-size: 4rem;
    }
    .bottom {
        clip-path: polygon(0% 60%, 100% 50%, 100% 100%, 0% 100%);
        color: transparent;
        background: -webkit-linear-gradient(177deg, whitesmoke 53%, var(--text-color) 65%);
        background: linear-gradient(177deg, white 10%, var(--text-color) 65%);
        background-clip: text;
        -webkit-background-clip: text;
        transform: translateX(-0.02em);
        font-size: 4rem
    }

    @media only screen and (min-width: 768px) {

        .top {
            font-size: 8rem

        }

        .bottom {
            font-size: 8rem
        }

    }



</style>

<div class="intro">

    <div class="title">
    <div class="top">Terremoti</div>
    <div class="bottom" aria-hidden="true">Terremoti</div>
    </div>

    <br> <br>
    <span class="subtitle">in Italia dal 2000 ad oggi</span>



<p id="description">L'Italia è situata lungo la zona di collisione tra la placca africana e quella euroasiatica, ed è quindi soggetta a frequenti attività sismiche. Essendo caratterizzata da zone geologicamente complesse, dove le rocce sono molto varie e la crosta terrestre è molto sottile, l'Italia è inoltre vittima di una maggiore instabilità sismica. </p>
    <p>Negli ultimi 20 anni, l'italia ha subito diversi terremoti significativi.</p>

    {#if !mobile}
    <a id="scroll-btn" href="#scroller"></a>
    {:else}
        <p style="color:red">Malheureusement la visualisation est disponible seulement en Desktop.</p>
    {/if}
</div>

