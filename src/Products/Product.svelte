<script>
  import cartItems from "../Cart/cart-store.js";
  import CustomButton from "../UI/CustomButton.svelte";

  import { total } from "../Cart/cart-store.js";

  export let id;
  export let title;
  export let price;
  export let description;
  export let srcVar;

  let isInCart = false;



  function addToCart() {
    cartItems.addItem({ id: id, title: title, price: price });
    $total += price
    isInCart = true
  }
</script>

<style>
  .product {
    background: white;
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
</style>

<div class="product">
  <div>
    <h1>{title}</h1>
    <h2>£{price}</h2>
    <img src="{srcVar}" alt="product">
    <p>{description}</p>
  </div>
  <div>
    <CustomButton disabled={isInCart} on:click={addToCart}>Add to Cart</CustomButton>
  </div>
</div>
