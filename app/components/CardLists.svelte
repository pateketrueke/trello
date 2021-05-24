<script>
  import Fence from 'smoo/src/components/Fence.svelte';
  import Search from 'smoo/src/components/Search.svelte';
  import { apiCall } from '../shared/utils';
  import SvgIcon from './SvgIcon.svelte';

  export let boardId = null;

  const keys = ['name', 'fullname'];
  const emptyCard = {
    name: '',
    description: '',
    dueDate: '',
    members: [],
  };

  let editing = false;
  let saving = false;
  let isValid = false;
  let isOpen = false;
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
    isOpen = false;
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
    if (!confirm('Are you sure?')) return; // eslint-disable-line
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
    isOpen = true;
    card = taskInfo;
    editing = taskInfo.id;
  }

  function addTask(listId) {
    isNew = true;
    isOpen = true;
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
        <h3><SvgIcon name="directory" /> {list.name}</h3>
        <ul>
          {#each list.activities as task}
            <li>
              <span>{task.name}</span>
              <span>
                <button on:click={() => setTask(task)}>
                  <SvgIcon name="edition" />
                </button>
                <button on:click={() => rmTask(task, list.name)}>
                  <SvgIcon name="trash" />
                </button>
              </span>
            </li>
          {:else}
            <li>No tasks were found</li>
          {/each}
        </ul>
        <button on:click={() => addTask(list.id)}>
          <SvgIcon name="document" />
          <span>Add a new task</span>
        </button>
      </li>
    {:else}
      <li>No lists were found</li>
    {/each}
  {:catch e}
    <li>{e.message}</li>
  {/await}
</ul>

<Fence modal autofocus bind:visible={isOpen} on:cancel={cancel} on:submit={save}>
  <fieldset>
    {#await saving}
      <span>Saving...</span>
    {:then}
      {#if editing}
        <h2>{isNew ? 'New task' : 'Editing task'}</h2>
        <div>
          <label for="card-name">Name or title</label>
          <input id="card-name" type="text" bind:value={card.name} />
        </div>
        <div>
          <label for="card-description">Description</label>
          <textarea id="card-description" bind:value={card.description}></textarea>
        </div>
        <div>
          <label for="card-due-date">Due date</label>
          <input id="card-due-date" type="date" bind:value={card.dueDate} />
        </div>
        <div>
          <label for="card-members">Assigned to</label>
          <Search multiple id="card-members" {keys} data={users} bind:value={card.members}>
            <SvgIcon slot="before" name="search" />
          </Search>
        </div>
        <div>
          <button type="submit" disabled={!isValid}>Save task</button>
          <button type="button" on:click={cancel}>Cancel</button>
        </div>
      {/if}
    {:catch e}
      <span>{e.message}</span>
    {/await}
  </fieldset>
</Fence>
