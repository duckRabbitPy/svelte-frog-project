<script>
    export let counterName
    export let disabled
    import { createEventDispatcher } from "svelte"
    let likeStatus = "like"

    let num = 0;

    const dispatch = createEventDispatcher();

    function numOfClicks(){
        num += 1
        likeStatus = "liked!"
        dispatch('pass-up-data',num)
    }
</script>

<style>
    p {
        color: rgb(17, 153, 237);
        padding-top: 1rem;
    }

    button:disabled,
    button:disabled:hover,
    button:disabled:active {
    background: #ccc;
    border-color: #ccc;
    color: #959595;
    box-shadow: none;
    cursor: not-allowed;
}
</style>

<div>
    <p><span><img src="/images/frog.png" alt="frog" width="40rem">{counterName}</span></p>
    <button disabled="{disabled}" on:click="{numOfClicks}">{likeStatus}</button>
</div>