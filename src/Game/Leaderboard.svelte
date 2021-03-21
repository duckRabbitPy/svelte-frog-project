

<script>
    import CustomButton from "../UI/CustomButton.svelte";
    import { darkModeOn } from '../UI/DarkModeStore.js';
    export let score;
    
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
    console.log(score)
    let newObj = { username: name, score: score }

    fetch(`https://svelte-firebase-bknd-default-rtdb.europe-west1.firebasedatabase.app/Leaderboard/UserObject.json`, {
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

input {
    margin-left: 1rem;
}

</style>



<h1 class="{$darkModeOn ? "dark" : "light"}" >Leaderboard</h1>

<h3 class="{$darkModeOn ? "dark" : "light"}" >Username {name}!</h3>
<input bind:value={name}>

<CustomButton on:click="{saveScore}">Submit score</CustomButton>



