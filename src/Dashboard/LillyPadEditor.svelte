<script>
import CustomButton from '../UI/CustomButton.svelte';
import { darkModeOn } from "../UI/DarkModeStore.js";

	let value = ``;
	let newText = '';
	let userMessage = '';
	
	function convert(){
	let rawText = value
	
	return newText = rawText.split(' ').join('💦 ').replace(/[o]/gi, '🐸').replace(/[.]/gi, ' riiiiiiibit ').replace(/[t]/gi, '🌱')
	}
	
	function copyToClip(){
		let pClass;
		$darkModeOn ? pClass = ".dark" : pClass = ".light";
		let copyText = document.getElementById("frogTxt");
		copyText.select();
		copyText.setSelectionRange(0, 99999)
		document.execCommand("copy");
		userMessage = "Copied to clipboard!"
	}


</script>

<style>

	@media (min-width: 900px) {
	textarea { width: 90%; height: 200px; font-size: xx-large; margin-left: 1rem; margin-right: 1rem;}

	.dark{color: rgb(151, 214, 57); font-size: xx-large;}

	.light{color: rgb(75, 122, 3); font-size: xx-large;}

	.apply{margin-left: 1rem;}

	h3 {margin-left: 1rem;}

	.wrapper { margin-left: 1rem; margin-right: 3rem;}
	}

	textarea { width: 90%; height: 100px; font-size: large; margin-left: 1rem; margin-right: 1rem;}

	.dark{color: rgb(151, 214, 57); font-size: large;}

	.light{color: rgb(75, 122, 3); font-size: large;}

	.apply{margin-left: 1rem;}

	h3 {margin-left: 1rem;}

	.wrapper { margin-left: 1rem; margin-right: 3rem;}


	
	

</style>

<div class="apply">
<CustomButton on:click={()=>{convert()}}>Apply Changes</CustomButton>
<CustomButton on:click={copyToClip}>Copy to Clipboard</CustomButton>
</div>
<div class="wrapper">
<h3 class="{$darkModeOn ? "dark" : "light"}">{userMessage}</h3>
<textarea bind:value></textarea>

<textarea class="{$darkModeOn ? "dark" : "light"}" id="frogTxt">
	{newText}
</textarea>
</div>