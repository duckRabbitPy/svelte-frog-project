<script>
  export let question;
  export let nextQuestion;
  export let addToScore;


  let isCorrect;
  let isAnswered = false;
  let answers = question.incorrect_answers.map(answer => {
    return {
      answer,
      correct: false
    };
  });

  let allAnswers = [
    ...answers,
    {
      answer: question.correct_answer,
      correct: true
    }
  ];

  shuffle(allAnswers);

  function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

  function checkQuestion(correct) {
    if (!isAnswered) {
      isAnswered = true;
      isCorrect = correct;
      if (correct) {
        addToScore();
      }
    }
  }

</script>

<style>
  p {
    color: #2c9040;
  }

  .answerBtn {
    margin-right: 0.5rem;
  }

  .right {
    font-size: larger;
    padding: 1rem;
    border-radius: 10%;
    background-color: rgb(181, 243, 118);
    color: black;
  }

  .wrong {
    font-size: larger;
    padding: 1rem;
    border-radius: 10%;
    background-color: rgb(243, 166, 166);
    color: black;
  }




</style>

<h3>
  {@html question.question}
</h3>
{#if isAnswered}
  <h5>
    {#if isCorrect}<span class="right">Correct! 😃</span>{:else}<span class="wrong">Incorrect 😬</span>{/if}
  </h5>
{/if}

{#each allAnswers as answer}
  <button class="answerBtn" disabled={isAnswered} on:click={() => checkQuestion(answer.correct)}>
    {@html answer.answer}
  </button>
{/each}

{#if isAnswered}
  <div>
    <button on:click={nextQuestion}>Next Question</button>
  </div>
{/if}

