<script lang="ts">
    import { ViewResultsManager } from "$lib/managers.svelte";
    import Timetable from "$lib/timetable.svelte";
    import TimezoneSelect from "$lib/TimezoneSelect.svelte";
    import * as settings from "$lib/settings"

    import type { PageData } from "./$types";
    import { loadEvent } from "$lib/utils";
    import EditResponsesDropDown from "$lib/EditResponsesDropDown.svelte";
    const { data }: {data: PageData} = $props()

    async function instantiateManager(): Promise<ViewResultsManager>{
        const event = await loadEvent(data.eventCode)

        if (event.eventData.selectedTime) {
            selectedTime = event.eventData.selectedTime
        }

        return new ViewResultsManager(event)
    }

    let selectedTime: Date = $state(new Date())
</script>


{#await instantiateManager()}
    <p>Loading...</p>
{:then viewResultsManager} 
{#if viewResultsManager.displayBookedScreen}
    <div class = "display-booked">
        <h2>We're meeting up at </h2>
        <h1>{selectedTime.toLocaleString("en-GB", {dateStyle: "full", timeStyle: "long"})}</h1>
        <button onclick={() => viewResultsManager.displayBookedScreen = false}>See Results</button>
    </div>
{:else }
<div class = "page">
    <div class = "top">
        <nav>
            <ul>
                <li><a href="/">New Event</a> </li>
                |
                <li><EditResponsesDropDown respondents = {viewResultsManager.highlighter.availabilityData.respondents} eventCode = {data.eventCode}/> </li>
                |
                <li><a href={`/${data.eventCode}/edit-event`}>Edit this Event</a></li>
            </ul>
        </nav>

        <div class = "event-title">
            <p class="subtitle">Here's who's coming to...</p>
            <p>{viewResultsManager.eventTitle}</p> 
            <!-- TODO: make it resize^^^^^^ -->
        </div>
    </div>

    <div class = "attendees-container">
        <p>Responses:</p>
        <ul> 
            {#each viewResultsManager.highlighter.availabilityData.respondents as respondent, i}
                <li><button onclick={() => {viewResultsManager.highlighter.selectedRespondentID = (viewResultsManager.highlighter.selectedRespondentID != i ? i : undefined)}}
                    style = {
                        (i == viewResultsManager.highlighter.selectedRespondentID ? "font-weight: bold; text-decoration: underline": "")
                        + (viewResultsManager.highlighter.availableAttendees.includes(i) ? `background-color: ${settings.GREEN}` : "")
                        }
                    >{respondent}</button></li>
                    <!-- Ugly code! But JS in HTML & CSS is rather clunky anyways-->
            {/each}
        </ul>
    </div>
    <Timetable manager = {viewResultsManager} firstDate = {viewResultsManager.highlighter.availabilityData.firstDate}/>

    <div class = "bottom">
        <TimezoneSelect bind:userTimezone = {viewResultsManager.timezone} />
        <button onclick={() => {viewResultsManager.bookTime()}} type="submit" class = "create-button">SELECT TIME</button>
        
        <a class = "add-response" href={`/${data.eventCode}`}>
            <img src=/add_box_icon.svg alt = '+'>
            <p>Add Response</p>
        </a>
    </div>
</div>
{/if}
{/await}


<style>
    div.display-booked {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    .display-booked button {
        all: unset;
        text-decoration: underline;
        cursor: pointer;
    }


    div.page {
        padding: 1rem; 
        display: grid;
        grid-template-rows: 60px 1fr 60px;
        grid-template-columns: 10em 1fr;
        grid-template-areas: 
        "top top"
        "left ." 
        /* this is so hacky lol */
        "bottom bottom";

        height: 100vh;
    }

    .top {
        display: grid;
        justify-items: center;

        grid-area: top;
    }
    nav {
        grid-area: nav;
    }
    .event-title {
        grid-area: title;

        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: x-large;
    }

    .subtitle {
        font-size: medium;
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

    .attendees-container {
        grid-area: left;
    }

    .attendees-container ul {
        flex-direction: column;
    }

    .attendees-container button {
        background: none;
        border: none;
        cursor: pointer;
    }

    .bottom {
        grid-area: bottom;
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

    .add-response {
        display: flex;
        align-items: center;

        justify-self: end;
        color: black
    }
</style>


