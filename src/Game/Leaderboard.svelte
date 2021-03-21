

<script>
    import CustomButton from "../UI/CustomButton.svelte";
    import { darkModeOn } from '../UI/DarkModeStore.js';
    import { createEventDispatcher } from "svelte";
    export let score;

    let savedScores;
    let orderedScores
    let scoreIsSaved = false
    let showPublic = false

    const dispatch = createEventDispatcher();
    
	let name = '';

    function saveScore(){
    console.log(score)
    let newObj = { username: name, score: score }

    fetch(`https://svelte-firebase-bknd-default-rtdb.europe-west1.firebasedatabase.app/Leaderboard.json`, {
        method: "POST",
        body: JSON.stringify(newObj),
        headers: { 'Content-Type': 'application/json'}
    }).then(res => {if (!res.ok ){
        throw new Error('Put request failed')
    }
    collectPublicScores()
    }).catch(err => {
        console.log(err);
    })

    scoreIsSaved = true
}

function collectPublicScores(){
//GET is default if not specified
  fetch(`https://svelte-firebase-bknd-default-rtdb.europe-west1.firebasedatabase.app/Leaderboard.json`)
  .then(res => {if (!res.ok ){
  throw new Error('Get request failed');}
  return res.json()
  })
  .then(data => {
    savedScores = data;
    console.log(savedScores)
    savedScores= Object.values(data);
    console.log(savedScores)
    orderedScores = savedScores.sort((a, b) => (a.score > b.score) ? -1 : 1)
    console.log(orderedScores)
    showPublic = true
    

  }).catch(err => {console.log(err)})
}

function collapse(){
        dispatch('close-board')}

</script>

<style>
.light { margin-left: 1rem; }

.dark { margin-left: 1rem; color: rgb(206,205,206)}

input {
    margin-left: 1rem;
}

.highLightscore {
    color: rgb(185, 69, 179)
}

.public {
    color: rgb(138, 179, 78);
}

</style>


<h1 class="{$darkModeOn ? "dark" : "light"}" >Leaderboard</h1>

<h3 class="{$darkModeOn ? "dark" : "light"}" >Username: {name}</h3>
<input bind:value={name}>

<CustomButton on:click="{saveScore}">Submit score</CustomButton>

{#if scoreIsSaved && showPublic === true}
<CustomButton on:click="{collapse}">Close Leaderboard</CustomButton>
{#each orderedScores as orderedScore}
<div class="{$darkModeOn ? "dark" : "light"}">
  <h3>{orderedScore.username }<span class={name === orderedScore.username ? "highLightscore" : 'public'}>{ orderedScore.score}</span></h3>
</div>
{/each}
{/if}


