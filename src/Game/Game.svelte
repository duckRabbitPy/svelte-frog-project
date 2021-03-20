<script>
import CustomButton from "../UI/CustomButton.svelte";
import { onMount } from 'svelte';
import { darkModeOn } from "../UI/DarkModeStore.js";

  
  let tl_src;
  let tl_correct = false;

  let tm_src;
  let tm_correct = false;

  let tr_src;
  let tr_correct = false;

  let ml_src;
  let ml_correct = false;

  let mm_src;
  let mm_correct = false;

  let mr_src;
  let mr_correct = false;

  let bl_src;
  let bl_correct = false;

  let bm_src;
  let bm_correct = false;

  let br_src;
  let br_correct = false;

  let gl_src;
  let gl_correct = false;

  let gm_src;
  let gm_correct = false;

  let gr_src;
  let gr_correct = false;

  let mission = "";

  let lillyImg = "/images/lilly.png";

  let pondArray = [
    {Creature:"Duck", Src:"/images/lillyDuck.png"},
    {Creature:"Frog", Src:"/images/lillyFrog.png"},
    {Creature:"Python", Src:"/images/lillyPython.png"},
    {Creature:"Rabbit", Src:"/images/lillyRabbit.png"}]

  let toSelectFrom = []

  let memorising = false;
  let score = 0;
  let timeToMemorize = 6000;
  let remaining;
  let inplay = true;
  let nextRound = false;
  let recentlyClicked = [];

  $: if (remaining === 0){
    nextRound = true
    inplay = false

    setTimeout(()=>{startNextRound()
    nextRound = false
    inplay = true},1000)
    let goodBlip = document.querySelector(".goodBlip");
    goodBlip.play()
    
  }
 

  onMount(()=>{hideCreatures()});


  function startNewGame(){
    console.log(darkModeOn)
    let music = document.querySelector(".music")
    music.play()
    score = 0;
    memorising = false;
    timeToMemorize = 6000;
    remaining;
    inplay = true;
    nextRound = false;
    recentlyClicked = [];
    
    startNextRound()
  }


  function startNextRound(){
    toSelectFrom = [];

    choosePondElements()
    if(timeToMemorize > 700){timeToMemorize -= 200;}

    let findCreature = toSelectFrom[getRandomInt(toSelectFrom.length)]

    assignMission(findCreature)
    remaining = countNumToFind(toSelectFrom)

    letPlayerMemorise()
    

  }

  function assignMission(creature){
    mission = creature
  }

  function countNumToFind(arr){

    let numOfSelected = arr.filter(
      function(elem){
        return elem === mission;}
        )
        .length;
    
    return numOfSelected;

  }


  function letPlayerMemorise(){
    memorising = true 
    setTimeout(()=>{hideCreatures();},timeToMemorize)
  }

  function hideCreatures(){
    memorising = false;

    tl_src = lillyImg;
    tm_src = lillyImg;
    tr_src = lillyImg;
    ml_src = lillyImg;
    mm_src = lillyImg;
    mr_src = lillyImg;
    bl_src = lillyImg;
    bm_src = lillyImg;
    br_src = lillyImg;
    gl_src = lillyImg;
    gm_src = lillyImg;
    gr_src = lillyImg
  }

  function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));}


  function correct(event){
    
    for(let x= 0;x<pondArray.length; x++){
      if(pondArray[x].Creature === mission){
        event.target.src = pondArray[x].Src
      }
    } 

    if(event.target.classList[0] != recentlyClicked[recentlyClicked.length - 1]){
    score += 100;
    remaining -= 1;
    recentlyClicked.push(event.target.classList[0])}

  }

  function incorrect(event){
    event.target.src="/images/incorrect.png";
    let allOver = document.querySelector(".allOver");
    score = `final score is ${score} `
    allOver.play()
  }

  //consider refactoring to follow DRY principle
  function choosePondElements(){
    let tl_Obj = pondArray[getRandomInt(4)]
    tl_src = tl_Obj.Src
    tl_correct = tl_Obj.Creature

    let tm_Obj = pondArray[getRandomInt(4)]
    tm_src = tm_Obj.Src
    tm_correct = tm_Obj.Creature

    let tr_Obj = pondArray[getRandomInt(4)]
    tr_src = tr_Obj.Src
    tr_correct = tr_Obj.Creature

    let ml_Obj = pondArray[getRandomInt(4)]
    ml_src = ml_Obj.Src
    ml_correct = ml_Obj.Creature

    let mm_Obj = pondArray[getRandomInt(4)]
    mm_src = mm_Obj.Src
    mm_correct = mm_Obj.Creature

    let mr_Obj = pondArray[getRandomInt(4)]
    mr_src = mr_Obj.Src
    mr_correct = mr_Obj.Creature

    let bl_Obj = pondArray[getRandomInt(4)]
    bl_src = bl_Obj.Src
    bl_correct = bl_Obj.Creature

    let bm_Obj = pondArray[getRandomInt(4)]
    bm_src = bm_Obj.Src
    bm_correct = bm_Obj.Creature

    let br_Obj = pondArray[getRandomInt(4)]
    br_src = br_Obj.Src
    br_correct = br_Obj.Creature

    let gl_Obj = pondArray[getRandomInt(4)]
    gl_src = gl_Obj.Src
    gl_correct = gl_Obj.Creature

    let gm_Obj = pondArray[getRandomInt(4)]
    gm_src = gm_Obj.Src
    gm_correct = gm_Obj.Creature

    let gr_Obj = pondArray[getRandomInt(4)]
    gr_src = gr_Obj.Src
    gr_correct = gr_Obj.Creature

    toSelectFrom.push(tl_correct,tm_correct,tr_correct,ml_correct,mm_correct,mr_correct,bl_correct,bm_correct,br_correct,gl_correct,gm_correct,gr_correct)
  
  }


</script>

<style>

.grid-container {
  /* background-color: rgba(152, 188, 255, 0.89); */
  background: url("/images/pond-monet.jpeg");
  border-radius: 5%;
  margin-left: 3rem;
  margin-right: 3rem;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-template-rows: 25% 25% 25% 25%;
  gap: 0px 0px;
  grid-template-areas:
    "tl tm tr"
    "ml mm mr"
    "bl bm br"
    "gl lm gr";
}

img {
  margin-left: 20%;
  margin-right: 20%;
  width: 100px;
}

img:hover {
  box-shadow: 10px 10 10px 0 rgba(14, 255, 14, 0.452);
}

.h1-light { margin-left: 1rem; }

.h1-dark { margin-left: 1rem; color: rgb(206,205,206)}

.btnDiv {
  margin-left: 1rem;
}


</style>

{#if inplay}
<h1 class="{$darkModeOn ? "h1-dark" : "h1-light"} ">Find {mission ? mission + 's' : ""}</h1>
<h1 class="{$darkModeOn ? "h1-dark" : "h1-light"} ">Score: {score}</h1>
<div class="btnDiv">
  <CustomButton on:click={startNewGame}>Start new game</CustomButton>
</div>
<div class="grid-container">
<img src="{tl_src}" alt="lilly" class="tl" on:click="{event => {if(!memorising){tl_correct === mission  ? correct(event) : incorrect(event) }}}">
<img src="{tm_src}" alt="lilly" class="tm" on:click="{event => {if(!memorising){tm_correct === mission  ? correct(event) : incorrect(event) }}}">
<img src="{tr_src}" alt="lilly" class="tr" on:click="{event => {if(!memorising){tr_correct === mission  ? correct(event) : incorrect(event) }}}">
<img src="{ml_src}" alt="lilly" class="ml" on:click="{event => {if(!memorising){ml_correct === mission  ? correct(event) : incorrect(event) }}}">
<img src="{mm_src}" alt="lilly" class="mm" on:click="{event => {if(!memorising){mm_correct === mission  ? correct(event) : incorrect(event) }}}">
<img src="{mr_src}" alt="lilly" class="mr" on:click="{event => {if(!memorising){mr_correct === mission  ? correct(event) : incorrect(event) }}}">
<img src="{bl_src}" alt="lilly" class="bl" on:click="{event => {if(!memorising){bl_correct === mission  ? correct(event) : incorrect(event) }}}">
<img src="{bm_src}" alt="lilly" class="bm" on:click="{event => {if(!memorising){bm_correct === mission  ? correct(event) : incorrect(event) }}}">
<img src="{br_src}" alt="lilly" class="br" on:click="{event => {if(!memorising){br_correct === mission  ? correct(event) : incorrect(event) }}}">
<img src="{gl_src}" alt="lilly" class="gl" on:click="{event => {if(!memorising){gl_correct === mission  ? correct(event) : incorrect(event) }}}">
<img src="{gm_src}" alt="lilly" class="gm" on:click="{event => {if(!memorising){gm_correct === mission  ? correct(event) : incorrect(event) }}}">
<img src="{gr_src}" alt="lilly" class="gr" on:click="{event => {if(!memorising){gr_correct === mission  ? correct(event) : incorrect(event) }}}">
</div>
{/if}
{#if nextRound}
<h1 class="{$darkModeOn ? "h1-dark" : "h1-light"}" >Next Round!!!</h1>
{/if}

<audio class="music" src="/audio/start.mp3"></audio>
<audio class="goodBlip" src="/audio/correctSound.mp3"></audio>
<audio class="allOver" src="/audio/gameOver.mp3"></audio>
