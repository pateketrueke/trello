<script>
  export let name = '';
  export let size = 24;
  export let style = {};
</script>

<svg width={size} height={size} {style}>
  <use xlink:href="#icon-{name}"></use>
</svg>
