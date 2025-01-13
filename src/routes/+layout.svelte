<!-- I have made this a layout.svelte so that it applies to all files -->

<script>
    import '$lib/reset.css'
    import '$lib/global.css'

    let { children } = $props()
</script>

{@render children()}