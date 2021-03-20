<script>
import CustomButton from "../UI/CustomButton.svelte";
import { onMount } from 'svelte';

  let tl;
  let tl_src;
  let tl_correct = false;

  let tm;
  let tm_src;
  let tm_correct = false;

  let tr;
  let tr_src;
  let tr_correct = false;

  let ml;
  let ml_src;
  let ml_correct = false;

  let mm; 
  let mm_src;
  let mm_correct = false;

  let mr;
  let mr_src;
  let mr_correct = false;

  let bl; 
  let bl_src;
  let bl_correct = false;

  let bm;
  let bm_src;
  let bm_correct = false;

  let br;
  let br_src;
  let br_correct = false;

  let gl;
  let gl_src;
  let gl_correct = false;

  let gm;
  let gm_src;
  let gm_correct = false;

  let gr;
  let gr_src;
  let gr_correct = false;

  let mission = "";

  let lillyImg = "/images/lilly.png";

  let pondArray = [
    {Creature:"Duck", Src:"/images/lillyDuck.png"},
    {Creature:"Frog", Src:"/images/lillyFrog.png"},
    {Creature:"Python", Src:"/images/lillyPython.png"},
    {Creature:"Rabbit", Src:"/images/lillyRabbit.png"}]
 

  onMount(()=>{hideCreatures()});


  function hideCreatures(){
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

  function startGame(){
    choosePondElements()
    let findCreature = pondArray[getRandomInt(4)].Creature
    assignMission(findCreature)
    
    
    letPlayerMemorise()
    

  }

  function assignMission(creature){
    mission = creature
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
    ml_src = tr_Obj.Src
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

  }


  function letPlayerMemorise(){
    setTimeout(()=>{hideCreatures()},3000)
  }

  function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));}


  function checkIfCorrect(){

  }

</script>

<style>

.grid-container {
  background-color: rgba(152, 188, 255, 0.89);
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
  width: 40%;
}

img:hover {
  box-shadow: 10px 14px 20px 0px rgba(14, 255, 14, 0.452);
}

</style>

<h1>Find {mission} </h1>
<div>
  <CustomButton on:click={startGame}>Start Game</CustomButton>
</div>
<div class="grid-container">
<img src="{tl_src}" alt="lilly" on:click="{event =>{if(tl_correct === mission){event.target.src="/images/correct.png"}}}">
<img src="{tm_src}" alt="lilly" on:click="{event =>{if(tm_correct === mission){event.target.src="/images/correct.png"}}}">
<img src="{tr_src}" alt="lilly" on:click="{event =>{if(tr_correct === mission){event.target.src="/images/correct.png"}}}">
<img src="{ml_src}" alt="lilly" on:click="{event =>{if(ml_correct === mission){event.target.src="/images/correct.png"}}}">
<img src="{mm_src}" alt="lilly" on:click="{event =>{if(mm_correct === mission){event.target.src="/images/correct.png"}}}">
<img src="{mr_src}" alt="lilly" on:click="{event =>{if(mr_correct === mission){event.target.src="/images/correct.png"}}}">
<img src="{bl_src}" alt="lilly" on:click="{event =>{if(bl_correct === mission){event.target.src="/images/correct.png"}}}">
<img src="{bm_src}" alt="lilly" on:click="{event =>{if(bm_correct === mission){event.target.src="/images/correct.png"}}}">
<img src="{br_src}" alt="lilly" on:click="{event =>{if(br_correct === mission){event.target.src="/images/correct.png"}}}">
<img src="{gl_src}" alt="lilly" on:click="{event =>{if(gl_correct === mission){event.target.src="/images/correct.png"}}}">
<img src="{gm_src}" alt="lilly" on:click="{event =>{if(gm_correct === mission){event.target.src="/images/correct.png"}}}">
<img src="{gr_src}" alt="lilly" on:click="{event =>{if(gr_correct === mission){event.target.src="/images/correct.png"}}}">
</div>

