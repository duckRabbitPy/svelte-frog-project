

<script>
    import About from "../UI/About.svelte";
    import CustomButton from "../UI/CustomButton.svelte";
    import { darkModeOn } from '../UI/DarkModeStore.js';
    
	let name = '';

//     //GET is default if not specified
//   fetch(`https://svelte-firebase-bknd-default-rtdb.europe-west1.firebasedatabase.app/Leaderboard`)
//   .then(res => {if (!res.ok ){
//   throw new Error('Get request failed');}
//   return res.json()
//   })
//   .then(data => {
//     stateOfscores = data;
//     user = stateOfscores[user];
//     score = stateOfscores[score]
  

//   }).catch(err => {console.log(err)})


    function saveScore(){

    let newObj = { username: name, score: "1780"}

    fetch(`https://svelte-firebase-bknd-default-rtdb.europe-west1.firebasedatabase.app/Leaderboard.json`, {
        method: "PUT",
        body: JSON.stringify(newObj),
        headers: { 'Content-Type': 'application/json'}
    }).then(res => {if (!res.ok ){
        throw new Error('Put request failed')
    }
    //space for further data manipulatin
    }).catch(err => {
        console.log(err);
    })

    }



</script>

<style>
.light { margin-left: 1rem; }

.dark { margin-left: 1rem; color: rgb(206,205,206)}

</style>

<input bind:value={name}>

<h1 class="{$darkModeOn ? "dark" : "light"}" >Leaderboard</h1>

<h3 class="{$darkModeOn ? "dark" : "light"}" >Username {name}!</h3>

<CustomButton on:click="{saveScore}">Submit score</CustomButton>



