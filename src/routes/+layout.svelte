<!-- I have made this a layout.svelte so that it applies to all files -->

<script>
    import '$lib/reset.css'
    import '$lib/global.css'

    let { children } = $props()
</script>

<svelte:head>
    <title>isFridayGood - Find a time for all your friends</title>
    <link rel="icon" type="image/svg" href={"/favicon.png"} />
</svelte:head>
{@render children()}