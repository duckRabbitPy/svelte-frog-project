<script>
    import { createEventDispatcher } from "svelte";

	let options = [
		{ id: 1, text: `🐸` },
		{ id: 2, text: `🐸🐸` },
        { id: 3, text: `🐸🐸🐸` },
		{ id: 4, text: `🐸🐸🐸🐸` },
        { id: 4, text: `🐸🐸🐸🐸🐸` }
	];

	let selected;

    const dispatch = createEventDispatcher();

    function sendUpData(){
        dispatch('pass-up-stars',selected.text)
    }
</script>

<style>
	select { width: 150px;}
</style>

<form on:submit|preventDefault>
	<select bind:value={selected} on:blur="{sendUpData}">
		{#each options as option}
			<option value={option}>
				{option.text}
			</option>
		{/each}
	</select>
</form>