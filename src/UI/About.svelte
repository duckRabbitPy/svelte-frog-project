<script>
import { fade, fly } from "svelte/transition";
import { darkModeOn } from "./DarkModeStore.js";

</script>
<style>

    h4 {
        color: #2c9040;
    }

    .darkMode {
        color: rgb(206, 206, 206);
    }

    .lightMode {
        color: black;
    }

    .darkModeLink {
        color: darkturquoise;
        text-decoration: underline;
    }

    .lightModeLink {
        color: dodgerblue;
        text-decoration: underline;
    }

    @media screen and (min-width: 992px){
    .container {
        display: grid;
        grid-template-columns: repeat(2, 1);
        grid-template-rows: repeat(1, 1);
    }

    .profilePic {
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 0;
        grid-row-end: 1;
    }

    .iconContainer {
        grid-column-start: 0;
        grid-column-end: 1;
        grid-row-start: 2;
        grid-row-end: 3;
    }

    .compIcons{
        height: 100px;
        padding-top: 1rem;
        padding-right: 0.5rem;
        padding-left: 0.5rem;
    }

    .profileImg {
        width: 300px;
        border-radius: 20%;
        margin-right: 1rem;

    }

    .textInfo {
        font-family: "Roboto Slab", sans-serif;
        font-size: large;
        padding-left: 1rem;
        padding-right: 2rem;
        margin-right: 1rem;
        grid-column-start: 0;
        grid-column-end: 1;
        grid-row-start: 0;
        grid-row-end: 1;
    }
    }

    @media screen and (max-width: 991px){
    .profileImg{
        width: 40%;
        border-radius: 20%;
        padding-left: 1rem;
        padding-top: 1rem;
        }

    .textInfo {
    padding-left: 1rem;
    padding-right: 1rem;
    }

    .compIcons{
        display: none;
    }

    h3 {
        display: none;}

    }
</style>

<div class="container" in:fly>
    
<div class="textInfo"> 
<h1 class={$darkModeOn ? "darkMode" : "lightMode"}>Hi i'm Oli</h1>
<h2 class={$darkModeOn ? "darkMode" : "lightMode"}>I'm a hobbyiest web developer from London</h2>
<h4 class={$darkModeOn ? "darkMode" : "lightMode"}>
    My programming ambition is to build web applications that are fast, elegant and enjoyable to use.
</h4>
<p class={$darkModeOn ? "darkMode" : "lightMode"}>Like many others taking a step into coding, I started my programming journey with Python. The first 'proper' project I worked on was a health and lifestyle PyQT desktop application with FitBit data integration. To overcome the limitations of desktop apps, I decided to study the Django web framework and created a <a class={$darkModeOn? "darkModeLink" : "lightModeLink"} target="blank" href="https://cyclone.pythonanywhere.com/">fun platform</a> for 'glitch art' image processing. It was at that moment that I realised the power and potential of web development and I set on a path to seriously learn modern HTML, CSS and Javascript. 
   <br>
   <br>
   After working on a number of personal Javascript projects including an (addictive) <a class={$darkModeOn ? "darkModeLink" : "lightModeLink"} target="blank" href="https://duckrabbitpython.pythonanywhere.com/blackJack">Blackjack game</a>, I now consider Javascript my preferred langauge, and i'm confident and comfortable solving level 5 kata in CodeWars and 'advent of code' challenges using ES6 practices.
   <br>
   <br>
    My current frontend framework of choice is Svelte, it is an excellent tool for building performant Single Page Applications and is the framework that this portfolio was made with! Despite the relative obscurity of Svelte I believe it is a great framework for learning component based architecture as well as state management. The skills I have developed will be transferable to technologies such as React, Angular and Vue. </p>
    Contact me at: <address><a class={$darkModeOn ? "darkModeLink" : "lightModeLink"} href="mailto:duck.rabbit.python@gmail.com">duck.rabbit.python@gmail.com</a></address>
    <h3 class={$darkModeOn ? "darkMode" : "lightMode"}>My core competencies:</h3>
</div>

<div in:fade class="iconContainer">
   
    <img class="compIcons" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/1200px-Svelte_Logo.svg.png" alt="svelte logo">
    <img class="compIcons" src="https://cdn.iconscout.com/icon/free/png-256/javascript-2752148-2284965.png" alt="javascript logo">
    <img class="compIcons" src="https://miro.medium.com/max/792/1*lJ32Bl-lHWmNMUSiSq17gQ.png" alt="css and html logo">
    <img class="compIcons" src="https://automationpanda.files.wordpress.com/2017/09/django-logo-negative.png" alt="django logo">
    <img class="compIcons" src="https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/267_Python-512.png" alt="python logo">
</div>

<div class="profilePic">
<img class="profileImg" src="https://lh3.googleusercontent.com/pw/ACtC-3cb-aP7FxlsJshnVGZ1NCOpirBBTlAxygBxiuFzFrWG5W1OvTsctH5GxSgDDaWLrg5giPiuKAdv55pB9874sz-bj78IO-k_DUoTU3sHGKDNutDBs3RL8tbfBsLy1-gmf3TUTJATY75TrVusjmuSeckz=w1124-h1420-no?authuser=0" alt="profile">
</div>

</div>