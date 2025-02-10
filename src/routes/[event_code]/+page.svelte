<script lang="ts">
    import type { PageData } from "./$types";
    import { loadEvent } from "$lib/utils";

    const { data }: {data: PageData} = $props()

    import { CreateResponseManager } from "$lib/managers.svelte";
    // const createResponseManager = new CreateResponseManager(data.eventCode)
    
    import Timetable from "$lib/timetable.svelte";
    import TimezoneSelect from "$lib/TimezoneSelect.svelte";
    import { goto } from "$app/navigation";

    async function instantiateManager(): Promise<CreateResponseManager>{
        const event = await loadEvent(data.eventCode)

        const hostAvailability = event.availabilities.get("HOST")
        if (hostAvailability !== undefined) {
            return new CreateResponseManager(event.eventData.code, event.eventData.name, event.eventData.firstDate, hostAvailability)
        }
        else {
            throw Error("Host availability failed to retreive!")
        }
    }

</script>

{#await instantiateManager()}
    <p> Loading... </p>
{:then createResponseManager} 

<div class = "page">
    <div class = "top">
        <nav>
            <ul>
                <li><a href="">View Results</a></li>
                |
                <li><a href="">Edit this Event</a></li>
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
                goto(`/results/${data.eventCode}`)
            }else {
                window.alert("Error: Failed send!!")
            }}}
            type="submit" 
            class = "create-button">SUBMIT</button>
        
        <button class = "more-settings">
            <img src=/edit_square.svg alt = '✏️'>
            <p>Edit Submission</p>
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


