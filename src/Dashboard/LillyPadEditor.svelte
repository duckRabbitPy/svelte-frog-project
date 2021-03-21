<script>
//npm markup module
import marked from 'marked';
import CustomButton from '../UI/CustomButton.svelte';
import { darkModeOn } from "../UI/DarkModeStore.js";

	let value = ``;
	let newText = ''
	
	function convert(){
	let rawText = value
	
	return newText = rawText.split(' ').join('💦 ').replace(/[o]/gi, '🐸').replace(/[.]/gi, ' riiiiiiibit ').replace(/[t]/gi, '🌱')
	}
	

</script>

<style>
	textarea { width: 100%; height: 200px; font-size: xx-large; margin-left: 1rem; margin-right: 1rem;}

    .dark{color: greenyellow; font-size: xx-large;}

    .light{color: rgb(75, 122, 3); font-size: xx-large;}

    .apply{margin-left: 1rem;}

</style>

<div class="apply">
<CustomButton on:click={()=>{convert()}}>Apply Changes</CustomButton>
</div>
<textarea bind:value></textarea>

<p class="{$darkModeOn ? "dark" : "light"}">
	{@html marked(newText)}
</p>