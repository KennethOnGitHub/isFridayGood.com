<script lang="ts">

    let linkContainer:HTMLButtonElement;

    interface screenCoords {
        x:number;
        y:number;
    }

    interface notifData {
        start: screenCoords,
        end: screenCoords,
    }

    let copiedNotifs:notifData[] = $state([]);
    $inspect(copiedNotifs);

    function handleLinkClick() {
        navigator.clipboard.writeText("TEST")

        const deviation_x = linkContainer.clientWidth * Math.random();
        const deviation_y = linkContainer.clientHeight * Math.random();

        const startPos:screenCoords = {x: linkContainer.offsetLeft + deviation_x, y: linkContainer.offsetTop + deviation_y};
        const endPos:screenCoords = {x: 0, y: 0}

        const newNotif: notifData = {
            start: startPos,
            end: endPos,
        }

        copiedNotifs.push(newNotif)
    }
</script>

<div class="page">
    <h1>EVENT CREATED!</h1>
    <h2>Send this link to invite your friends!</h2>
    <button class = link-container onclick={handleLinkClick} bind:this={linkContainer}>
        <p>isFridayGood.com/[slug]</p><img alt='📋' src="/copy.svg"> 
    </button>
    {#each copiedNotifs as copiedNotif}
        <p class = copied-notif style="top: {copiedNotif.start.y}px; left: {copiedNotif.start.x}px">Copied!</p>
    {/each}
</div>

<style>
    div.page {
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .link-container {
        all: unset;
        cursor: pointer;
        display: flex;
        border-radius: 2px;
        padding: 0.1em;
        background-color: lightgrey;

        border: darkgrey;

        text-decoration: underline;
    }

    .copied-notif {
        position: absolute;
    }
</style>