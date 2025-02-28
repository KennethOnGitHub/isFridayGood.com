<script lang="ts">
    import { goto } from "$app/navigation";
    import { EventCreationManager } from "$lib/managers.svelte";
    const eventCreationManager = new EventCreationManager();
    import Timetable from "$lib/timetable.svelte";
    import TimezoneSelect from "$lib/TimezoneSelect.svelte";
    import { json } from "@sveltejs/kit";
    import { onMount } from "svelte";
    
    let eventTitleInput:HTMLInputElement;
    const TITLE_DEFAULT_FONT_SIZE = 24;

    function updateTitleInput() {
        const MAX_WIDTH_PROPORTION:number = 0.7;
        const HEIGHT_TO_WIDTH:number = 3/2;
        const maxWidth:number = window.innerWidth * MAX_WIDTH_PROPORTION;

        const PLACE_HOLDER_LENGTH:number = "EVENT NAME".length;
        eventTitleInput.style.width = Math.max(PLACE_HOLDER_LENGTH, eventTitleInput.value.length) + 'ch';  

        const fontPerfectFitSize = ((maxWidth / eventTitleInput.value.length) * HEIGHT_TO_WIDTH)

        eventTitleInput.style.fontSize = Math.min(TITLE_DEFAULT_FONT_SIZE, fontPerfectFitSize) + "px";
    }

    onMount(
        () => {window.addEventListener('resize', updateTitleInput)}
    )


</script>

<div class = "page">
    <div class = "top">
        <nav>
            <ul>
                <li>
                    <button class = "event-nav-button" onclick={() => {
                        const eventCode = prompt("Enter Event Code")
                        if (eventCode != null) {
                            goto(`${eventCode}/results`)
                        }
                    }}>View An Event</button>
                </li>
                |
                <li>
                    <button class = "event-nav-button" onclick={() => {
                        const eventCode = prompt("Enter Event Code")
    
                        if (eventCode != null) {
                            goto(eventCode)
                        }
                    }}>Respond to Invite</button>
                </li>
            </ul>
        </nav>

        <div class = "top-middle">
            <div class = "event-title">
                <input bind:this={eventTitleInput} 
                placeholder="EVENT NAME" 
                maxlength="48"
                oninput={updateTitleInput}
                style="--default-font-size: {TITLE_DEFAULT_FONT_SIZE}"
                bind:value={eventCreationManager.eventTitle}
                >
    
                <button onpointerdown={() => eventTitleInput.focus()}><img src="/edit_square.svg" alt='✏️'></button>
            </div>

            <p class = instruction-text>Click on when <span style="text-decoration: underline; font-weight: bold;">you</span> are free!</p>
        </div>
    </div>

    <Timetable manager = {eventCreationManager} firstDate = {new Date()}/>

    <div class = "bottom">
        <TimezoneSelect bind:userTimezone = {eventCreationManager.timezone} />
        <button onclick={ async () => {
            const response = await eventCreationManager.submitEvent();

            if (response.ok) {
                const { eventCode } = await response.json()
                goto(`/${eventCode}/event-created`)
            }else {
                window.alert("Error: Failed to Create Event!")
            }
        }} 
        type="submit" 
        class = "create-button">CREATE</button>
    </div>
</div>

<style>
    div.page {
        padding: 1rem; 
        display: grid;
        grid-template-rows: 70px 1fr 60px;

        height: 100dvh;
    }

    .top {
        display: grid;
        justify-items: center;
    }
    nav {
        grid-area: nav;
    }

    .top-middle {
        grid-area: title;

        display: grid;
        justify-items: center;
    }
    .event-title {
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

    .instruction-text {
        font-size:medium;
    }

    .event-nav-button {
        all: unset;
        text-decoration: underline;
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

    .create-button {
        font-size: xx-large;
        cursor: pointer;
        filter: drop-shadow(2px 4px 1px #0000006f)
    }

    .create-button:active {
        transform: translate(1px, 2px);
        filter: none;
    }
</style>


