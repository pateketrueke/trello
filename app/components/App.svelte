<script>
  import { clearToken, loggedIn, session } from '../shared/state';
  import Boards from './Boards.svelte';
  import CardLists from './CardLists.svelte';

  let boardId = null;
  function displayCards(e) {
    boardId = e.detail.boardId;
  }
</script>

{#if $loggedIn}
  <h1>Welcome {$session.fullname}</h1>
  <button on:click={clearToken}>Log out</button>
  <Boards on:selection={displayCards} />
  {#if boardId}
    <CardLists {boardId} />
  {/if}
{:else}
  <h1>Hello there</h1>
  <a href="/api/login">log in</a>
{/if}
