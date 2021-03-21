<script>
  import { fade, blur, fly, slide, scale } from "svelte/transition";
  import Question from "./Question.svelte";
  import Modal from "../UI/Modal.svelte";
  import CustomButton from "../UI/CustomButton.svelte";
  import { darkModeOn } from "../UI/DarkModeStore.js";

  let activeQuestion = 0;
  let score = 0;
  let quiz = getQuiz();
  let gameOver = false;
  let preventRestart = true;


  async function getQuiz() {
    const res = await fetch(
      "https://opentdb.com/api.php?amount=10&category=27"
    );
    const quiz = await res.json();
    return quiz;
  }

  function nextQuestion() {
    activeQuestion = activeQuestion + 1;
  }

  function resetQuiz() {
    score = 0;
    quiz = getQuiz();
    gameOver = false;
    preventRestart = true;
  }

  function addToScore() {
    score = score + 1;
  }

  $:if (activeQuestion === 10){
    gameOver = true
    preventRestart = false
  }

  function hideModal(){
    gameOver = false
    
  }

</script>

<style>
  .fade-wrapper {
    position: absolute;
  }

  .question-wrapper-light {
    margin: 1rem;
    margin-bottom: 25rem;
    color: black;
  }

  .question-wrapper-dark {
    margin: 1rem;
    margin-bottom: 25rem;
    color: rgb(206,206,206);
    }


</style>

<div class="{$darkModeOn ? "question-wrapper-dark" : "question-wrapper-light"}">
  <h1>Nature Quiz</h1>
  {#if preventRestart === false}
  <button on:click={resetQuiz}>Start New Quiz</button>
  {:else}
  <h3>My Score: {score}</h3>
  <h4>Question #{activeQuestion + 1}</h4>
  

  {#await quiz}
    Loading....
  {:then data}

    {#each data.results as question, index}
      {#if index === activeQuestion}
        <div in:fade class="fade-wrapper">
          <Question {addToScore} {nextQuestion} {question} />
        </div>
      {/if}
    {/each}

  {/await}
  {/if}

  {#if gameOver === true}
  <Modal title="Game Over">
    <div>
      <h1>You got {score}/10</h1>
    </div>
    <div slot="footer">
      <CustomButton btntype="button" on:click="{hideModal}">Cancel</CustomButton>
  </div>
  </Modal>
  {/if}
</div>

