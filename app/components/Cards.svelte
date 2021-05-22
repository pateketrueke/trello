<script>
  export let cards = [];

  function addCard() {
  }
</script>

<ul>
  {#each cards as card}
    <li>{card.name}</li>
  {:else}
    <li>No cards were found</li>
  {/each}
</ul>

<button on:click={addCard}>add a new card</button>
