<script>
    import { createEventDispatcher } from 'svelte';
    import { darkModeOn } from "../UI/DarkModeStore.js";
    import { fade } from 'svelte/transition';
    import { beforeUpdate, afterUpdate } from 'svelte';


    export let orphans
    import count from "./adopt-store.js"


    let title = orphans.title
    let subtitle = orphans.subtitle
    let imageUrl = orphans.imageUrl
    let description = orphans.description
    let address = orphans.address
    let email = orphans.email

    on:afterUpdate(()=>{$count += getRandomInt(20)})

    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
}

  

    import CustomButton from "../UI/CustomButton.svelte";

    const dispatch = createEventDispatcher();

</script>



<style>

    article {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
      border-radius: 5px;
      margin: 1rem;
      border-radius: 5px;
      grid-template-columns: repeat(2, 1fr);
    }


    .lightMode {
      background: white;
    }

    .darkMode {
      background: rgb(206, 206, 206);
    }
  
    header,
    .content,
    footer {
      padding: 1rem;
    }

    header {
      height: 8rem;
    }
  
    .image {
      width: 100%;
      height: 100%;
    }
  
    .image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  
    h1 {
      font-size: 1.25rem;
      margin: 0.5rem 0;
      font-family: "Roboto Slab", sans-serif;
    }
  
    h2 {
      font-size: 1rem;
      color: #808080;
      margin: 0.5rem 0;
    }
  
    p {
      font-size: 1.25rem;
      margin: 0;
    }
  
    div {
      text-align: right;
    }

    .content {
        height: 7rem;
    }
    
  </style>
  

<article class="{$darkModeOn ? "darkMode" : "lightMode"}" in:fade>
    <header>
        <h1>Up for re-homing!</h1>
        <h1>{title}
        </h1>
        <h2>{subtitle}</h2>
        <p>Location: {address}</p>
    </header>
    <div class="image">
        <img src="{imageUrl}" alt=""/>
    </div>
    <div class="content">
        <p>{description}</p>
        <p>Number of views today: {$count}</p>
    </div>
    <footer>
        <a href="mailto:{email}">Contact</a>
        <CustomButton btntype="submit">Remove Advert </CustomButton>
    </footer>
</article>