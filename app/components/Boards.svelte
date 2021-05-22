<script>
  import { onMount } from 'svelte';
  import { apiCall } from '../shared/client';

  let orgs = [];

  onMount(async () => {
    const response = await apiCall('orgs');
    orgs = response.result;
  });
</script>
<h3>Orgs</h3>
<ul>
  {#each orgs as org}
    <li>{org.name}</li>
  {/each}
</ul>
