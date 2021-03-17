<script>
  import cartItems from "./cart-store.js";
  import CartItem from "./CartItem.svelte";
  import { darkModeOn } from "../UI/DarkModeStore.js";
  import { fade, blur, fly, slide, scale } from "svelte/transition";

  export let total;

</script>

<style>
  section {
    width: 30rem;
    max-width: 90%;
    margin: 2rem auto;
    border-bottom: 2px solid #ccc;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .cart-dark {
    color: rgb(206,206,206);
  }

  .cart-light {
    color: black;
  }

</style>

<section in:scale>
  <h1 class="{$darkModeOn ? "cart-dark" : "cart-light"}">Cart</h1>
  <ul>
    {#each $cartItems as item (item.id)}
      <CartItem id={item.id} title={item.title} price={item.price} />
    {:else}
      <p>No items in cart yet!</p>
    {/each}
    <h3 class="{$darkModeOn ? "cart-dark" : "cart-light"}">Total: £{total}</h3>
  </ul>
</section>
