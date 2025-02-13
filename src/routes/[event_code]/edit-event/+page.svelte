<script lang="ts">
    import { EditEventManager } from "$lib/managers.svelte";
    import Timetable from "$lib/timetable.svelte";
    import TimezoneSelect from "$lib/TimezoneSelect.svelte";
    import { onMount } from "svelte";
    import { loadEvent } from "$lib/utils";
    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";

    const { data }: { data: PageData } = $props()
    
    let eventTitleInput:HTMLInputElement;
    const TITLE_DEFAULT_FONT_SIZE = 24;

    function updateTitleInput() {
        const MAX_WIDTH_PROPORTION:number = 0.7;
        const HEIGHT_TO_WIDTH:number = 3/2;
        const maxWidth:number = window.innerWidth * MAX_WIDTH_PROPORTION;

        const placeHolderLength:number = "EVENT NAME".length;
        eventTitleInput.style.width = Math.max(placeHolderLength, eventTitleInput.value.length) + 'ch';  

        const fontPerfectFitSize = ((maxWidth / eventTitleInput.value.length) * HEIGHT_TO_WIDTH)

        eventTitleInput.style.fontSize = Math.min(TITLE_DEFAULT_FONT_SIZE, fontPerfectFitSize) + "px";
    }

    onMount(
        () => {window.addEventListener('resize', updateTitleInput)}
    )

    async function instantiateManager():Promise<EditEventManager> {
        const thisEvent = await loadEvent(data.eventCode)

        return new EditEventManager(thisEvent.eventData.code, 
        thisEvent.eventData.name, 
        thisEvent.availabilities.get("HOST")!,
        thisEvent.eventData.firstDate,
    ) 
    }

</script>

{#await instantiateManager()}
    <p>Loading...</p>
{:then editEventManager} 
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
            oninput={updateTitleInput}
            style="--default-font-size: {TITLE_DEFAULT_FONT_SIZE}; --starting-width: {editEventManager.eventTitle.length}ch"
            bind:value={editEventManager.eventTitle}
            >

            <button onpointerdown={() => eventTitleInput.focus()}><img src="/edit_square.svg" alt='✏️'></button>
        </div>
    </div>

    <Timetable manager = {editEventManager} firstDate = {editEventManager.highlighter.availabilityData.firstDate}/>

    <div class = "bottom">
        <TimezoneSelect bind:userTimezone = {editEventManager.timezone} />
        <button onclick={ async () => {
            const response = await editEventManager.editEvent()
            
            if (response.ok) {
                goto(`/${data.eventCode}/results`)
            }
            else {
                window.alert("Error! Failed to Edit Event!")
            }

            }} type="submit" class = "create-button">EDIT</button>
        <button class = "more-settings">
            <img src=/settings.svg alt = '⚙️'>
            <p>More Settings</p>
        </button>
    </div>
</div>
    
{/await}


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

    .event-title input {
        box-sizing: content-box;
        width: var(--starting-width);
        font-size: var(--title-default-font-size);
    }

    .event-title button {
        all: unset;
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


