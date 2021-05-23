<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { apiCall, getLocal, setLocal } from '../shared/utils';

  const dispatch = createEventDispatcher();

  let boards = null;
  let boardId = getLocal('board_id');
  let boardName = '';
  let orgId = getLocal('org_id');
  let orgs = [];

  function sync(keep) {
    boardName = '';
    boards = apiCall(`boards/${orgId}`);
    if (!keep) {
      setLocal('board_id', boardId = null);
    }
    dispatch('selection', { orgId, boardId });
  }

  function rmBoard() {
    if (!confirm('you sure?')) return; // eslint-disable-line
    apiCall(`boards/${boardId}`, {
      method: 'DELETE',
    }).then(sync);
  }

  function addBoard() {
    apiCall(`boards/${orgId}`, {
      body: JSON.stringify({ name: boardName }),
      method: 'POST',
    }).then(sync);
  }

  function handleOrg(e) {
    setLocal('org_id', orgId = e.target.value);
    sync();
  }

  function handleBoard(e) {
    setLocal('board_id', boardId = e.target.value);
    dispatch('selection', { orgId, boardId });
  }

  onMount(async () => {
    const response = await apiCall('orgs');
    orgs = response.result;
    if (orgId) sync(true);
  });
</script>

<label for="org-id">
  <span>Organizations</span>
  <!-- svelte-ignore a11y-no-onchange -->
  <select id="org-id" on:change={handleOrg} value={orgId}>
    <option disabled selected>pick one</option>
    {#each orgs as org}
      <option value={org.id}>{org.name}</option>
    {/each}
  </select>
</label>
{#if boards}
  <label for="board-id">
    {#await boards}
      <span>Loading...</span>
    {:then value}
      {#if !value.result.length}
        <span>No boards were found</span>
      {:else}
        <span>Boards</span>
        <!-- svelte-ignore a11y-no-onchange -->
        <select id="board-id" on:change={handleBoard} value={boardId}>
          <option disabled selected>pick one</option>
          {#each value.result as board}
            <option value={board.id}>{board.name}</option>
          {/each}
        </select>
        {#if boardId}
          <button on:click={rmBoard}>delete board</button>
        {/if}
      {/if}
    {:catch e}
      <span>{e.message}</span>
    {/await}
  </label>
  <input type="text" bind:value={boardName} />
  <button on:click={addBoard} disabled={!boardName}>add a new board</button>
{/if}
