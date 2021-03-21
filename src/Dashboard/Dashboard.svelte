<script>
import { createEventDispatcher } from "svelte";

const dispatch = createEventDispatcher();

function test(){dispatch("memory-game")}

</script>
<style>

   .row {
     width: 100%;
     height: 50%;
     max-width: 1500px;
     margin: 10px 0;
     display: flex;
     flex-wrap: wrap;
   }
   .img {
     height: 40%;
     padding: 5%;
     margin: 10px;
     box-shadow: 10px 14px 20px 0px rgb(83, 114, 47);
   }

   .img-1:hover {
      box-shadow: 10px 14px 20px 0px rgb(255, 251, 14);
   }

   .img-2:hover {
      box-shadow: 10px 14px 20px 0px rgb(255, 251, 14);
         }

   .img-3:hover {
      box-shadow: 10px 14px 20px 0px rgb(255, 251, 14);
      }

   .img-4:hover {
      box-shadow: 10px 14px 20px 0px rgb(255, 251, 14);
   }
   
   .img-1{
     background: url('/images/pond-image1.jpeg') no-repeat center center;
     background-size: cover;
     width: 100%;
    
     
   }
   .img-2{
     background: url('/images/pond-image2.jpeg') no-repeat center center;
     background-size: cover;
     width: 100%;
   }
   .img-3{
     background: url('/images/pond-image3.jpeg') no-repeat center center;
     background-size: cover;
     width: 100%;
     
   }
   .img-4 {
     background: url('/images/pond-image4.jpeg') no-repeat center center;
     background-size: cover;
     width: 100%;
   
     @media screen and (min-width: 800px) {
     .row{
       height: 600px; 
     }
     
     .img{
       height: 50%;  
     }
     
     .img-1,
     .img-4 {
       width: 24%;
     }
     .img-2,
     .img-3 {
       width: 70%;
     }
   }
     
   }

   h1 {
      background-color: #2C9040;
      color: white;
      padding: 1%;
   }
   
   </style>
   
   
   <div class="row">
       <div on:click="{test}" class="img img-1"><img src="/images/frog.png" alt="galleryImg"><h1>Memory Game</h1></div>
       <div class="img img-2"><img src="/images/frog.png" alt="galleryImg"><h1>LilyPad textEditor</h1></div>
       <div class="img img-3"><img src="/images/frog.png" alt="galleryImg"><h1>Dwarf Frog Gallery</h1></div>
       <div class="img img-4"><img src="/images/frog.png" alt="galleryImg"><h1>More coming soon...</h1></div>
   </div>