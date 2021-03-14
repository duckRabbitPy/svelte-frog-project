<script>
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    import Social from "../UI/Social.svelte"
    export let id;
    export let title;
    export let subtitle;
    export let imageUrl;
    export let description;
    export let address;
    export let email;
    export let isFavItem;
    let likes = 0;
    import CustomButton from "../UI/CustomButton.svelte";
    import Badge from "../UI/Badge.svelte";

    const dispatch = createEventDispatcher();

  function captureCustomEventData(event){
      //can access data up from your custom event from detail property 
      likes = event.detail
  }
    
</script>



<style>

    article {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
      border-radius: 5px;
      background: white;
      margin: 1rem;
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
      height: 14rem;
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

    .badge {
      margin: 1rem;
    }
    
  </style>
  

<article in:fade>
    <header>
        <h1>{title}
        </h1>
        <h2>{subtitle}</h2>
        <p>Location: {address}</p>
    </header>
    <div class="image">
        <img src="{imageUrl}" alt=""/>
    </div>
    <div class="badge">
      {#if isFavItem}
        <Badge>Saved to favourites!</Badge>
      {/if}
    </div>
    <div class="content">
        <p>{description}</p>
    </div>
    <footer>
        <a href="mailto:{email}">Contact</a>
        <CustomButton on:click={() => dispatch('adopt-event')} btntype="submit">Adopt!</CustomButton>
        <CustomButton on:click={() => dispatch('toggle-favourite', id)} btntype="submit" stateColour="{isFavItem ? null : "success"}">{isFavItem ? 'Remove from favourites' : 'Add to favourites'}</CustomButton>
        <Social counterName="Likes {likes}" 
        on:pass-up-data="{captureCustomEventData}"/>
    </footer>
</article>