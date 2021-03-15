<script>
  import { fade } from "svelte/transition";
  import CustomButton from "../UI/CustomButton.svelte";
  import Selector from "../UI/Selector.svelte"


  export let feedUser
  export let feedComment
  export let numStars

  let userRating = ''

  //for the defaults
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
    console.log("hello")
    userRating = event.detail
  }

</script>
<style>

@media screen and (min-width: 1065px){
    .commentCard {
    background: white;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    padding: 1rem;
    display: flex;
    justify-content: space-between;
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
.h1 { grid-area: h1; padding: 1rem; }
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

.commentCard {
  padding-left: 1rem;
}
.grid-container {
  padding-left: 1rem;
}


</style>
<div class="commentCard" in:fade>
<h3>User: Anon</h3>
<p><i>"Good work, keep it up, keep learning!"</i></p>
<h2>🐸🐸🐸🐸</h2>
</div>

<div class="commentCard">
    <h3>User: {feedUser}</h3>
    <p><i>{feedComment}</i></p>
    <h2>{frogStars}</h2>
</div>

<div class="grid-container">
  <div class="h1">
      <h1>Feedback makes me hoppy!</h1>
      <img src="https://www.flaticon.com/svg/vstatic/svg/424/424870.svg?token=exp=1615249621~hmac=e98a24b849aff33ebde9abf8fec9421d" alt="frog"/>
  </div>
 
  <div class="User">
    <div class="userInput"> 
      <header>Username (Anon by default)</header>
      <textarea>Anon</textarea>
    </div>
    <div class="rating">
      <header>Frog star rating</header>
      <Selector on:pass-up-stars="{setStars}"/>
    </div>
  </div>
  <div class="comment">
  <textarea class="commentInput"></textarea>
  <div class="btnPad">
    <CustomButton>Share feedback</CustomButton>
  </div>
  </div>
</div>