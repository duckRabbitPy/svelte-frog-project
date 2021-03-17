<script>
    import { fly } from 'svelte/transition';
</script>

<style>
    header {
        position: fixed;
        width: 100%;
        top: 0;
        left: 0;
        height: 5rem;
        background: #2c9040;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.26);
        z-index: 1;
    }

    h1 {
        color: aliceblue;
        font-family: "Roboto slab", sans-serif;
    }

    img {
        padding-left: 1rem;
    }

    @keyframes wiggle {
    0% { transform: rotate(0deg); }
    80% { transform: rotate(0deg); }
    85% { transform: rotate(5deg); }
    95% { transform: rotate(-5deg); }
    100% { transform: rotate(0deg); }
}

    h1.wiggle {
    display: inline-block;
    animation: wiggle 5.5s infinite;
    }

    h1.wiggle:hover {
    animation: none;
    }

</style>

<header>
    <h1 class="wiggle">Adopt a Frog</h1>
    <img src="/images/frog.png" alt="frog" width="60rem">
</header>