<script>
  import { clearToken, loggedIn, session } from '../shared/state';
  import Boards from './Boards.svelte';
</script>

{#if $loggedIn}
  <h1>Welcome {$session.fullname}</h1>
  <button on:click={clearToken}>Log out</button>
  <Boards />
{:else}
  <h1>Hello there</h1>
  <a href="/api/login">log in</a>
{/if}
