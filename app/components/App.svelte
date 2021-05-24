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
  <fieldset>
    <h2>
      Welcome {$session.fullname}
      <button on:click={clearToken}>
        <span>Log out</span>
        <SvgIcon name="logout" />
      </button>
    </h2>
    <Boards on:selection={displayCards} />
  </fieldset>
  {#if boardId}
    <CardLists {boardId} />
  {/if}
{:else}
  <h2>Hello there,</h2>
  Please <a href="/api/login">log in</a>.
{/if}
