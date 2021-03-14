<script>
    import AdoptItem from "./AdoptItem.svelte"
    export let frogs;
</script>

<style>
section {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
}

@media (min-width: 768px) {
  section {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>


<section id="frogs">
    {#each frogs as frog}
    <AdoptItem 
    title={frog.title}
    subtitle={frog.subtitle}
    description={frog.description} 
    imageUrl={frog.imageUrl} 
    address={frog.address} 
    email={frog.contact}
    isFavItem={frog.isFavourite}
    id={frog.id}
    on:toggle-favourite on:adopt-event/>
    {/each}
</section>
    