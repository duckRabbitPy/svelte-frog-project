<script>
    import { onMount } from 'svelte';
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
</style>

<blockquote>
    {#if visible}
    <h2 in:typewriter>
		<slot/>
    </h2>
    {/if}
</blockquote>

	