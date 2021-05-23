<script>
  import { clearToken, loggedIn, session } from '../shared/state';
  import Boards from './Boards.svelte';
  import SvgIcon from './SvgIcon.svelte';
  import CardLists from './CardLists.svelte';

  let boardId = null;
  function displayCards(e) {
    boardId = e.detail.boardId;
  }
</script>

{#if $loggedIn}
  <h2>Welcome {$session.fullname}</h2>
  <button on:click={clearToken}>
    <span>Log out</span>
    <SvgIcon name="logout" />
  </button>
  <Boards on:selection={displayCards} />
  {#if boardId}
    <CardLists {boardId} />
  {/if}
{:else}
  <h2>Hello there</h2>
  <a href="/api/login">log in</a>
{/if}
