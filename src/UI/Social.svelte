<script>
    export let counterName
    import { createEventDispatcher } from "svelte"

    let num = 0;

    const dispatch = createEventDispatcher();

    function numOfClicks(){
        num += 1
        dispatch('pass-up-data',num)
    }
</script>

<style>
    p {
        color: rgb(17, 153, 237);
        padding-top: 1rem;
    }
</style>

<div>
    <p><span><img src="https://www.flaticon.com/svg/vstatic/svg/424/424870.svg?token=exp=1615249621~hmac=e98a24b849aff33ebde9abf8fec9421d" alt="frog" width="40rem">{counterName}</span></p>
    <button on:click="{numOfClicks}">Bump up likes</button>
</div>