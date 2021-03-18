<script>

import About from "../UI/About.svelte";

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
     background: url('https://images.unsplash.com/photo-1512587823848-3813fd3c7f8c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80') no-repeat center center;
     background-size: cover;
     width: 100%;
    
     
   }
   .img-2{
     background: url('https://images.unsplash.com/photo-1541354254661-adb801adb23e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80') no-repeat center center;
     background-size: cover;
     width: 100%;
   }
   .img-3{
     background: url('https://images.unsplash.com/photo-1596852423936-251a961e9ac8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80') no-repeat center center;
     background-size: cover;
     width: 100%;
     
   }
   .img-4 {
     background: url('https://images.unsplash.com/32/RgJQ82pETlKd0B7QzcJO_5912578701_92397ba76c_b.jpg?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80') no-repeat center center;
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
       <div class="img img-1"><img src="/images/frog.png" alt="galleryImg"><h1>Memory Game</h1></div>
       <div class="img img-2"><img src="/images/frog.png" alt="galleryImg"><h1>LilyPad textEditor</h1></div>
       <div class="img img-3"><img src="/images/frog.png" alt="galleryImg"><h1>Dwarf Frog Gallery</h1></div>
       <div class="img img-4"><img src="/images/frog.png" alt="galleryImg"><h1>More coming soon...</h1></div>
   </div>