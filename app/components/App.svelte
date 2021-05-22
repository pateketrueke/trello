<script>
  import { clearToken, loggedIn, session } from '../shared/state';
  import { apiCall } from '../shared/client';
  import Boards from './Boards.svelte';
  import Cards from './Cards.svelte';

  let cards = null;
  function displayCards(e) {
    cards = null;
    if (e.detail.boardId) {
      cards = apiCall(`cards/${e.detail.boardId}`);
    }
  }
</script>

{#if $loggedIn}
  <h1>Welcome {$session.fullname}</h1>
  <button on:click={clearToken}>Log out</button>
  <Boards on:selection={displayCards} />
  {#if cards}
    {#await cards}
      <span>Loading...</span>
    {:then value}
      <Cards cards={value.result} />
    {:catch e}
      <span>{e.message}</span>
    {/await}
  {/if}
{:else}
  <h1>Hello there</h1>
  <a href="/api/login">log in</a>
{/if}
