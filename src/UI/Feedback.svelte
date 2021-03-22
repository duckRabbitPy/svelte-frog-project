<script>
  import { fade } from "svelte/transition";
  import CustomButton from "../UI/CustomButton.svelte";
  import Selector from "../UI/Selector.svelte"
  import { darkModeOn } from "../UI/DarkModeStore.js";

  export let numStars


  let btnMsg = "Share feedback";
  let disableBtn = false;
  let newUser = '';
  let newComment = '';
  let newRating = '';
  let storedComments = '';

  //for the incoming
  let frogStars = createFrogStars(numStars)

  function createFrogStars(numStars){
    let numFrogs = [];
    for(let x=0; x<numStars; x++){
      numFrogs += '🐸'
    }
    return numFrogs
  }

  //for the users
  function setStars(event){
    newRating = event.detail
  }

  function sendToBase(){
    btnMsg = "Thanks!"
    disableBtn = true
    let data = {User: newUser, Comment: newComment, Rating: newRating }
    saveFeedback(data)
  }

  //GET is default if not specified
  function getFeedback(){
  fetch('FEEDBACK_COMMENTS_API_KEY')
  .then(res => {if (!res.ok ){
  throw new Error('Get request failed');}
  return res.json()
  })
  .then(data => {
    storedComments = data;
    storedComments = Object.values(data);
  }).catch(err => {console.log(err)})};


  
  function saveFeedback(data){

    if(data){

    //must be .json endpoint
    fetch(`FEEDBACK_COMMENTS_API_KEY`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json'}
  }).then(res => {if (!res.ok ){
    throw new Error('Post request failed')
  }
  //space for further data manipulatin
  getFeedback()
  }).catch(err => {
    console.log(err);
  })
}}

</script>
<style>

  

@media screen and (min-width: 1065px){

  h3, h2, p {
    margin: 1rem;
  }
    .commentCard-light {
    background: white;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    padding: 1rem;
    margin-left: auto;
    margin-right: auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
    width: 70%;
  }

  .commentCard-dark {
    background: rgb(206,206,206);
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    padding: 1rem;
    margin-left: auto;
    margin-right: auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
    width: 70%;
  }

  .grid-container {
  margin-left: auto;
  margin-right: auto;
  background-color: #324A5E;;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  width: 72%;
  height: 60%;
  color: white;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "h1 h1 h1 ."
    "User comment comment ."
    ". . . .";
}
.h1 { grid-area: h1; padding: 1rem;}
.User {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "userInput userInput userInput"
    "rating rating rating";
  grid-area: User;
}
.userInput { grid-area: userInput; padding: 1rem; }
.rating { grid-area: rating; padding: 1rem; }
.comment { grid-area: comment; padding: 1rem; margin: 2rem; min-width: 400px; background-color: #4CDBC3;}

textarea {
  width: 100%;
}

textarea.commentInput {
  height: 100px;
}

header { padding-bottom: 1rem;
}

.btnPad {
  padding: 1rem;
}

img { margin-left: 1rem; width: 5rem;}

}

/* mobile */
img{
  width: 10%;
}



.commentCard-light {
  padding-left: 1rem;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  display: flex;
  justify-content: space-evenly;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 70%;
}

.commentCard-dark {
  padding-left: 1rem;
  background: rgb(206,206,206);
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  display: flex;
  justify-content: space-evenly;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 70%;
}

.grid-container {
  padding-left: 1rem;
}

.hoppy-light {
  color: #4CDBC3;
}

.hoppy-dark {
  color: rgb(206,206,206);
}


</style>
<div class="{$darkModeOn ? "commentCard-dark" : "commentCard-light"}" in:fade>
<h3>User: Anon</h3>
<p><i>"Good work, keep it up, keep learning!"</i></p>
<h2>🐸🐸🐸🐸</h2>
</div>


  {#each storedComments as storedComment }
  <div class="{$darkModeOn ? "commentCard-dark" : "commentCard-light"}">
    <h3>User: {storedComment.User}</h3>
    <p><i>{storedComment.Comment}</i></p>
    <h2>{storedComment.Rating}</h2>
  </div>
  {/each}


<div class="grid-container">
  <div class="h1">
      <h1 class="{$darkModeOn ? "hoppy-dark" : "hoppy-light"}">Feedback makes me hoppy!</h1>
      <img src="/images/frog.png" alt="frog"/>
  </div>
 
  <div class="User">
    <div class="userInput"> 
      <header>Username (Anon by default)</header>
      <textarea on:input={event => (newUser = event.target.value)}>Anon</textarea>
    </div>
    <div class="rating">
      <header>Frog star rating</header>
      <Selector on:pass-up-stars="{setStars}"/>
    </div>
  </div>
  <div class="comment">
  <textarea class="commentInput" on:input={event => (newComment = event.target.value)}></textarea>
  <div class="btnPad">
    <CustomButton disabled={disableBtn} on:click="{sendToBase}">{btnMsg}</CustomButton>
  </div>
  </div>
</div>