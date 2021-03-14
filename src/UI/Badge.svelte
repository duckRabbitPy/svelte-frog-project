<script>
    import { slide } from "svelte/transition"
</script>

<style>
    span {
        display: inline-block;
        margin: 0 0 0.25rem;
        border-radius: 3px;
        border: 1px solid #1ac745;
        background: #1ac745;
        color: aliceblue;
        padding: 0 0.5rem;
        font-size: 1rem;
    }
</style>

<span transition:slide ><slot/></span>