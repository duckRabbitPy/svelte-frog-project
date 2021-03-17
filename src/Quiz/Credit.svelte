<script>
    import { darkModeOn } from "../UI/DarkModeStore.js";
</script>

<style>
    .credit-light{
        display: flex;
        align-items: baseline;
        justify-content: center;
        color: black;
    }

    .credit-dark{
        display: flex;
        align-items: baseline;
        justify-content: center;
        color: rgb(206,206,206);
    }

    .darkModeLink {
        color: darkturquoise;
        text-decoration: underline;
    }

    .lightModeLink {
        color: dodgerblue;
        text-decoration: underline;
    }

</style>

<div class="{$darkModeOn ? "credit-dark" : "credit-light"}">
    <p>Questions provided by: <span>
      <ul>
        <em>
          <a class="{$darkModeOn ? "darkModeLink" : "lightModeLink"}" href="https://opentdb.com">Open Trivia API</a>
        </em>
      </ul>
    </span>
  </p> 
  </div>
  