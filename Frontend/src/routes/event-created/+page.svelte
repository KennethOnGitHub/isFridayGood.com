<script lang="ts">

    const shareURL = "isFridaygood.com/test123";

    const eventTitle = "TestTitle"
    

    let linkContainer:HTMLButtonElement;

    interface screenCoords {
        x:number;
        y:number;
    }

    let copiedNotifsPositions:screenCoords[] = $state([]);
    $inspect(copiedNotifsPositions);

    async function handleLinkClick() {
        try {
            await navigator.clipboard.writeText(shareURL);
        } catch (e) {
            window.alert(e);
        }

        const deviation_x = linkContainer.clientWidth * Math.random();
        const deviation_y = linkContainer.clientHeight * Math.random();

        const startPos:screenCoords = {
            x: linkContainer.offsetLeft + deviation_x, 
            y: linkContainer.offsetTop + deviation_y
        };

        copiedNotifsPositions.push(startPos)
    }
</script>

<div class="page">
    <h1>EVENT CREATED!</h1>
    <p>Send this link to invite your friends!</p>
    <button class = link-container onclick={handleLinkClick} bind:this={linkContainer}>
        <p>{shareURL}</p><img alt='📋' src="/copy.svg"> 
    </button>
    <button class = "share" onclick={() => {
        navigator.share({
            title: "Share Invite", 
            text: "I'm inviting you to " + eventTitle + "!", 
            url: "https://" + shareURL})}}>
        <img alt = "test" src='/share.svg'>
        <p>Share</p>
    </button>

    <a href={shareURL} class = view-results>
        View Results
    </a>

    {#each copiedNotifsPositions as position}
        <p class = copied-notif style="top: {position.y}px; left: {position.x}px ">Copied!</p>
    {/each}
</div>

<style>
    div.page {
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1em;
    }

    h1 {
        font-weight: normal;
    }

    .link-container {
        all: unset;
        cursor: pointer;
        display: flex;
        border-radius: 2px;
        padding: 0.2em;
        background-color: lightgrey;
        color: #2400ee;

        border: 1px solid black;

        text-decoration: underline;
    }

    .share {
        all:unset;

        cursor: pointer;
        display: flex;
        gap: 0.3em;
    }

    .view-results {
        text-decoration: underline;
        margin-top: 10em;
        color: black;
    }

    @keyframes slideUp{
    from {
        transform: translateY(0%);
        opacity: 100%;
    }
    to {
        transform: translateY(-50vh);
        opacity: 0%;
    }
    }
    .copied-notif {
        position: absolute;
        opacity: 0%;
        animation: slideUp 1s;
        animation-fill-mode: forwards;
    }
</style>