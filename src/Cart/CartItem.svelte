<script>
  import cartItems from "./cart-store.js";
  import { products } from "../Products/products-store.js";
  import CustomButton from "../UI/CustomButton.svelte";
  import { total } from "../Cart/cart-store";

  export let title;
  export let price;
  export let id;

  let showDescription = false;
  let description = "Awesome FREE 4k resolution download, be the envy of your friends!";


  function displayDescription() {
    showDescription = !showDescription;
  
    const unsubscribe = products.subscribe(prods => {
      description = prods.find(p => p.id === id).description;
    });
    unsubscribe();
  }

  function removeFromCart() {
    cartItems.removeItem(id);
    $total -= price
  }
</script>

<style>
  li {
    margin: 1rem 0;
    border-radius: 5px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    padding: 1rem;
  }

  h1,
  h2 {
    font-size: 1rem;
    margin: 0;
  }

  h2 {
    color: #494949;
    margin-bottom: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;;
  }
</style>

<li>
  <h1>{title}</h1>
  <h2>£{price}</h2>
  <CustomButton mode="outline" on:click={displayDescription}>
    {showDescription ? 'Hide Description' : 'Show Description'}
  </CustomButton>
  <CustomButton on:click={removeFromCart}>Remove from Cart</CustomButton>
  {#if showDescription}
    <p>{description}</p>
  {/if}
</li>
