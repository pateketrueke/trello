<script>
  import SvgIcon from './SvgIcon.svelte';

  export let value = [];
  export let data = [];
  export let id = null;

  let term = '';

  $: filteredData = data.filter(item => {
    if (item.fullname.toLowerCase().includes(term)) return true;
    if (item.name.toLowerCase().includes(term)) return true;
    return !term;
  });

  function search(e) {
    term = e.target.value.toLowerCase();
  }

  function pick(userId) {
    if (!value.includes(userId)) {
      value = value.concat(userId);
    } else {
      value = value.filter(uid => uid !== userId);
    }
  }
</script>

<label for={id} role="search">
  <SvgIcon name="search" />
  <input type="search" {id} on:keyup={search} placeholder="Search for names..." />
</label>

<ul>
  {#each filteredData as item}
    <li>
      <label for="user-id-{item.id}">
        <input id="user-id-{item.id}" type="checkbox" checked={value.includes(item.id)} on:change={() => pick(item.id)} />
        <span>{item.name}</span>
      </label>
    </li>
  {/each}
</ul>
