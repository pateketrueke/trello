<script>
  export let name = '';
  export let size = 16;
  export let style = null;
</script>

<svg width={size} height={size} {style}>
  <use xlink:href="#icon-{name}"></use>
</svg>
