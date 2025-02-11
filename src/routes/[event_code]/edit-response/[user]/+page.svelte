<script lang="ts">
    import { goto } from "$app/navigation";
    import { EditResponseManager } from "$lib/managers.svelte";
    import Timetable from "$lib/timetable.svelte";
    import TimezoneSelect from "$lib/TimezoneSelect.svelte";
    import { loadEvent } from "$lib/utils";
    import type { PageData } from "./$types";

    const { data }: { data: PageData } = $props()


    async function instantiateManager(): Promise<EditResponseManager>{
        const thisEvent = await loadEvent(data.eventCode)
        const respondentUsername = data.user

        //Validate the user has responded
        if (thisEvent.availabilities.has(data.user) == false) {
            throw Error ("User with this name hasn't responded to this event!")
        }

        return new EditResponseManager(thisEvent.eventData.code, 
        thisEvent.eventData.name, 
        respondentUsername, 
        thisEvent.eventData.firstDate, 
        thisEvent.availabilities.get(respondentUsername)!, 
        thisEvent.availabilities.get("HOST")!)
    }

</script>

{#await instantiateManager()}
    <p>Loading...</p>
{:then editResponseManager} 
    
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
            <p>{editResponseManager.eventTitle}</p> 
            <!-- TODO: make it resize^^^^^^ -->
        </div>
    </div>

    <Timetable manager = {editResponseManager} firstDate = {editResponseManager.highlighter.availabilityData.firstDate}/>

    <div class = "bottom">
        <TimezoneSelect bind:userTimezone = {editResponseManager.timezone} />
        <button onclick={ async () => {
            const response = await editResponseManager.submitEdit()
            
            if (response.ok) {
                goto(`/results/${data.eventCode}`)
            }
            else {
                window.alert("Error: Edit Failed!")
            }

            }} type="submit" class = "create-button">EDIT</button>
        
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


