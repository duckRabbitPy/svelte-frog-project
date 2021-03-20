<script>
import CustomButton from "../UI/CustomButton.svelte";
import { onMount } from 'svelte';

  let tl;
  let tm;
  let tr;
  let ml;
  let mm; 
  let mr;
  let bl; 
  let bm; 
  let br;
  let gl;
  let gm;
  let gr;

  let mission = "";

  let positionArray = [tl,tm,tr,ml,mm,mr,bl,bm,br]

  let DuckImg = "/images/lillyDuck.png";
  let FrogImg = "/images/lillyFrog.png";
  let PythonImg = "/images/lillyPython.png";
  let RabbitImg = "/images/lillyRabbit.png";
  let lillyImg = "/images/lilly.png";

  let pondArray = [DuckImg,FrogImg,PythonImg,RabbitImg,lillyImg]
  let strPondArray = ["Duck", "Rabbit", "Python", "Frog"]

  onMount(()=>{hideCreatures()});


  function hideCreatures(){
    tl = lillyImg;
    tm = lillyImg;
    tr = lillyImg;
    ml = lillyImg;
    mm = lillyImg;
    mr = lillyImg;
    bl = lillyImg;
    bm = lillyImg;
    br = lillyImg;
    gl = lillyImg;
    gm = lillyImg;
    gr = lillyImg
  }

  function startGame(){
    console.log("start")
    choosePondElements()
    let findCreature = strPondArray[getRandomInt(4)]
    assignMission(findCreature)
    
    
    letPlayerMemorise()
    

  }

  function assignMission(creature){
    mission = creature
  }

  function choosePondElements(){
    tl = pondArray[getRandomInt(5)];
    tm = pondArray[getRandomInt(5)];
    tr = pondArray[getRandomInt(5)];
    ml = pondArray[getRandomInt(5)];
    mm = pondArray[getRandomInt(5)];
    mr = pondArray[getRandomInt(5)];
    bl = pondArray[getRandomInt(5)];
    bm = pondArray[getRandomInt(5)];
    br = pondArray[getRandomInt(5)];
    gl = pondArray[getRandomInt(5)];
    gm = pondArray[getRandomInt(5)];
    gr = pondArray[getRandomInt(5)];

  }

  function letPlayerMemorise(){
    setTimeout(()=>{hideCreatures()},4000)
  }

  function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));}



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
<div class="grid-container">
<img src="{tl}" alt="lilly">
<img src="{tm}" alt="lilly">
<img src="{tr}" alt="lilly">
<img src="{ml}" alt="lilly">
<img src="{mm}" alt="lilly">
<img src="{mr}" alt="lilly">
<img src="{bl}" alt="lilly">
<img src="{bm}" alt="lilly">
<img src="{br}" alt="lilly">
<img src="{gl}" alt="lilly">
<img src="{gm}" alt="lilly">
<img src="{gr}" alt="lilly">
</div>

<div>
<CustomButton on:click={startGame}>Start Game</CustomButton>
</div>

