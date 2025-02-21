<script lang="ts">
    import type { PageData } from "./$types";
    import { loadEvent } from "$lib/utils";

    const { data }: {data: PageData} = $props()

    import { CreateResponseManager } from "$lib/managers.svelte";
    // const createResponseManager = new CreateResponseManager(data.eventCode)
    
    import Timetable from "$lib/timetable.svelte";
    import TimezoneSelect from "$lib/TimezoneSelect.svelte";
    import { goto } from "$app/navigation";
    import EditResponsesDropDown from "$lib/EditResponsesDropDown.svelte";

    async function instantiateManager(): Promise<CreateResponseManager>{
        const event = await loadEvent(data.eventCode)

        respondents = event.availabilities.keys().toArray()

        const hostAvailability = event.availabilities.get("HOST")
        if (hostAvailability !== undefined) {
            return new CreateResponseManager(event.eventData.code, event.eventData.name, event.eventData.firstDate, hostAvailability)
        }
        else {
            throw Error("Host availability failed to retreive!")
        }
    }

    let respondents:string[] = $state([])
</script>

{#await instantiateManager()}
    <p> Loading... </p>
{:then createResponseManager} 

<div class = "page">
    <div class = "top">
        <nav>
            <ul>
                <li><EditResponsesDropDown {respondents} eventCode = {data.eventCode}/> </li>
                |
                <li><a href= '/'>Create New Event</a></li>
            </ul>
        </nav>

        <div class = "event-title">
            <p class="subtitle">You've been invited to...</p>
            <p>{createResponseManager.eventTitle}</p> 
            <!-- TODO: make it resize^^^^^^ -->
        </div>
    </div>

    <Timetable manager = {createResponseManager} firstDate = {createResponseManager.highlighter.availabilityData.firstDate}/>

    <div class = "bottom">
        <TimezoneSelect bind:userTimezone = {createResponseManager.timezone} />
        <button onclick={ async () => {

            let username = prompt("Input username: ")

            //Validating
            while (!username) {
                username = prompt("Username was empty, enter name:")
            }

            const response = await createResponseManager.submitResponse(username)

            if (response.ok) {
                goto(`/${data.eventCode}/results`)
            }else {
                window.alert("Error: Failed send!!")
            }}}
            type="submit" 
            class = "create-button">SUBMIT</button>
        
        <a class = "view-results" href={`/${data.eventCode}/results`}>
            <img src=/tick_calendar.svg alt = '📅'>
            <p>View Results</p>
        </a>
    </div>
</div>
{/await}

<style>
    div.page {
        padding: 1rem; 
        display: grid;
        grid-template-rows: 60px 1fr 60px;

        height: 100dvh;
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

    .view-results {
        display: flex;
        align-items: center;

        justify-self: end;
        color: black
    }
</style>


