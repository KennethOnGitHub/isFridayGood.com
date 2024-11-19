<script lang="ts">
    import Timetable from "$lib/timetable.svelte";
    import { onMount } from "svelte";
    import type { HTMLInputTypeAttribute } from "svelte/elements";

    const timezones: number[] = []
    const furthestAheadTimeZone = 14; //Kiribati
    const furthestBehindTimeZone = -12 //Baker Islands, USA
    for (let i = furthestBehindTimeZone; i <= furthestAheadTimeZone; i++) {
        timezones.push(i)
    }

    const minuteDifferenceBetweenUTCandLocal:number = new Date().getTimezoneOffset();
    const userTimeZone:number = -(minuteDifferenceBetweenUTCandLocal / 60);
    
    /*We have to make it negative as Date().getTimezoneOffset returns UTC - Local.
    This means that if local is ahead, Date().getTimezoneOffset returns a negative and if local is behind it returns a positive
    But since timezones are written as how many hours +/- UTC/GMT, I need to make the number negative when it is behind and positive
    when it is ahead*/

    let eventTitleInput:HTMLInputElement
    const TITLE_DEFAULT_FONT_SIZE = 24;

    function updateTitleInput() {
        const MAX_WIDTH_PROPORTION:number = 0.7;
        const HEIGHT_TO_WIDTH:number = 3/2;
        const maxWidth:number = window.innerWidth * MAX_WIDTH_PROPORTION;

        const PLACE_HOLDER_LENGTH:number = "EVENT NAME".length;
        eventTitleInput.style.width = Math.max(PLACE_HOLDER_LENGTH, eventTitleInput.value.length) + 'ch';  

        eventTitleInput.style.fontSize = Math.min(TITLE_DEFAULT_FONT_SIZE, ((maxWidth / eventTitleInput.value.length) * HEIGHT_TO_WIDTH)) + "px" 
    }

    onMount(
        () => {window.addEventListener('resize', updateTitleInput)}
    )


</script>

<div class = "page">
    <div class = "top">
        <nav>
            <ul>
                <li><a href="">View Results</a></li>
                |
                <li><a href="">Respond to an invite</a></li>
            </ul>
        </nav>

        <div class = "event-title">
            <input bind:this={eventTitleInput} 
            placeholder="EVENT NAME" 
            maxlength="48"
            on:input={updateTitleInput}
            style="--default-font-size: {TITLE_DEFAULT_FONT_SIZE}"
            >

            <button on:click={() => eventTitleInput.focus()}><img src="/edit_square.svg" alt='✏️'></button>
        </div>
    </div>

    <Timetable />

    <div class = "bottom">
        <div class = "time-zone-select">
            <img src = /globe.svg alt=🌐>
            <p>TIME ZONE:</p>
            <select name = "time zone">
                {#each timezones as timezone}
                    {#if timezone == userTimeZone}
                        <option value = {timezone} selected>{`GMT${timezone >= 0 ? '+' : ''}${timezone}`}</option>
                    {:else}
                        <option value = {timezone}>{`GMT${timezone >= 0 ? '+' : ''}${timezone}`}</option>
                    {/if}
                    
                {/each}
            </select>
        </div>
        <button class = "create-button">CREATE</button>
        <button class = "more-settings">
            <img src=/settings.svg alt = '⚙️'>
            <p>More Settings</p>
        </button>
    </div>
</div>

<style>
    div.page {
        padding: 1rem; 
        display: grid;
        grid-template-rows: 60px 1fr 60px;

        height: 100vh;
    }

    .top {
        display: grid;
        justify-items: center;
    }
    nav {
        grid-area: nav;
    }
    .event-title {
        grid-area: title;

        display: flex;
        font-size: x-large;
    }

    .event-title button {
        all: unset;
        cursor: pointer;
    }

    .event-title input {
        font-size: var(--title-default-font-size);
    }

    .time-zone-select select {
        border: none;
        background: none;
        cursor: pointer;
    }

    @media screen and (max-width: 1000px) {
        .top {
            grid-template-areas: 'nav'
            'title';
        }
    }
    @media not screen and (max-width: 1000px) {
        .top {
            grid-template-columns: 1fr 2fr 1fr;
            grid-template-areas: '. title nav'
        }
        nav {
            justify-self: end;
        }
    }

    ul{
        display: flex;
        list-style: none;
    }

    li a {
        color: black;
    }

    .event-title input {
        box-sizing: content-box;
        width: 10ch;
    }

    .bottom {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-content: space-between;
        justify-items: center;
    }
    .time-zone-select {
        display: flex;
        align-items: center;
        justify-self: start;
    }

    .create-button {
        font-size: xx-large;
        cursor: pointer;
        filter: drop-shadow(2px 4px 1px #0000006f)
    }

    .create-button:active {
        transform: translate(1px, 2px);
        filter: none;
    }

    .more-settings {
        all: unset;
        display: flex;
        align-items: center;
        cursor: pointer;

        justify-self: end;
    }
    .more-settings p {
        text-decoration: underline;
    }
</style>


