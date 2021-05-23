<script>
  import { apiCall } from '../shared/client';

  export let boardId = null;

  let cards = null;

  async function sync() {
    cards = await apiCall(`cards/${boardId}`);
  }

  $: if (boardId) cards = apiCall(`cards/${boardId}`)

  function rmTask(taskId) {
    if (!confirm('you sure?')) return; // eslint-disable-line
    apiCall(`cards/${taskId}`, {
      method: 'DELETE',
    }).then(sync);
  }

  function setTask(taskId) {
    const name = prompt('new task name?'); // eslint-disable-line
    if (name) {
      apiCall(`cards/${taskId}`, {
        body: JSON.stringify({ name }),
        method: 'PUT',
      }).then(sync);
    }
  }

  function addTask(listId) {
    const name = prompt('task name?'); // eslint-disable-line
    if (name) {
      apiCall(`cards/${listId}`, {
        body: JSON.stringify({ name }),
        method: 'POST',
      }).then(sync);
    }
  }
</script>

<table>
  <tr>
    {#await cards}
      <td>Loading...</td>
    {:then groups}
      {#each groups.result as list}
        <td>
          <h4>{list.name}</h4>
          <ul>
            {#each list.activities as task}
              <li>
                <span>{task.name}</span>
                <br />
                <button on:click={() => setTask(task.id)}>update task</button>
                <button on:click={() => rmTask(task.id)}>delete task</button>
              </li>
            {:else}
              <li>No tasks were found</li>
            {/each}
          </ul>
          <button on:click={() => addTask(list.id)}>add a new task</button>
        </td>
      {:else}
        <td>No lists were found</td>
      {/each}
    {:catch e}
      <td>{e.message}</td>
    {/await}
  </tr>
</table>
