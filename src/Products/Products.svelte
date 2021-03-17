<script>
  import { products } from './products-store.js';
  import Product from "../Products/Product.svelte";
  import { darkModeOn } from "../UI/DarkModeStore.js";

</script>

<style>
  section {
    width: 30rem;
    max-width: 90%;
    margin: 2rem auto;
  }

  .products-dark {
    color: rgb(206,206,206);
  }

  .products-light {
    color: black;
  }

</style>

<section>
  <h1 class="{$darkModeOn ? "products-dark" : "products-light"}">Products</h1>
  {#each $products as product (product.id)}
    <Product
      id={product.id}
      title={product.title}
      price={product.price}
      description={product.description}
      srcVar={product.srcVar} />
  {/each}
</section>
