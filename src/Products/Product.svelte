<script>
  import cartItems from "../Cart/cart-store.js";
  import CustomButton from "../UI/CustomButton.svelte";
  import { darkModeOn } from "../UI/DarkModeStore.js";
  import { fade, blur, fly, slide, scale } from "svelte/transition";

  import cart, { total } from "../Cart/cart-store.js";

  export let id;
  export let title;
  export let price;
  export let description;
  export let srcVar;

let isInCart = "";
  
//get can be used if you are not subscribed to a store to get the value
import { get } from 'svelte/store';


  function addToCart() {
    let currItems = get(cart);
    for(let x=0; x<currItems.length; x++){
      if(currItems[x].id === id){
        isInCart = "Hey! Leave some frogs for the rest of us!!!"
      }
    }

    cartItems.addItem({ id: id, title: title, price: price });
    $total += price
  }

</script>

<style>
  .product-light {
    background: white;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    margin: 1rem 0rem 1rem 0rem;
  }

  .product-dark {
    background: rgb(206,206,206);
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    margin: 1rem 0rem 1rem 0rem;
  }

  h1 {
    font-size: 1.25rem;
    font-family: "Roboto Slab",sans-serif;
    margin: rem;
  }

  h2 {
    font-size: 1rem;
    margin: 0;
    color: #494949;
    font-family: "Roboto slab", sans-serif;
  }

  p {
    margin: 0;
    font-family: "Roboto slab", sans-serif;
  }

  img {
    max-width: 100px
  }

  .isInCart {
    color: tomato;
  }
</style>

<div in:scale class="{$darkModeOn ? "product-dark" : "product-light"}">
  <div>
    <h1>{title}</h1>
    <h2>£{price}</h2>
    <img src="{srcVar}" alt="product">
    <p>{description}</p>
    <p class="isInCart">{isInCart}</p>
  </div>
  <div>
    <CustomButton on:click={addToCart}>Add to Cart</CustomButton>
  </div>
</div>
