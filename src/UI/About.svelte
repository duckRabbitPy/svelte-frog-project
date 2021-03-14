<script>

import { handle_promise, select_multiple_value } from "svelte/internal";

</script>
<style>

    h4 {
        color: #2c9040;
    }

    @media screen and (min-width: 992px){
    .container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(1, 1fr);
    }

    .profilePic {
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 0;
        grid-row-end: 1;
    }

    img {
        width: 300px;
        border-radius: 20%;
        margin-right: 1rem;
    }

    .textInfo {
        font-family: "Roboto Slab", sans-serif;
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
        img{
            width: 40%;
            border-radius: 20%;
            padding-left: 1rem;
        }

        .textInfo {
        padding-left: 1rem;
    }


    }
</style>

<div class="container">
    
<div class="textInfo">
<h1>Hi i'm Oli</h1>
<h2>I'm an aspiring web developer from London</h2>
<h4>
    My programming ambition is to build web applications that are fast, elegant and enjoyable to use.
</h4>
<p>Like many others taking a step into coding, I started my programming journey with Python. The first 'proper' project I worked on was a health and lifestyle PyQT desktop application with FitBit data integration. To overcome the limitations of desktop apps, I decided to study the Django web framework and created a <a target="blank" href="https://cyclone.pythonanywhere.com/">fun platform</a> for 'glitch art' image processing. It was at that moment that I realised the power and potential of web development and I set on a path to seriously learn modern HTML, CSS and Javascript. 
   <br>
   <br>
   After working on a number of personal Javascript projects including an (addictive) <a target="blank" href="https://duckrabbitpython.pythonanywhere.com/blackJack">Blackjack game</a> I now consider Javascript my preferred langauge, and i'm confident and comfortable solving level 5 kata in CodeWars and 'advent of code' challenges using ES6 practices.
   <br>
   <br>
    My current frontend framework of choice is Svelte, it is an excellent tool for building performant Single Page Applications and is the framework that this portfolio was made with! Despite the relative obscurity of Svelte I believe it is a great framework for learning component based architecture as well as state management. The skills I have developed will be transferable to technologies such as React, Angular and Vue. </p>
</div>

<div class="profilePic">
<img src="https://lh3.googleusercontent.com/pw/ACtC-3cb-aP7FxlsJshnVGZ1NCOpirBBTlAxygBxiuFzFrWG5W1OvTsctH5GxSgDDaWLrg5giPiuKAdv55pB9874sz-bj78IO-k_DUoTU3sHGKDNutDBs3RL8tbfBsLy1-gmf3TUTJATY75TrVusjmuSeckz=w1124-h1420-no?authuser=0" alt="profile">
</div>

</div>