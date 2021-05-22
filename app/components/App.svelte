<script>
  import { onMount } from 'svelte';

  let resp = '';
  onMount(async () => {
    resp = await fetch('/api').then(x => x.text());
  });
</script>
<h1>It works.</h1>
{@html resp}
