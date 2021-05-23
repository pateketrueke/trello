<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { apiCall } from '../shared/client';

  const dispatch = createEventDispatcher();

  let boards = null;
  let boardId = null;
  let boardName = '';
  let orgId = null;
  let orgs = [];

  onMount(async () => {
    const response = await apiCall('orgs');
    orgs = response.result;
  });

  function sync() {
    boardName = '';
    boardId = null;
    boards = apiCall(`boards/${orgId}`);
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
    orgId = e.target.value;
    sync();
  }

  function handleBoard(e) {
    boardId = e.target.value;
    dispatch('selection', { orgId, boardId });
  }
</script>

<fieldset>
  <label for="org-id">
    <span>Organizations</span>
    <!-- svelte-ignore a11y-no-onchange -->
    <select id="org-id" on:change={handleOrg}>
      <option disabled selected>pick one</option>
      {#each orgs as org}
        <option value={org.id}>{org.name}</option>
      {/each}
    </select>
  </label>
  {#if boards}
    <br />
    <label for="board-id">
      {#await boards}
        <span>Loading...</span>
      {:then value}
        {#if !value.result.length}
          <span>No boards were found</span>
        {:else}
          <span>Boards</span>
          <!-- svelte-ignore a11y-no-onchange -->
          <select id="board-id" on:change={handleBoard}>
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
    <br />
    <input type="text" bind:value={boardName} />
    <button on:click={addBoard} disabled={!boardName}>add a new board</button>
  {/if}
</fieldset>
