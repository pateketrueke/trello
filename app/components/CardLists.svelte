<script>
  import { apiCall } from '../shared/client';
  import MemberList from './MemberList.svelte';

  export let boardId = null;

  const emptyCard = {
    name: '',
    description: '',
    dueDate: '',
    members: [],
  };

  let editing = false;
  let saving = false;
  let isValid = false;
  let isNew = false;
  let users = [];
  let cards = null;
  let card = { ...emptyCard };

  function getData() {
    return apiCall(`cards/${boardId}`)
      .then(({ result }) => {
        users = result.members;
        return result.groups;
      });
  }

  function cancel() {
    card = { ...emptyCard };
    isNew = false;
    saving = null;
    editing = null;
  }

  async function sync() {
    cancel();
    cards = await getData();
  }

  $: if (boardId) cards = getData();
  $: isValid = card.name && card.description && card.dueDate;

  function save() {
    saving = apiCall(`cards/${editing}`, {
      method: isNew ? 'POST' : 'PUT',
      body: JSON.stringify(card),
    }).then(sync);
  }

  function rmTask(taskInfo, listName) {
    if (!confirm('you sure?')) return; // eslint-disable-line
    apiCall(`cards/${taskInfo.id}`, {
      body: JSON.stringify({
        task: taskInfo,
        list: listName,
      }),
      method: 'DELETE',
    }).then(sync);
  }

  function setTask(taskInfo) {
    isNew = false;
    card = taskInfo;
    editing = taskInfo.id;
  }

  function addTask(listId) {
    isNew = true;
    editing = listId;
    card = { ...emptyCard };
  }
</script>

<ul>
  {#await cards}
    <li>Loading...</li>
  {:then groups}
    {#each groups as list}
      <li>
        <h3>{list.name}</h3>
        <ul>
          {#each list.activities as task}
            <li>
              <span>{task.name}</span>
              <br />
              <button on:click={() => setTask(task)}>edit task</button>
              <button on:click={() => rmTask(task, list.name)}>delete task</button>
            </li>
          {:else}
            <li>No tasks were found</li>
          {/each}
        </ul>
        <button on:click={() => addTask(list.id)}>add a new task</button>
      </li>
    {:else}
      <li>No lists were found</li>
    {/each}
  {:catch e}
    <li>{e.message}</li>
  {/await}
</ul>

{#await saving}
  <span>Saving...</span>
{:then}
  {#if editing}
    <label for="card-name">
      <span>name</span>
      <input id="card-name" type="text" bind:value={card.name} />
    </label>
    <label for="card-description">
      <span>description</span>
      <textarea id="card-description" bind:value={card.description}></textarea>
    </label>
    <label for="card-due-date">
      <span>dueDate</span>
      <input id="card-due-date" type="date" bind:value={card.dueDate} />
    </label>
    <br />
    <label for="card-members">
      <span>Members</span>
      <MemberList id="card-members" data={users} bind:value={card.members} />
    </label>
    <button on:click={save} disabled={!isValid}>save task</button>
    <button on:click={cancel}>cancel</button>
  {/if}
{:catch e}
  <span>{e.message}</span>
{/await}
