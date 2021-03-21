<script>

import { darkModeOn } from "./DarkModeStore.js";

</script>

<style>
    .info{
        width: 100%;
        height: 3rem;
        margin-top: 5%;
        margin-bottom: 2%;
    }

    .lightMode {
    color: rgb(7, 7, 7);
    font-size: larger;
    text-align: center;
    padding-top: 0.5rem;
    }

    .darkMode {
    color: rgb(206, 206, 206);
    font-size: larger;
    text-align: center;
    padding-top: 0.5rem;
    }

</style>

<head>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
</head>
  
  <footer class="info">
    <div>
      <p class={$darkModeOn ? "darkMode" : "lightMode"}>2021 - <b>duckRabbitPy  </b><span><i class="fab fa-github"></i></span></p>
    </div>
</footer>