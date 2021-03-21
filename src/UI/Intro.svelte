<script>
    import { onMount } from 'svelte';
    import { darkModeOn } from './DarkModeStore.js';

    let visible = false;
    onMount(()=>{visible = true})

    function typewriter(node, { speed = 30 }) {
        const valid = (
            node.childNodes.length === 1 &&
            node.childNodes[0].nodeType === Node.TEXT_NODE
        );

        if (!valid) {
            throw new Error(`This transition only works on elements with a single text node child`);
        }

        const text = node.textContent;
        const duration = text.length * speed;

        return {
            duration,
            tick: t => {
                const i = ~~(text.length * t);
                node.textContent = text.slice(0, i);
            }
        };
    }
</script>



<style>
h2 {
    font-family: "Roboto slab", sans-serif;
    color: #808080;
    width: 100%;
    padding-top: 2rem;
    padding-bottom: 2rem;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

h2.darkMode {
    color: rgb(206,206, 206)
}

h2.lightMode {
    color: rgb(134, 133, 133);
}
</style>

<blockquote>
    {#if visible}
    <h2 class={$darkModeOn ? "darkMode" : "lightMode"} in:typewriter>
		<slot/>
    </h2>
    {/if}
</blockquote>

	